'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  gameCode: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({ gameCode, size = 200, className = '' }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        
        // Get current domain and create join URL
        const currentUrl = window.location.origin;
        const joinUrl = `${currentUrl}?join=${gameCode}`;
        
        // Generate QR code
        const qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameCode) {
      generateQRCode();
    }
  }, [gameCode, size]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vermilion-500"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-lg ${className}`}>
      {qrCodeUrl ? (
        <img 
          src={qrCodeUrl} 
          alt={`QR Code to join game ${gameCode}`}
          className="w-full h-auto"
          style={{ maxWidth: size }}
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-200 rounded-lg" style={{ width: size, height: size }}>
          <span className="text-gray-500">QR Code Error</span>
        </div>
      )}
    </div>
  );
}
