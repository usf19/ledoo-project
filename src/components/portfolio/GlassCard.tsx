/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useCallback } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number; // degrees of tilt
  elevation?: number; // px lift toward viewer
  enableIridescence?: boolean;
  glowColor?: string; // CSS color string for sheen
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * GlassCard brings the signature 3D smoked-glass physical animation from
 * the hero slab into all portfolio sections:
 * - Real-time 3D tilt tracking cursor position (tips toward light)
 * - Spring elevation toward camera on hover
 * - Specular iridescent sheen (green / violet / electric blue)
 * - Dark charcoal face (#17171b) with thin bright hairline bevels
 * - Cursor lavender glow emission matching the first page shader
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  tiltIntensity = 7,
  elevation = 14,
  enableIridescence = true,
  glowColor = 'rgba(96, 165, 250, 0.22)',
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  );
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number; opacity: number; angle: number }>({
    x: 50,
    y: 50,
    opacity: 0,
    angle: 135,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized [-1, 1]:
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      // 3D Tilt calculation (edge dips, shard tips toward cursor light):
      const rotX = -normY * tiltIntensity;
      const rotY = normX * tiltIntensity;

      // Dynamic sheen angle based on pointer direction
      const angle = Math.atan2(normY, normX) * (180 / Math.PI) + 90;

      setTransform(
        `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${elevation}px)`
      );
      setSheenPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 1,
        angle,
      });
    },
    [tiltIntensity, elevation]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth physical spring return to resting plane
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setSheenPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: isHovered
          ? 'transform 0.08s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`group relative rounded-3xl bg-[#17171b]/90 border border-white/[0.09] hover:border-blue-400/50 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/15 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Dynamic Specular Iridescent Sheen that moves with cursor */}
      {enableIridescence && (
        <>
          {/* Lavender cursor glow matching vec3(.42,.37,.62) emission */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
            style={{
              opacity: sheenPos.opacity * 0.9,
              background: `radial-gradient(circle 280px at ${sheenPos.x}% ${sheenPos.y}%, rgba(107, 94, 158, 0.28) 0%, rgba(59, 130, 246, 0.18) 35%, rgba(16, 185, 129, 0.12) 65%, transparent 85%)`,
            }}
          />

          {/* Thin prismatic iridescent edge reflection */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
            style={{
              opacity: sheenPos.opacity * 0.6,
              background: `linear-gradient(${sheenPos.angle}deg, rgba(147, 197, 253, 0.15) 0%, rgba(192, 132, 252, 0.12) 50%, rgba(52, 211, 153, 0.14) 100%)`,
            }}
          />
        </>
      )}

      {/* Thin glass bevel rim highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/[0.05] group-hover:border-white/[0.18] transition-colors z-10" />

      {/* Smoked glass inner bevel rim */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/[0.03] group-hover:border-blue-400/20 transition-colors z-10" />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

