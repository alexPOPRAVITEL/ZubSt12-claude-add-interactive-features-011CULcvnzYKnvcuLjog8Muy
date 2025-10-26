import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
}

interface CursorState {
  x: number;
  y: number;
  isActive: boolean;
  isDragging: boolean;
  isHovering: boolean;
}

export const AnimatedCursor: React.FC = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isActive: false,
    isDragging: false,
    isHovering: false,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      setCursor((prev) => ({
        ...prev,
        x: newX,
        y: newY,
        isActive: true,
      }));

      const velocity = Math.sqrt(
        Math.pow(newX - lastPositionRef.current.x, 2) +
        Math.pow(newY - lastPositionRef.current.y, 2)
      );

      if (velocity > 2) {
        if (!isMoving) {
          isMoving = true;
        }

        if (Math.random() > 0.7) {
          createParticle(newX, newY, velocity);
        }

        setTrail((prev) => [
          ...prev.slice(-10),
          { x: newX, y: newY, opacity: 1 }
        ]);
      }

      lastPositionRef.current = { x: newX, y: newY };

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setCursor((prev) => ({ ...prev, isDragging: true }));
      for (let i = 0; i < 5; i++) {
        createParticle(e.clientX, e.clientY, 10);
      }
    };

    const handleMouseUp = () => {
      setCursor((prev) => ({ ...prev, isDragging: false }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-hover')
      ) {
        setCursor((prev) => ({ ...prev, isHovering: true }));
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-hover')
      ) {
        setCursor((prev) => ({ ...prev, isHovering: false }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(moveTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const createParticle = (x: number, y: number, velocity: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + velocity * 0.1;
    const particle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      size: Math.random() * 4 + 2,
      opacity: 1,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
    };
    setParticles((prev) => [...prev, particle]);
  };

  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.016,
            life: p.life - 1,
            vy: p.vy + 0.1,
          }))
          .filter((p) => p.life > 0 && p.opacity > 0)
      );

      setTrail((prev) =>
        prev
          .map((t) => ({ ...t, opacity: t.opacity - 0.05 }))
          .filter((t) => t.opacity > 0)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!cursor.isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {trail.map((point, index) => (
        <div
          key={`trail-${index}`}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6,
            height: 6,
            opacity: point.opacity * 0.5,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 2}px rgba(33, 118, 255, ${particle.opacity})`,
          }}
        />
      ))}

      <div
        className={`absolute rounded-full border-2 transition-all duration-200 ${
          cursor.isDragging
            ? 'border-accent bg-accent/20 scale-75'
            : cursor.isHovering
            ? 'border-primary bg-primary/10 scale-150'
            : 'border-primary bg-primary/5'
        }`}
        style={{
          left: cursor.x,
          top: cursor.y,
          width: 32,
          height: 32,
          transform: 'translate(-50%, -50%)',
          boxShadow: cursor.isHovering
            ? '0 0 20px rgba(33, 118, 255, 0.5)'
            : '0 0 10px rgba(33, 118, 255, 0.2)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      </div>

      <div
        className="absolute w-2 h-2 bg-primary rounded-full"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
