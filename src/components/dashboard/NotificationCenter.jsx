import { useQuery } from '@tanstack/react-query';
import { notificationAPI } from '../../lib/api';
import { FiAlertTriangle, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';

const priorityColors = {
  'high': 'border-l-red-500 bg-red-50',
  'medium': 'border-l-yellow-500 bg-yellow-50',
  'low': 'border-l-blue-500 bg-blue-50'
};

const priorityIcons = {
  'high': FiAlertTriangle,
  'medium': FiInfo,
  'low': FiCheckCircle
};

export default function NotificationCenter() {
  // Hook must be called first, consistently
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-notifications'],
    queryFn: () => notificationAPI.getNotifications({ limit: 10 }),
    refetchInterval: 30000,
  });

  const markAsRead = async (notificationIds) => {
    try {
      await notificationAPI.markAsRead({ notification_ids: notificationIds });
      refetch();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Early return after hooks
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
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

  const notifications = data?.notifications || [];
  const summary = data?.summary || {};

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <div className="flex items-center space-x-2">
          {summary.unread > 0 && (
            <button
              onClick={() => {
                const unreadIds = notifications
                  .filter(n => !n.read)
                  .map(n => n.id);
                markAsRead(unreadIds);
              }}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Mark all read
            </button>
          )}
          <span className="text-xs text-gray-500">
            {summary.unread || 0} unread
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = priorityIcons[notification.priority] || FiInfo;
            const priorityColor = priorityColors[notification.priority] || 'border-l-gray-500 bg-gray-50';
            
            return (
              <div
                key={notification.id}
                className={`border-l-4 p-3 rounded-r-lg ${priorityColor} ${
                  !notification.read ? 'shadow-sm' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <Icon className={`w-4 h-4 mt-0.5 ${
                      notification.priority === 'high' ? 'text-red-600' :
                      notification.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
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
                      
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead([notification.id])}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 w-full text-center">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}