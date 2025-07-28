import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { token, user } = response.data;
          
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (!token || !user) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          set({ isLoading: true });
          await authAPI.getSession();
          set({
            user: JSON.parse(user),
            token,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } catch (error) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          return false;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);