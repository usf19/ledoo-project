/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PortfolioNavbar } from './PortfolioNavbar';
import { PortfolioHero } from './PortfolioHero';
import { PortfolioAbout } from './PortfolioAbout';
import { PortfolioSkills } from './PortfolioSkills';
import { PortfolioOdooJourney } from './PortfolioOdooJourney';
import { PortfolioProjects } from './PortfolioProjects';
import { PortfolioEducation } from './PortfolioEducation';
import { PortfolioContact } from './PortfolioContact';
import { PortfolioFooter } from './PortfolioFooter';
import { FloatingGlassShardsBg } from './FloatingGlassShardsBg';

interface YousefPortfolioViewProps {
  visible: boolean;
  onBackToGlassHero: () => void;
  isBackHovered: boolean;
  onBackHoverChange: (hovered: boolean) => void;
  onScrollOffsetChange?: (offset: number) => void;
}

export const YousefPortfolioView: React.FC<YousefPortfolioViewProps> = ({
  visible,
  onBackToGlassHero,
  isBackHovered,
  onBackHoverChange,
  onScrollOffsetChange,
}) => {
  return (
    <div
      onScroll={(e) => {
        onScrollOffsetChange?.(e.currentTarget.scrollTop);
      }}
      className={`fixed inset-0 overflow-y-auto z-30 bg-transparent text-[#e2e8f0] transition-opacity selection:bg-blue-600/30 selection:text-blue-200 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        transitionDuration: visible ? '450ms' : '250ms',
      }}
    >
      {/* Subtle ambient studio atmosphere matching RoomEnvironment, allowing 3D WebGL glass to shine through */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[450px] bg-blue-600/08 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-[550px] h-[550px] bg-indigo-600/06 blur-[170px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[650px] h-[450px] bg-cyan-600/06 blur-[160px] rounded-full" />
      </div>

      {/* Floating Quick Action: Back to 3D Glass Slab */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={onBackToGlassHero}
          onMouseEnter={() => onBackHoverChange(true)}
          onMouseLeave={() => onBackHoverChange(false)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#17171b]/95 hover:bg-[#202028] border border-blue-500/40 text-blue-400 hover:text-white shadow-2xl backdrop-blur-2xl text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isBackHovered ? 'ring-2 ring-blue-500/50 shadow-blue-500/30' : ''
          }`}
          title="Reassemble the interactive 3D smoked-glass hero slab"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>← Back to 3D Glass Slab</span>
        </button>
      </div>

      {/* Main Portfolio Sections */}
      <div className="relative z-10">
        <PortfolioNavbar onBackToGlassHero={onBackToGlassHero} />
        <main>
          <PortfolioHero />
          <PortfolioAbout />
          <PortfolioSkills />
          <PortfolioOdooJourney />
          <PortfolioProjects />
          <PortfolioEducation />
          <PortfolioContact />
        </main>
        <PortfolioFooter />
      </div>
    </div>
  );
};


