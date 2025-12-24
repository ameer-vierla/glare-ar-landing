'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

interface ModalProps {
  onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Animate QR code scan line
    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
      gsap.to(scanLine, {
        opacity: 1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md md:max-w-2xl mx-4 md:mx-auto bg-black border border-glare-blue p-8 md:p-12">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-glare-blue transition-colors text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="space-y-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-thin glare-glow"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.05em',
            }}
          >
            Coming Soon
          </h2>

          {/* QR Code */}
          <div className="relative inline-block">
            <img
              src="/qr_code.png"
              alt="Scan to preview Glare AR"
              className="w-48 h-48 md:w-64 md:h-64 mx-auto glare-glow"
            />
            <div className="scan-line absolute inset-0 border-t-2 border-glare-blue opacity-30" />
          </div>

          <p
            className="text-xs md:text-sm font-thin"
            style={{
              color: 'rgba(136, 136, 136, 0.2)',
              letterSpacing: '0.05em',
            }}
          >
            No app? Scan to preview
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
            <button
              className="px-6 py-3 border border-glare-blue text-white font-thin transition-all duration-800 hover:bg-glare-blue hover:text-black w-full md:w-auto"
              style={{ letterSpacing: '0.05em' }}
              disabled
            >
              App Store
            </button>
            <button
              className="px-6 py-3 border border-glare-blue text-white font-thin transition-all duration-800 hover:bg-glare-blue hover:text-black w-full md:w-auto"
              style={{ letterSpacing: '0.05em' }}
              disabled
            >
              Play Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
