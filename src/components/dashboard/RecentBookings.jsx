import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '../../lib/api';
import { FiEye, FiMoreHorizontal } from 'react-icons/fi';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'assigned': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-purple-100 text-purple-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

export default function RecentBookings() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: () => bookingAPI.getBookings({ limit: 5 }).then(res => res.data),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const bookings = data?.bookings || [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Booking #{booking.id}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[booking.status?.book_status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status?.book_status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    <span className="font-medium">{booking.customer?.name}</span> • {booking.ride_details?.type}
                  </p>
                  <p className="text-xs">
                    {booking.ride_details?.pickup_location} →  {booking.ride_details?.dropoff_location}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {booking.ride_details?.date} at {booking.ride_details?.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiEye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent bookings</p>
          </div>
        )}
      </div>
    </div>
  );
}