import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback } from 'react';
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
        set({ isLoading: true });
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (!token || !user) {
          set({ 
            isAuthenticated: false, 
            isLoading: false,
            user: null,
            token: null
          });
          return false;
        }

        try {
          // Validate token by calling /users/me
          const response = await authAPI.validateToken();
          set({
            user: response.data || JSON.parse(user),
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return true;
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          return false;
        }
      },

      // Create a stable reference for checkAuth
      useStableCheckAuth: () => {
        const checkAuth = useAuthStore(state => state.checkAuth);
        return useCallback(checkAuth, []);
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