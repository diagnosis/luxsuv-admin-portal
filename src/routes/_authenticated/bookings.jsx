import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { bookingAPI } from '../../lib/api';
import BookingTable from '../../components/bookings/BookingTable';
import BookingFilters from '../../components/bookings/BookingFilters';
import BookingStats from '../../components/bookings/BookingStats';

export const Route = createFileRoute('/_authenticated/bookings')({
  component: BookingsPage,
});

function BookingsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    date_from: '',
    date_to: '',
    driver_id: '',
    customer_email: '',
    ride_type: ''
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingAPI.getBookings(filters).then(res => res.data),
    keepPreviousData: true,
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
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
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <div className="text-sm text-gray-500">
          Auto-refreshing every 10 seconds
        </div>
      </div>

      {data?.summary && <BookingStats summary={data.summary} />}

      <div className="card">
        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="card">
        <BookingTable
          data={data}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
}