'use client';

import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ClipboardIcon, ShareIcon } from '@heroicons/react/24/outline';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  tourId,
  tourTitle,
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Generate tour URL - Link to public tour view page
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const tourURL = `${siteUrl}/tour/${tourId}`;

  const generateQRCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const qrCodeData = await QRCode.toDataURL(tourURL, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
      setQrCodeDataURL(qrCodeData);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tourURL]);

  useEffect(() => {
    if (isOpen && tourId) {
      generateQRCode();
    }
  }, [isOpen, tourId, generateQRCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tourURL);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `qr-code-tour-${tourId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeDataURL) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-tour-${tourId}.png`, { type: 'image/png' });

        await navigator.share({
          title: `QR Code - ${tourTitle}`,
          text: `Quét mã QR để xem chi tiết tour: ${tourTitle}`,
          url: tourURL,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        // Fallback to copying URL
        copyToClipboard();
      }
    } else {
      // Fallback to copying URL
      copyToClipboard();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mã QR Tour" size="sm">
      <div className="space-y-6">
        {/* Tour Title */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{tourTitle}</h3>
          <p className="text-sm text-gray-600">
            Quét mã QR này để xem chi tiết lịch trình tour
          </p>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
            {isLoading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              qrCodeDataURL && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeDataURL}
                    alt={`QR Code for ${tourTitle}`}
                    className="w-64 h-64"
                  />
                </>
              )
            )}
          </div>
        </div>

        {/* Tour URL */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Link tour:</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700 flex-1 truncate">{tourURL}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-1"
            >
              <ClipboardIcon className="h-4 w-4" />
              <span>{copySuccess ? 'Đã sao chép!' : 'Sao chép'}</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={downloadQRCode}
            disabled={!qrCodeDataURL}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Tải xuống</span>
          </Button>

          <Button
            onClick={shareQRCode}
            disabled={!qrCodeDataURL}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <ShareIcon className="h-4 w-4" />
            <span>Chia sẻ</span>
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Hướng dẫn sử dụng:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Người dùng có thể quét mã QR bằng camera điện thoại</li>
            <li>• Hoặc sử dụng ứng dụng quét QR để mở link</li>
            <li>• Mã QR sẽ dẫn đến trang xem chi tiết lịch trình tour</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
