import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { getMaintenanceTasks, getAssets } from '../../lib/supabase';
import { MaintenanceTask, Asset } from '../../types';
import { format, parseISO, isBefore, isToday, addDays } from 'date-fns';

const MaintenanceList: React.FC = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [filteredTasks, setFilteredTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch maintenance tasks
        const { data: tasksData, error: tasksError } = await getMaintenanceTasks();
        
        if (tasksError) {
          throw tasksError;
        }
        
        if (tasksData) {
          setTasks(tasksData);
          setFilteredTasks(tasksData);
        }
        
        // Fetch assets for reference
        const { data: assetsData, error: assetsError } = await getAssets();
        
        if (assetsError) {
          throw assetsError;
        }
        
        if (assetsData) {
          // Create a map of asset ID to asset for quick lookup
          const assetsMap = assetsData.reduce((acc, asset) => {
            acc[asset.id] = asset;
            return acc;
          }, {} as Record<string, Asset>);
          
          setAssets(assetsMap);
        }
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Filter and search tasks
    let result = [...tasks];
    const today = new Date();
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => {
        const asset = assets[task.assetId];
        return (
          (asset && asset.name.toLowerCase().includes(query)) ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'today') {
        result = result.filter(task => 
          isToday(parseISO(task.scheduledDate)) && 
          task.status !== 'completed' && 
          task.status !== 'cancelled'
        );
      } else if (statusFilter === 'upcoming') {
        result = result.filter(task => {
          const scheduledDate = parseISO(task.scheduledDate);
          return (
            isBefore(today, scheduledDate) && 
            task.status !== 'completed' && 
            task.status !== 'cancelled'
          );
        });
      } else if (statusFilter === 'overdue') {
        result = result.filter(task => {
          const scheduledDate = parseISO(task.scheduledDate);
          return (
            isBefore(scheduledDate, today) && 
            task.status !== 'completed' && 
            task.status !== 'cancelled'
          );
        });
      } else {
        // Filter by status
        result = result.filter(task => task.status === statusFilter);
      }
    }
    
    setFilteredTasks(result);
  }, [tasks, assets, searchQuery, statusFilter]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    setStatusFilter(statusFilter === filter ? null : filter);
  };
  
  const getStatusBadge = (task: MaintenanceTask) => {
    const today = new Date();
    const scheduledDate = parseISO(task.scheduledDate);
    
    switch (task.status) {
      case 'completed':
        return <Badge variant="success" dot>Completed</Badge>;
      case 'in-progress':
        return <Badge variant="primary" dot>In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="default" dot>Cancelled</Badge>;
      case 'scheduled':
        if (isBefore(scheduledDate, today)) {
          return <Badge variant="danger" dot>Overdue</Badge>;
        }
        if (isToday(scheduledDate)) {
          return <Badge variant="warning" dot>Today</Badge>;
        }
        return <Badge variant="info" dot>Scheduled</Badge>;
      default:
        return <Badge variant="default">{task.status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="primary">Medium</Badge>;
      case 'low':
        return <Badge variant="default">Low</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Count stats
  const today = new Date();
  const overdueCount = tasks.filter(task => 
    isBefore(parseISO(task.scheduledDate), today) && 
    task.status !== 'completed' && 
    task.status !== 'cancelled'
  ).length;
  
  const todayCount = tasks.filter(task => 
    isToday(parseISO(task.scheduledDate)) && 
    task.status !== 'completed' && 
    task.status !== 'cancelled'
  ).length;
  
  const upcomingCount = tasks.filter(task => {
    const scheduledDate = parseISO(task.scheduledDate);
    return (
      isBefore(addDays(today, 1), scheduledDate) && 
      task.status !== 'completed' && 
      task.status !== 'cancelled'
    );
  }).length;
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-600">Schedule and track maintenance for your assets.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/maintenance/new">
            <Button rightIcon={<Plus size={16} />}>
              Schedule Maintenance
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className={`p-4 ${statusFilter === 'overdue' ? 'ring-2 ring-red-500' : ''}`}>
          <button 
            className="w-full text-left"
            onClick={() => handleFilterChange('overdue')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">{overdueCount}</p>
              </div>
            </div>
          </button>
        </Card>
        
        <Card className={`p-4 ${statusFilter === 'today' ? 'ring-2 ring-amber-500' : ''}`}>
          <button 
            className="w-full text-left"
            onClick={() => handleFilterChange('today')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-semibold text-gray-900">{todayCount}</p>
              </div>
            </div>
          </button>
        </Card>
        
        <Card className={`p-4 ${statusFilter === 'upcoming' ? 'ring-2 ring-blue-500' : ''}`}>
          <button 
            className="w-full text-left"
            onClick={() => handleFilterChange('upcoming')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingCount}</p>
              </div>
            </div>
          </button>
        </Card>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search maintenance tasks..."
                value={searchQuery}
                onChange={handleSearch}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={statusFilter === 'scheduled' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('scheduled')}
              >
                Scheduled
              </Button>
              <Button
                variant={statusFilter === 'in-progress' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<CheckCircle size={16} />}
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const asset = assets[task.assetId];
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {task.description.length > 50 
                                ? `${task.description.substring(0, 50)}...` 
                                : task.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {asset ? asset.name : 'Unknown Asset'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(task.scheduledDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.assignedTo || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.cost ? `₱${task.cost.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/maintenance/${task.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery || statusFilter ? 'No maintenance tasks match your search or filter criteria.' : 'No maintenance tasks found. Start by scheduling some maintenance.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredTasks.length} of {tasks.length} maintenance tasks
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MaintenanceList;