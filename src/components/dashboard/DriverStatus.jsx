import { useQuery } from '@tanstack/react-query';
import { driverAPI } from '../../lib/api';
import { FiCircle } from 'react-icons/fi';

const statusColors = {
  'online': 'text-green-500',
  'busy': 'text-yellow-500',
  'offline': 'text-gray-400'
};

export default function DriverStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['driver-status'],
    queryFn: () => driverAPI.getDrivers({ limit: 8 }),
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const drivers = data?.drivers || [];
  const summary = data?.summary || {};

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <FiCircle className="w-3 h-3 text-green-500 mr-1" />
            <span>{summary.online || 0} Online</span>
          </div>
          <div className="flex items-center">
            <FiCircle className="w-3 h-3 text-yellow-500 mr-1" />
            <span>{summary.busy || 0} Busy</span>
          </div>
          <div className="flex items-center">
            <FiCircle className="w-3 h-3 text-gray-400 mr-1" />
            <span>{summary.offline || 0} Offline</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <div key={driver.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <span className="text-sm font-medium text-gray-600">
                    {driver.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCircle className={`w-2 h-2 mr-1 ${statusColors[driver.status] || 'text-gray-400'}`} />
                    <span className="capitalize">{driver.status}</span>
                    {driver.current_booking && (
                      <span className="ml-2">• On ride #{driver.current_booking.id}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ⭐ {driver.performance?.rating || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {driver.performance?.total_rides || 0} rides
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No drivers available</p>
          </div>
        )}
      </div>
    </div>
  );
}