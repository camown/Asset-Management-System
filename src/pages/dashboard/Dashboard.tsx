import React, { useEffect, useState } from 'react';
import { 
  PackageOpen, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  BarChart3 
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getAssets, getWarranties, getMaintenanceTasks } from '../../lib/supabase';
import { Asset, Warranty, MaintenanceTask } from '../../types';
import { format, isBefore, parseISO, addDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assets
        const { data: assetsData } = await getAssets();
        if (assetsData) setAssets(assetsData);
        
        // Fetch warranties
        const { data: warrantiesData } = await getWarranties();
        if (warrantiesData) setWarranties(warrantiesData);
        
        // Fetch maintenance tasks
        const { data: maintenanceData } = await getMaintenanceTasks();
        if (maintenanceData) setMaintenanceTasks(maintenanceData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate upcoming expirations (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);
  
  const expiringWarranties = warranties.filter(warranty => {
    const endDate = parseISO(warranty.endDate);
    return isBefore(today, endDate) && isBefore(endDate, thirtyDaysFromNow);
  });
  
  const upcomingMaintenance = maintenanceTasks.filter(task => {
    const scheduledDate = parseISO(task.scheduledDate);
    return (
      task.status !== 'completed' && 
      task.status !== 'cancelled' && 
      isBefore(today, scheduledDate) && 
      isBefore(scheduledDate, thirtyDaysFromNow)
    );
  });
  
  const assetsByStatus = {
    active: assets.filter(a => a.status === 'active').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    retired: assets.filter(a => a.status === 'retired').length,
    disposed: assets.filter(a => a.status === 'disposed').length,
  };
  
  const assetsByCategory = assets.reduce((acc: Record<string, number>, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {});
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const stats = [
    { 
      title: 'Total Assets', 
      value: assets.length, 
      icon: PackageOpen, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-100' 
    },
    { 
      title: 'Active Warranties', 
      value: warranties.filter(w => isBefore(today, parseISO(w.endDate))).length, 
      icon: Shield, 
      color: 'text-green-500', 
      bgColor: 'bg-green-100' 
    },
    { 
      title: 'Expiring Soon', 
      value: expiringWarranties.length, 
      icon: AlertTriangle, 
      color: 'text-amber-500', 
      bgColor: 'bg-amber-100' 
    },
    { 
      title: 'Upcoming Maintenance', 
      value: upcomingMaintenance.length, 
      icon: Calendar, 
      color: 'text-indigo-500', 
      bgColor: 'bg-indigo-100' 
    },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your asset and warranty management dashboard.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex items-center p-4">
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color} mr-4`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Assets */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <PackageOpen size={18} className="mr-2 text-blue-500" />
              Recent Assets
            </h2>
            <Badge variant="primary">Total: {assets.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {assets.slice(0, 5).map((asset, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-6">
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.model} • {asset.category}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant={
                        asset.status === 'active' ? 'success' :
                        asset.status === 'maintenance' ? 'warning' :
                        'default'
                      }
                      dot
                    >
                      {asset.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {assets.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  No assets found. Start by adding some assets.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Expiring Warranties */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle size={18} className="mr-2 text-amber-500" />
              Expiring Warranties
            </h2>
            <Badge variant="warning">Next 30 days: {expiringWarranties.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {expiringWarranties.slice(0, 5).map((warranty, index) => {
                const asset = assets.find(a => a.id === warranty.assetId);
                
                return (
                  <div key={index} className="flex items-center justify-between py-3 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{asset?.name || 'Unknown Asset'}</p>
                      <p className="text-sm text-gray-500">{warranty.provider} • {warranty.type}</p>
                    </div>
                    <div>
                      <Badge variant="danger">
                        Expires {format(parseISO(warranty.endDate), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {expiringWarranties.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  No warranties expiring in the next 30 days.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Clock size={18} className="mr-2 text-indigo-500" />
              Upcoming Maintenance
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {upcomingMaintenance.slice(0, 5).map((task, index) => {
                const asset = assets.find(a => a.id === task.assetId);
                
                return (
                  <div key={index} className="flex items-center justify-between py-3 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {asset?.name || 'Unknown Asset'} • {format(parseISO(task.scheduledDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'critical' ? 'danger' :
                        task.priority === 'high' ? 'warning' :
                        task.priority === 'medium' ? 'primary' :
                        'default'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                );
              })}
              {upcomingMaintenance.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  No maintenance scheduled for the next 30 days.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Assets by Status */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart3 size={18} className="mr-2 text-blue-500" />
              Assets Overview
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Asset Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{assetsByStatus.active}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Maintenance</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{assetsByStatus.maintenance}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Retired</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{assetsByStatus.retired}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Disposed</span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{assetsByStatus.disposed}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Top Categories</h3>
                <div className="space-y-2">
                  {Object.entries(assetsByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([category, count], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;