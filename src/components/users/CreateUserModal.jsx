import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { userAPI } from '../../lib/api';
import { FiX, FiUser, FiMail, FiLock } from 'react-icons/fi';

export default function CreateUserModal({ onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserMutation = useMutation({
    mutationFn: (userData) => userAPI.createUser(userData),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    }
  });

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'rider',
      send_welcome_email: true,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await createUserMutation.mutateAsync(value);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="p-6 space-y-4"
        >
          <div>
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Username is required' : 
                  value.length < 3 ? 'Username must be at least 3 characters' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="label">
                    <FiUser className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input mt-1"
                    placeholder="john_doe"
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
                    <FiMail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input mt-1"
                    placeholder="john@example.com"
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
                    <FiLock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input mt-1"
                    placeholder="••••••••"
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
            <form.Field name="role">
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="label">
                    Role
                  </label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input mt-1"
                  >
                    <option value="rider">Rider</option>
                    <option value="driver">Driver</option>
                    <option value="super_driver">Super Driver</option>
                    <option value="dispatcher">Dispatcher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="send_welcome_email">
              {(field) => (
                <div className="flex items-center">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
                    Send welcome email
                  </label>
                </div>
              )}
            </form.Field>
          </div>

          {createUserMutation.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">
                {createUserMutation.error.response?.data?.error || 'Failed to create user'}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}