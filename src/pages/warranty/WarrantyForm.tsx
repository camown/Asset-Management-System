import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Warranty, Asset } from '../../types';
import toast from 'react-hot-toast';

const WarrantyForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<Partial<Warranty>>({
    assetId: '',
    provider: '',
    startDate: '',
    endDate: '',
    type: 'standard',
    coverageDetails: '',
    documentUrl: '',
    contactInfo: ''
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('id, name, serialNumber')
          .order('name');

        if (error) throw error;
        if (data) setAssets(data);
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
      const warrantyData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('warranties')
        .insert([warrantyData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      toast.success('Warranty created successfully');
      navigate('/warranties');
    } catch (error: any) {
      console.error('Error creating warranty:', error);
      toast.error(error.message || 'Failed to create warranty');
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
          onClick={() => navigate('/warranties')}
        >
          Back to Warranties
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Warranty</h1>
          
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
                label="Provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
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
                  <option value="standard">Standard</option>
                  <option value="extended">Extended</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <Input
                label="Contact Info"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Details
              </label>
              <textarea
                name="coverageDetails"
                value={formData.coverageDetails}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document URL
              </label>
              <Input
                name="documentUrl"
                type="url"
                value={formData.documentUrl}
                onChange={handleChange}
                placeholder="https://example.com/warranty-document"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/warranties')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                Create Warranty
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default WarrantyForm; 