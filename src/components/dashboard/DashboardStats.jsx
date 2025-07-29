import { FiUsers, FiDollarSign, FiTruck, FiStar } from 'react-icons/fi';

const stats = [
  {
    name: 'Total Bookings',
    value: 'total_bookings',
    icon: FiUsers,
    color: 'bg-primary-500',
    change: '+15.5%',
    changeType: 'positive'
  },
  {
    name: 'Total Revenue',
    value: 'total_revenue',
    icon: FiDollarSign,
    color: 'bg-success-500',
    change: '+12.3%',
    changeType: 'positive',
    format: 'currency'
  },
  {
    name: 'Active Drivers',
    value: 'active_drivers',
    icon: FiTruck,
    color: 'bg-accent-500',
    change: '+2',
    changeType: 'positive'
  },
  {
    name: 'Customer Satisfaction',
    value: 'customer_satisfaction',
    icon: FiStar,
    color: 'bg-warning-500',
    change: '+0.2',
    changeType: 'positive',
    format: 'rating'
  }
];

export default function DashboardStats({ data }) {
  const formatValue = (value, format) => {
    if (!value) return '0';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'rating':
        return `${value}/5`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const value = data?.overview?.[stat.value] || 0;
        const Icon = stat.icon;
        
        return (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatValue(value, stat.format)}
                </p>
                {data?.trends && (
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}