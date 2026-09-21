import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { supabase, getAssetById } from '../../lib/supabase';
import { Asset } from '../../types';
import toast from 'react-hot-toast';

const AssetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    serialNumber: '',
    model: '',
    category: '',
    storage: '',
    gpu: '',
    cpu: '',
    ram: '',
    monitorQty: 1,
    monitorSize: '',
    keyboardStatus: 'GOOD',
    mouseStatus: 'GOOD',
    purchaseDate: '',
    purchasePrice: 0,
    assignedTo: '',
    department: '',
    location: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const loadAsset = async () => {
        try {
          const { data, error } = await getAssetById(id);
          if (error) throw error;
          if (data) {
            setFormData({
              ...data,
              purchaseDate: data.purchaseDate ? data.purchaseDate.split('T')[0] : '',
            });
          }
        } catch (err: any) {
          toast.error('Failed to load asset details');
        } finally {
          setFetching(false);
        }
      };
      loadAsset();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assetData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : new Date().toISOString(),
        purchasePrice: Number(formData.purchasePrice) || 0,
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Asset updated successfully');
      } else {
        const { data, error } = await supabase
          .from('assets')
          .insert([{ ...assetData, createdAt: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        toast.success('Asset created successfully');
      }

      navigate('/assets');
    } catch (error: any) {
      console.error('Error saving asset:', error);
      toast.error(error.message || 'Failed to save asset');
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? `Edit Item (${formData.name || id})` : 'Add New Item'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Asset Name / PC Number"
                name="name"
                placeholder="e.g. PC-01 or RAM-001"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Serial Number / Service Tag"
                name="serialNumber"
                value={formData.serialNumber || ''}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Category"
                name="category"
                placeholder="e.g. Workstations, Memory (RAM), Storage (SSD)"
                value={formData.category || ''}
                onChange={handleChange}
                required
              />

              <Input
                label="Assigned User"
                name="assignedTo"
                placeholder="e.g. FREE or User Name"
                value={formData.assignedTo || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Storage (Size)"
                name="storage"
                placeholder="e.g. 16GB, 256 SSD, 2TB HDD, or NA"
                value={formData.storage || ''}
                onChange={handleChange}
              />

              {formData.category === 'Workstations' && (
                <>
                  <Input
                    label="GPU"
                    name="gpu"
                    placeholder="e.g. 4060 Ti, 3060 Ti"
                    value={formData.gpu || ''}
                    onChange={handleChange}
                  />

                  <Input
                    label="CPU"
                    name="cpu"
                    placeholder="e.g. r5-7600x, i5-14600kf"
                    value={formData.cpu || ''}
                    onChange={handleChange}
                  />

                  <Input
                    label="RAM"
                    name="ram"
                    placeholder="e.g. 32 GB"
                    value={formData.ram || ''}
                    onChange={handleChange}
                  />

                  <Input
                    label="Monitor Size / Setup"
                    name="monitorSize"
                    placeholder='e.g. 27" or 24" + 27"'
                    value={formData.monitorSize || ''}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keyboard Status
                    </label>
                    <select
                      name="keyboardStatus"
                      value={formData.keyboardStatus || 'GOOD'}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="GOOD">GOOD</option>
                      <option value="REPLACE">REPLACE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mouse Status
                    </label>
                    <select
                      name="mouseStatus"
                      value={formData.mouseStatus || 'GOOD'}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="GOOD">GOOD</option>
                      <option value="REPLACE">REPLACE</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="active">Active / Working</option>
                  <option value="maintenance">Maintenance / Needs Replacement</option>
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