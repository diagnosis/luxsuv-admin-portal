import { Link, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../../lib/auth';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiTruck,
  FiTarget,
  FiBarChart,
  FiBell,
  FiSettings,
  FiLogOut,
  FiCrosshair
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'User Management', href: '/users', icon: FiUsers, adminOnly: true },
  { name: 'Bookings', href: '/bookings', icon: FiCalendar },
  { name: 'Drivers', href: '/drivers', icon: FiTruck },
  { name: 'Assignments', href: '/assignments', icon: FiTarget },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart },
  { name: 'Notifications', href: '/notifications', icon: FiBell },
  { name: 'Settings', href: '/settings', icon: FiSettings, adminOnly: true },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <FiCrosshair className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">LuxSUV</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
            <span className="text-sm font-medium text-primary-600">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );
}