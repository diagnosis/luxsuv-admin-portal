import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { userAPI } from '../../lib/api';
import UserTable from '../../components/users/UserTable';
import UserFilters from '../../components/users/UserFilters';
import CreateUserModal from '../../components/users/CreateUserModal';
import { FiPlus } from 'react-icons/fi';

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
});

function UsersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    role: '',
    status: '',
    search: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userAPI.getUsers(filters).then(res => res.data),
    keepPreviousData: true,
    onError: (error) => {
      console.error('Failed to fetch users:', error);
    }
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="card">
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          availableFilters={data?.filters}
        />
      </div>

      <div className="card">
        <UserTable
          data={data}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onRefresh={refetch}
        />
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}