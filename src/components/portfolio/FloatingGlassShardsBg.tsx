/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

/**
 * FloatingGlassShardsBg renders subtle drifting smoked-glass polygons with
 * iridescent hairlines in the background of the portfolio view, preserving
 * the signature WebGL glass world throughout the entire website.
 */
export const FloatingGlassShardsBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Shard definitions with polygonal vertices, drift velocity, and tumble:
    const shards = [
      {
        basePts: [
          [-50, -40],
          [60, -60],
          [90, 40],
          [-20, 80],
          [-70, 30],
        ],
        x: width * 0.12,
        y: height * 0.22,
        vx: 0.04,
        vy: 0.03,
        rot: 0.2,
        vRot: 0.001,
        scale: 1.1,
        color: 'rgba(23, 23, 27, 0.45)',
        rimColor: 'rgba(147, 197, 253, 0.22)',
      },
      {
        basePts: [
          [-70, -20],
          [40, -80],
          [110, -10],
          [50, 70],
          [-40, 50],
        ],
        x: width * 0.88,
        y: height * 0.28,
        vx: -0.03,
        vy: 0.04,
        rot: 1.1,
        vRot: -0.0008,
        scale: 1.3,
        color: 'rgba(23, 23, 27, 0.40)',
        rimColor: 'rgba(185, 171, 255, 0.25)',
      },
      {
        basePts: [
          [-80, -30],
          [20, -50],
          [70, 20],
          [-10, 60],
          [-60, 40],
        ],
        x: width * 0.08,
        y: height * 0.68,
        vx: 0.05,
        vy: -0.02,
        rot: 2.3,
        vRot: 0.0006,
        scale: 0.9,
        color: 'rgba(23, 23, 27, 0.35)',
        rimColor: 'rgba(56, 189, 248, 0.20)',
      },
      {
        basePts: [
          [-60, -50],
          [70, -30],
          [80, 50],
          [-30, 70],
        ],
        x: width * 0.92,
        y: height * 0.78,
        vx: -0.04,
        vy: -0.03,
        rot: 0.7,
        vRot: 0.0012,
        scale: 1.0,
        color: 'rgba(23, 23, 27, 0.38)',
        rimColor: 'rgba(147, 197, 253, 0.24)',
      },
    ];

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      shards.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vRot;

        // Wrap around viewport edges:
        if (s.x < -150) s.x = width + 150;
        if (s.x > width + 150) s.x = -150;
        if (s.y < -150) s.y = height + 150;
        if (s.y > height + 150) s.y = -150;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.scale(s.scale, s.scale);

        // Draw shard polygon:
        ctx.beginPath();
        s.basePts.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        });
        ctx.closePath();

        // Smoked glass body fill:
        ctx.fillStyle = s.color;
        ctx.fill();

        // Hairline bevel rim reflection:
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = s.rimColor;
        ctx.stroke();

        ctx.restore();
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
};
