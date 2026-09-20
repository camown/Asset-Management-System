import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageOpen, 
  Shield, 
  Wrench, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'warranty' | 'system';
  read: boolean;
  created_at: string;
}

const DashboardLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Subscribe to new notifications
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          toast.success('New notification received');
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Assets', href: '/assets', icon: PackageOpen },
    { name: 'Warranties', href: '/warranties', icon: Shield },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Financial', href: '/financial', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center">
            <img 
              src="/images/logo.png" 
              alt="DAWMS Logo" 
              className="h-8" 
            />
          </div>
          <div className="flex items-center">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div 
          ref={notificationRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sidebar for mobile */}
      <div className={`
        fixed inset-0 z-40 lg:hidden transition-opacity duration-300
        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className={`
          fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <img 
              src="/images/logo.png" 
              alt="DAWMS Logo" 
              className="h-8" 
            />
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                  onClick={toggleSidebar}
                >
                  <item.icon 
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${location.pathname === item.href
                        ? 'text-blue-700'
                        : 'text-gray-500 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <UserIcon size={20} />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto p-1 text-gray-500 hover:text-gray-700"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <img 
              src="/images/logo.png" 
              alt="DAWMS Logo" 
              className="h-8" 
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">DAWMS</span>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon 
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${location.pathname === item.href
                        ? 'text-blue-700'
                        : 'text-gray-500 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <UserIcon size={20} />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto p-1 text-gray-500 hover:text-gray-700"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Desktop header */}
        <header className="hidden lg:flex sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="max-w-2xl w-full">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search assets, warranties..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;