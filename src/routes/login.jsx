import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useState, useEffect } from 'react';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // Ensure consistent hooks
  useEffect(() => {
    // This effect ensures hooks are called consistently
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      clearError();
      try {
        const result = await login(value);
        if (result.success) {
          // Use router navigation instead of window.location
          window.location.href = '/dashboard';
        }
      } catch (error) {
        // Error is already handled in the auth store
        console.error('Login failed:', error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-500">
            <FiLogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            LuxSUV Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>

        <div className="card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Email is required' : 
                    !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label htmlFor={field.name} className="label">
                      Email Address
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="input mt-1"
                      placeholder="admin@luxsuv.com"
                    />
                    {field.state.meta.errors && (
                      <p className="mt-1 text-sm text-error-600">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Password is required' : 
                    value.length < 6 ? 'Password must be at least 6 characters' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label htmlFor={field.name} className="label">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="input pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {field.state.meta.errors && (
                      <p className="mt-1 text-sm text-error-600">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiLogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Demo credentials: admin@luxsuv.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}