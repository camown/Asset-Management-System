import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetData: {
    name: string;
    serialNumber: string;
    model: string;
    category: string;
    status: string;
    location: string;
    department: string;
    assignedTo: string;
    purchaseDate: string;
    purchasePrice: number;
  };
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, assetData }) => {
  if (!isOpen) return null;

  // Create a formatted string of asset data for the QR code
  const qrData = JSON.stringify({
    name: assetData.name,
    serialNumber: assetData.serialNumber,
    model: assetData.model,
    category: assetData.category,
    status: assetData.status,
    location: assetData.location,
    department: assetData.department,
    assignedTo: assetData.assignedTo,
    purchaseDate: assetData.purchaseDate,
    purchasePrice: assetData.purchasePrice
  }, null, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Asset QR Code</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <QRCodeSVG
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                Scan this QR code to view asset details
              </div>
              
              <button
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  const svg = document.querySelector('svg');
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      ctx?.drawImage(img, 0, 0);
                      const link = document.createElement('a');
                      link.download = `asset-qr-${assetData.serialNumber}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal; 