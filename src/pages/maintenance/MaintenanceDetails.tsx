import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User, Tool } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { MaintenanceTask, Asset } from '../../types';
import { format as formatDate, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

const MaintenanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<MaintenanceTask | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      if (!id) return;
      
      try {
        // Fetch maintenance details
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from('maintenance_tasks')
          .select('*')
          .eq('id', id)
          .single();
        
        if (maintenanceError) {
          throw maintenanceError;
        }
        
        if (maintenanceData) {
          setMaintenance(maintenanceData);
          
          // Fetch associated asset
          const { data: assetData, error: assetError } = await supabase
            .from('assets')
            .select('*')
            .eq('id', maintenanceData.assetId)
            .single();
          
          if (assetError) {
            throw assetError;
          }
          
          if (assetData) {
            setAsset(assetData);
          }
        }
      } catch (error) {
        console.error('Error fetching maintenance task:', error);
        toast.error('Failed to load maintenance details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMaintenance();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="info" dot>Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="warning" dot>In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" dot>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot>Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance Task Not Found</h2>
        <p className="text-gray-600 mb-6">The maintenance task you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/maintenance')}>Back to Maintenance</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/maintenance')}
        >
          Back to Maintenance
        </Button>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Edit size={16} />}
            onClick={() => navigate(`/maintenance/${id}/edit`)}
          >
            Edit Task
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => {
              // TODO: Implement delete functionality
              toast.error('Delete functionality not implemented yet');
            }}
          >
            Delete Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{maintenance.title}</h1>
                  <p className="text-gray-500">Asset: {asset?.name || 'Unknown Asset'}</p>
                </div>
                {getStatusBadge(maintenance.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
                  <Badge
                    variant={
                      maintenance.type === 'preventive' ? 'primary' :
                      maintenance.type === 'corrective' ? 'warning' :
                      'default'
                    }
                  >
                    {maintenance.type}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                  <Badge
                    variant={
                      maintenance.priority === 'high' ? 'danger' :
                      maintenance.priority === 'medium' ? 'warning' :
                      'default'
                    }
                  >
                    {maintenance.priority}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Scheduled Date</h3>
                  <p className="text-gray-900">{formatDate(parseISO(maintenance.scheduledDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
                  <p className="text-gray-900">{maintenance.assignedTo || 'Not assigned'}</p>
                </div>
                {maintenance.completedDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Date</h3>
                    <p className="text-gray-900">{formatDate(parseISO(maintenance.completedDate), 'MMM d, yyyy')}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Cost</h3>
                  <p className="text-gray-900">₱{maintenance.cost?.toLocaleString() || '0'}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{maintenance.description}</p>
              </div>

              {maintenance.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{maintenance.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h2>
              {asset ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                    <p className="text-gray-900">{asset.serialNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Model</h3>
                    <p className="text-gray-900">{asset.model}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="text-gray-900">{asset.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-gray-900">{asset.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    View Asset Details
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Asset information not available</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails; 