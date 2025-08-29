"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4266F5, // Neon Blue from spec
      emissive: 0x4266F5,
      emissiveIntensity: 1,
      metalness: 0.1,
      roughness: 0.4,
      wireframe: true,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);
    
    // Add a second, smaller shape
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.5, 0);
    const dodecahedronMaterial = new THREE.MeshStandardMaterial({
      color: 0xE91E63, // Hot Pink accent
      emissive: 0xE91E63,
      emissiveIntensity: 2,
      metalness: 0.1,
      roughness: 0.4,
      wireframe: true,
    });
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
    dodecahedron.position.set(3, 1, -2);
    scene.add(dodecahedron);


    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4266F5, 100, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xE91E63, 100, 100);
    pointLight2.position.set(3, 1, -2);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      icosahedron.rotation.x += 0.001;
      icosahedron.rotation.y += 0.001;
      
      dodecahedron.rotation.x -= 0.003;
      dodecahedron.rotation.y -= 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      dodecahedronGeometry.dispose();
      dodecahedronMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
