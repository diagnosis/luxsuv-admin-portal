import React from 'react';

export default function BookingTable({ data, isLoading, error, onPageChange, onRefresh }) {
  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error-600 mb-4">Failed to load bookings</p>
        <button onClick={onRefresh} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Table</h3>
      <p className="text-gray-500">Booking table component placeholder</p>
    </div>
  );
}