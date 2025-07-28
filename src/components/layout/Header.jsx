import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationAPI } from '../../lib/api';
import { FiBell, FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', { limit: 5 }],
    queryFn: () => notificationAPI.getNotifications({ limit: 5 }).then(res => res.data),
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.summary?.unread || 0;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center flex-1">
          <div className="max-w-md w-full">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings, users, drivers..."
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh page"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <button
                      onClick={refetchNotifications}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.notifications?.length > 0 ? (
                    notifications.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-200">
                  <button className="text-xs text-primary-600 hover:text-primary-700 w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}