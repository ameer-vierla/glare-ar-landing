'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, MeshTransmissionMaterial, PerspectiveCamera } from '@react-three/drei';
import { getGPUTier } from 'detect-gpu';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhoneModelProps {
  videoTexture: THREE.VideoTexture | null;
  gpuTier: number;
}

function PhoneModel({ videoTexture, gpuTier }: PhoneModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/phone_17_pro_max.glb');
  const { viewport } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!groupRef.current) return;

    // Initial position (off-screen bottom)
    groupRef.current.position.y = -viewport.height * 1.5;
    groupRef.current.rotation.x = Math.PI * 0.1;

    // GSAP scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    tl.to(groupRef.current.position, {
      y: 0,
      duration: 1,
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    });

    tl.to(
      groupRef.current.rotation,
      {
        x: 0,
        y: Math.PI * 2,
        duration: 1.8,
        ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      '<'
    );

    return () => {
      tl.kill();
    };
  }, [viewport]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Parallax effect on desktop (mouse movement)
    if (window.innerWidth > 768) {
      const mouseX = (state.mouse.x * 0.05);
      const mouseY = (state.mouse.y * 0.05);
      
      groupRef.current.rotation.y += (mouseX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (mouseY - groupRef.current.rotation.x) * 0.05;
    }
  });

  // Apply video texture to phone screen
  useEffect(() => {
    if (!videoTexture || !scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('screen')) {
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          toneMapped: false,
        });
      }
    });
  }, [videoTexture, scene]);

  return (
    <group ref={groupRef} scale={2.5}>
      <primitive object={scene.clone()} />
      
      {/* Holographic glow effect */}
      {gpuTier >= 2 && (
        <pointLight
          position={[0, 2, 2]}
          intensity={0.5}
          color="#00BFFF"
          distance={10}
        />
      )}
    </group>
  );
}

function Scene({ gpuTier }: { gpuTier: number }) {
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || gpuTier < 1) return;

    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.crossOrigin = 'anonymous';

    // GPU-based video format selection
    const supportsAV1 = video.canPlayType('video/mp4; codecs="av01.0.05M.08"') !== '';
    const supportsHEVC = video.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"') !== '';
    const supportsVP9 = video.canPlayType('video/webm; codecs="vp9"') !== '';

    let videoSrc = '/texture.h264.mp4'; // Fallback

    if (gpuTier >= 2) {
      if (supportsAV1) {
        videoSrc = '/texture.av1.mp4';
      } else if (supportsHEVC) {
        videoSrc = '/texture.hevc.mp4';
      } else if (supportsVP9) {
        videoSrc = '/texture.vp9.webm';
      }
    }

    video.src = videoSrc;
    video.load();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.colorSpace = THREE.SRGBColorSpace;

    video.play().catch((err) => console.warn('Video autoplay failed:', err));

    setVideoTexture(texture);

    // Pause video when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gpuTier]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {gpuTier >= 2 && (
        <Environment preset="city" background={false} blur={0.5} />
      )}
      
      <Suspense fallback={null}>
        <PhoneModel videoTexture={videoTexture} gpuTier={gpuTier} />
      </Suspense>
    </>
  );
}

export default function PhoneScene() {
  const [gpuTier, setGpuTier] = useState(2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    getGPUTier().then((tier) => {
      setGpuTier(tier.tier);
      console.log('GPU Tier:', tier.tier, tier.type);
    });
  }, []);

  if (!mounted) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Tier 0: Static image fallback
  if (gpuTier === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <img
          src="/phone_17_pro_max.glb"
          alt="Glare AR Phone"
          className="max-w-md object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={Math.min(window.devicePixelRatio, gpuTier >= 2 ? 2 : 1)}
      >
        <Scene gpuTier={gpuTier} />
      </Canvas>
    </div>
  );
}
