import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Card from '../../components/ui/Card';
import { getAssets, getMaintenanceTasks, getDepreciationRecords } from '../../lib/supabase';
import { Asset, MaintenanceTask, DepreciationRecord } from '../../types';
import { format, parseISO, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ChartData {
  name: string;
  value: number;
}

interface MaintenanceCostData {
  month: string;
  cost: number;
}

interface DepreciationData {
  month: string;
  value: number;
  depreciation: number;
}

const FinancialInsights: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [depreciationRecords, setDepreciationRecords] = useState<DepreciationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, maintenanceData, depreciationData] = await Promise.all([
          getAssets(),
          getMaintenanceTasks(),
          getDepreciationRecords()
        ]);

        if (assetsData.data) setAssets(assetsData.data);
        if (maintenanceData.data) setMaintenanceTasks(maintenanceData.data);
        if (depreciationData.data) setDepreciationRecords(depreciationData.data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total asset value
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);

  // Calculate total maintenance costs
  const totalMaintenanceCost = maintenanceTasks.reduce((sum, task) => sum + (task.cost || 0), 0);

  // Prepare data for asset value by category chart
  const assetValueByCategory = assets.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += asset.purchasePrice;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData: ChartData[] = Object.entries(assetValueByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare data for maintenance costs over time
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'MMM yyyy');
  }).reverse();

  const maintenanceCostsByMonth: MaintenanceCostData[] = last6Months.map(month => {
    const monthTasks = maintenanceTasks.filter(task => {
      const taskDate = parseISO(task.scheduledDate);
      return format(taskDate, 'MMM yyyy') === month;
    });

    return {
      month,
      cost: monthTasks.reduce((sum, task) => sum + (task.cost || 0), 0)
    };
  });

  // Prepare data for depreciation trends
  const depreciationByMonth: DepreciationData[] = last6Months.map(month => {
    const monthRecords = depreciationRecords.filter(record => {
      const recordDate = new Date(record.year, record.month - 1);
      return format(recordDate, 'MMM yyyy') === month;
    });

    return {
      month,
      value: monthRecords.reduce((sum, record) => sum + record.value, 0),
      depreciation: monthRecords.reduce((sum, record) => sum + record.depreciationAmount, 0)
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Insights</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Asset Value</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              ₱{totalAssetValue.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Maintenance Costs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              ₱{totalMaintenanceCost.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Value by Category */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Value by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Maintenance Costs Over Time */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Costs Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceCostsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="cost" name="Maintenance Cost" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Asset Status Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(assets.reduce((acc, asset) => {
                      acc[asset.status] = (acc[asset.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {Object.keys(assets.reduce((acc, asset) => {
                      acc[asset.status] = (acc[asset.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialInsights; 