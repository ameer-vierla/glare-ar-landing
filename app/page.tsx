'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';

const PhoneScene = dynamic(() => import('@/components/PhoneScene'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />,
});

const Modal = dynamic(() => import('@/components/Modal'), {
  ssr: false,
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.6,
      touchMultiplier: 1,
      infinite: false,
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Track scroll count for glitch effect
    let lastScrollY = 0;
    let scrollCounter = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        scrollCounter++;
        setScrollCount(scrollCounter);
        
        if (scrollCounter % 30 === 0) {
          setShowGlitch(true);
          setTimeout(() => setShowGlitch(false), 500);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="relative w-full bg-black">
      {/* Hero Section with 3D Phone */}
      <section className="relative w-full h-screen">
        <PhoneScene />
      </section>

      {/* Middle Section - CTA */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 
            className="text-2xl md:text-5xl font-thin glare-glow text-glare-white tracking-glare"
          >
            Try any look in AR instantly. Upload a photo or use live camera. Works with any phone.
          </h2>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4 text-lg md:text-xl font-thin border border-glare-blue text-white transition-all duration-800 hover:bg-glare-blue hover:text-black tracking-glare"
          >
            Try Glare AR
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        ref={footerRef}
        className="relative w-full min-h-[50vh] flex flex-col items-center justify-center px-6 md:px-12 pb-12"
      >
        <div className="text-center space-y-6">
          <h1 
            className={`text-7xl md:text-[220px] font-thin pulse-glow transition-all duration-500 text-white tracking-glare ${
              showGlitch ? 'glitch' : ''
            }`}
          >
            {showGlitch ? 'glarear.art' : 'Glare AR'}
          </h1>
          
          <p 
            className="text-xs md:text-sm font-thin text-glare-gray tracking-glare"
          >
            Studio CRM Inventory Booking
          </p>
          
          <p 
            className="text-[10px] md:text-xs font-thin transition-all duration-1000 hover:brightness-150 hover:text-glare-blue cursor-pointer text-glare-dark tracking-glare"
          >
            Viela 2025
          </p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}
