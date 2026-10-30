/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GlassHeroScene } from './components/GlassHeroScene';
import { YousefPortfolioView } from './components/portfolio/YousefPortfolioView';

export default function App() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceStaticFallback, setForceStaticFallback] = useState(false);

  useEffect(() => {
    // Check WebGL support:
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    // Check reduced motion:
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Static HTML portfolio fallback when WebGL is unavailable or reduced motion is preferred:
  if (!hasWebGL || (prefersReducedMotion && forceStaticFallback)) {
    return (
      <main className="w-full min-h-screen bg-[#070709] text-[#e2e8f0]">
        <YousefPortfolioView
          visible={true}
          onBackToGlassHero={() => setForceStaticFallback(false)}
          isBackHovered={false}
          onBackHoverChange={() => {}}
        />
      </main>
    );
  }

  // Interactive 3D WebGL Experience:
  return (
    <main className="w-full h-full relative">
      <GlassHeroScene />

      {/* Subtle accessibility toggle for reduced motion users */}
      {prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setForceStaticFallback(!forceStaticFallback)}
          className="fixed bottom-3 right-3 text-[11px] text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded transition-colors z-50 backdrop-blur-sm"
        >
          {forceStaticFallback ? 'Switch to 3D Scene' : 'Switch to Static Layout'}
        </button>
      )}
    </main>
  );
}
