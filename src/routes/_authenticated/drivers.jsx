import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { driverAPI } from '../../lib/api';
import DriverTable from '../../components/drivers/DriverTable';
import DriverFilters from '../../components/drivers/DriverFilters';
import DriverStats from '../../components/drivers/DriverStats';
import DriverMapView from '../../components/drivers/DriverMapView';
import { FiMap, FiList } from 'react-icons/fi';

export const Route = createFileRoute('/_authenticated/drivers')({
  component: DriversPage,
});

function DriversPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    rating_min: '',
    availability: ''
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['drivers', filters],
    queryFn: () => driverAPI.getDrivers(filters).then(res => res.data),
    refetchInterval: 15000, // Refresh every 15 seconds for location updates
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiList className="w-4 h-4 mr-2 inline" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiMap className="w-4 h-4 mr-2 inline" />
              Map View
            </button>
          </div>
        </div>
      </div>

      {data?.summary && <DriverStats summary={data.summary} />}

      <div className="card">
        <DriverFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="card">
        {viewMode === 'list' ? (
          <DriverTable
            data={data}
            isLoading={isLoading}
            error={error}
            onRefresh={refetch}
          />
        ) : (
          <DriverMapView
            drivers={data?.drivers || []}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}