import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Asset } from '../../types';
import toast from 'react-hot-toast';

const AssetForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    serialNumber: '',
    model: '',
    category: '',
    purchaseDate: '',
    purchasePrice: 0,
    assignedTo: '',
    department: '',
    location: '',
    status: 'active',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the data for insertion
      const assetData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null,
        purchasePrice: Number(formData.purchasePrice),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('assets')
        .insert([assetData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      toast.success('Asset created successfully');
      navigate('/assets');
    } catch (error: any) {
      console.error('Error creating asset:', error);
      toast.error(error.message || 'Failed to create asset');
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
          onClick={() => navigate('/assets')}
        >
          Back to Assets
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Asset</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Asset Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Purchase Price (₱)"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />
              
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              
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
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
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
                onClick={() => navigate('/assets')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                Create Asset
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AssetForm; 