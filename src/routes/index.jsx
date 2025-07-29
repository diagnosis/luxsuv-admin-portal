import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Ensure hooks are consistently called
  useEffect(() => {
    // This effect runs on mount to ensure consistent hook calls
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to login
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
}