import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { Warranty, Asset } from '../../types';
import { format as formatDate, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';

const WarrantyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranty = async () => {
      if (!id) return;
      
      try {
        // Fetch warranty details
        const { data: warrantyData, error: warrantyError } = await supabase
          .from('warranties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (warrantyError) {
          throw warrantyError;
        }
        
        if (warrantyData) {
          setWarranty(warrantyData);
          
          // Fetch associated asset
          const { data: assetData, error: assetError } = await supabase
            .from('assets')
            .select('*')
            .eq('id', warrantyData.assetId)
            .single();
          
          if (assetError) {
            throw assetError;
          }
          
          if (assetData) {
            setAsset(assetData);
          }
        }
      } catch (error) {
        console.error('Error fetching warranty:', error);
        toast.error('Failed to load warranty details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWarranty();
  }, [id]);

  const getStatusBadge = (warranty: Warranty) => {
    const today = new Date();
    const endDate = parseISO(warranty.endDate);
    
    if (endDate < today) {
      return <Badge variant="danger" dot>Expired</Badge>;
    }
    
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 30) {
      return <Badge variant="warning" dot>Expiring Soon</Badge>;
    }
    
    return <Badge variant="success" dot>Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranty Not Found</h2>
        <p className="text-gray-600 mb-6">The warranty you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/warranties')}>Back to Warranties</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/warranties')}
        >
          Back to Warranties
        </Button>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Edit size={16} />}
            onClick={() => navigate(`/warranties/${id}/edit`)}
          >
            Edit Warranty
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => {
              // TODO: Implement delete functionality
              toast.error('Delete functionality not implemented yet');
            }}
          >
            Delete Warranty
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{asset?.name || 'Unknown Asset'}</h1>
                  <p className="text-gray-500">Warranty Provider: {warranty.provider}</p>
                </div>
                {getStatusBadge(warranty)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
                  <Badge
                    variant={
                      warranty.type === 'premium' ? 'primary' :
                      warranty.type === 'extended' ? 'info' :
                      'default'
                    }
                  >
                    {warranty.type}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Start Date</h3>
                  <p className="text-gray-900">{formatDate(parseISO(warranty.startDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">End Date</h3>
                  <p className="text-gray-900">{formatDate(parseISO(warranty.endDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                  <p className="text-gray-900">{warranty.contactInfo}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Coverage Details</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{warranty.coverageDetails}</p>
              </div>

              {warranty.documentUrl && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Document</h3>
                  <a
                    href={warranty.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-900"
                  >
                    <FileText size={16} className="mr-2" />
                    View Warranty Document
                  </a>
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

export default WarrantyDetails; 