import { FiSearch, FiFilter } from 'react-icons/fi';

export default function UserFilters({ filters, onFilterChange, availableFilters }) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange({ search: value });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              defaultValue={filters.search}
              onChange={handleSearchChange}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <FiFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Filters:</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="label">Role</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange({ role: e.target.value })}
            className="input"
          >
            <option value="">All Roles</option>
            {availableFilters?.roles?.map(role => (
              <option key={role} value={role}>
                {role.replace('_', ' ').charAt(0).toUpperCase() + role.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="input"
          >
            <option value="">All Statuses</option>
            {availableFilters?.statuses?.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Items per page</label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
            className="input"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({
              role: '',
              status: '',
              search: '',
              page: 1
            })}
            className="btn-secondary w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}