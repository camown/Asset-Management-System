import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { MaintenanceTask, Asset } from '../../types';
import toast from 'react-hot-toast';

const MaintenanceForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    assetId: '',
    title: '',
    description: '',
    type: 'routine',
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: '',
    completedAt: null,
    assignedTo: '',
    cost: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('id, name, serialNumber, model, category, purchaseDate, purchasePrice, assignedTo, department, location, status, notes, createdAt, updatedAt')
          .order('name');

        if (error) throw error;
        if (data) setAssets(data as Asset[]);
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
      }
    };

    fetchAssets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the data for insertion
      const maintenanceData = {
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
        completedAt: formData.completedAt ? new Date(formData.completedAt).toISOString() : null,
        cost: Number(formData.cost),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert([maintenanceData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      toast.success('Maintenance task created successfully');
      navigate('/maintenance');
    } catch (error: any) {
      console.error('Error creating maintenance task:', error);
      toast.error(error.message || 'Failed to create maintenance task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/maintenance')}
        >
          Back to Maintenance
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Maintenance Task</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset
                </label>
                <select
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select an asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.serialNumber})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="routine">Routine</option>
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Input
                label="Scheduled Date"
                name="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />

              <Input
                label="Completed Date"
                name="completedAt"
                type="date"
                value={formData.completedAt || ''}
                onChange={handleChange}
              />

              <Input
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />

              <Input
                label="Cost (₱)"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recurring Frequency (Auto-Rollover)
                </label>
                <select
                  name="frequencyDays"
                  value={formData.frequencyDays || 0}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={0}>One-time Task (No Rollover)</option>
                  <option value={30}>Monthly (Every 30 Days)</option>
                  <option value={90}>Quarterly (Every 90 Days)</option>
                  <option value={180}>Bi-Annually (Every 180 Days)</option>
                  <option value={365}>Annually (Every 365 Days)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/maintenance')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                Create Maintenance Task
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MaintenanceForm; 