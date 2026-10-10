'use client';

import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  return { position, handleMouseMove };
}

export function useMagneticHover(strength: number = 0.15) {
  const [transform, setTransform] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setTransform({ x, y });
  }, [strength]);

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  };

  return { style, handleMouseMove, handleMouseLeave };
}

export function useTilt(strength: number = 15) {
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / rect.height * strength;
    const y = -(e.clientX - rect.left - rect.width / 2) / rect.width * strength;
    setRotation({ x, y });
  }, [strength]);

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const style = {
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
  };

  return { style, handleMouseMove, handleMouseLeave };
}
