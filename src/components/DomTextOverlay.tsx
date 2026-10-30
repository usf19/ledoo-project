/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageView } from '../types';

interface DomTextOverlayProps {
  panelTransform: string;
  navTransform: string;
  panelWidth: number;
  panelHeight: number;
  navWidth: number;
  navHeight: number;
  scaleS: number;
  visible: boolean;
  isOpenStudioHovered: boolean;
  setIsOpenStudioHovered: (hovered: boolean) => void;
  isReadPaperHovered: boolean;
  setIsReadPaperHovered: (hovered: boolean) => void;
  hoveredNavLink: string | null;
  setHoveredNavLink: (link: string | null) => void;
  onNavigate: (view: PageView) => void;
  isPortrait?: boolean;
}

/**
 * DomTextOverlay provides transparent, invisible interactive hit areas
 * mapped in 3D space via matrix3d.
 *
 * CRITICAL DESIGN NOTE:
 * All visible typography is rendered exclusively onto the 3D glass surface
 * via WebGL CanvasTexture, ensuring it is physically 100% fixed to the glass
 * with ZERO double-layer ghosting, jitter, or misalignment.
 */
export const DomTextOverlay: React.FC<DomTextOverlayProps> = ({
  panelTransform,
  navTransform,
  panelWidth,
  panelHeight,
  navWidth,
  navHeight,
  scaleS,
  visible,
  setIsOpenStudioHovered,
  setIsReadPaperHovered,
  setHoveredNavLink,
  onNavigate,
  isPortrait = false,
}) => {
  const S = scaleS;
  const leftMargin = isPortrait ? panelWidth * 0.08 : panelWidth * 0.062;
  const eyebrowY = panelHeight * 0.135;
  const eyebrowSize = Math.max(10, Math.round(11 * S));

  const headlineSize = Math.max(
    28,
    Math.round(Math.min(panelWidth * (isPortrait ? 0.11 : 0.074), panelHeight * 0.19))
  );
  const headlineLeading = headlineSize * 0.98;
  const headlineStartY = eyebrowY + eyebrowSize + (isPortrait ? 18 : 28 * S);

  const subSize = Math.max(12, Math.round(14.5 * S));
  const subLeading = subSize * 1.5;
  const subStartY = headlineStartY + headlineLeading * 2 + (isPortrait ? 18 : 26 * S);

  const buttonStartY = subStartY + subLeading + (isPortrait ? 24 : 32 * S);
  const pillW = Math.max(120, 134 * S);
  const pillH = Math.max(34, 40 * S);

  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-opacity duration-300 z-20 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Nav Slab Invisible Hit Areas */}
      <div
        className="absolute top-0 left-0 origin-top-left flex items-center justify-between pointer-events-auto"
        style={{
          width: `${navWidth}px`,
          height: `${navHeight}px`,
          transform: navTransform,
          paddingLeft: '4.5%',
          paddingRight: '4.5%',
        }}
      >
        {/* Brand Hit Area */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="cursor-pointer bg-transparent border-0 opacity-0 w-36 h-full"
          aria-label="Home"
        />

        {/* Center Nav Links Hit Areas */}
        <div
          className="flex items-center h-full"
          style={{
            gap: `${Math.max(10, 16 * S)}px`,
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate('about')}
            onMouseEnter={() => setHoveredNavLink('about')}
            onMouseLeave={() => setHoveredNavLink(null)}
            className="cursor-pointer bg-transparent border-0 opacity-0 w-16 h-8"
            aria-label="About"
          />
          <button
            type="button"
            onClick={() => onNavigate('skills' as PageView)}
            onMouseEnter={() => setHoveredNavLink('skills')}
            onMouseLeave={() => setHoveredNavLink(null)}
            className="cursor-pointer bg-transparent border-0 opacity-0 w-16 h-8"
            aria-label="Skills"
          />
          <button
            type="button"
            onClick={() => onNavigate('studio' as PageView)}
            onMouseEnter={() => setHoveredNavLink('odoo')}
            onMouseLeave={() => setHoveredNavLink(null)}
            className="cursor-pointer bg-transparent border-0 opacity-0 w-24 h-8"
            aria-label="Odoo ERP"
          />
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            onMouseEnter={() => setHoveredNavLink('projects')}
            onMouseLeave={() => setHoveredNavLink(null)}
            className="cursor-pointer bg-transparent border-0 opacity-0 w-20 h-8"
            aria-label="Projects"
          />
        </div>

        {/* Contact Link Hit Area */}
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          onMouseEnter={() => setHoveredNavLink('contact')}
          onMouseLeave={() => setHoveredNavLink(null)}
          className="cursor-pointer bg-transparent border-0 opacity-0 w-28 h-8"
          aria-label="Contact"
        />
      </div>

      {/* 2. Main Shard Panel Invisible Hit Areas */}
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-auto"
        style={{
          width: `${panelWidth}px`,
          height: `${panelHeight}px`,
          transform: panelTransform,
        }}
      >
        {/* Buttons Hit Area */}
        <div
          className="absolute flex items-center"
          style={{
            left: `${leftMargin}px`,
            top: `${buttonStartY}px`,
            gap: `${Math.max(16, 26 * S)}px`,
          }}
        >
          {/* "Explore My Work" Hit Button */}
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            onMouseEnter={() => setIsOpenStudioHovered(true)}
            onMouseLeave={() => setIsOpenStudioHovered(false)}
            className="cursor-pointer bg-transparent border-0 opacity-0"
            style={{
              width: `${pillW}px`,
              height: `${pillH}px`,
            }}
            aria-label="Explore My Work"
          />

          {/* "Portfolio & About →" Hit Link */}
          <button
            type="button"
            onClick={() => onNavigate('about')}
            onMouseEnter={() => setIsReadPaperHovered(true)}
            onMouseLeave={() => setIsReadPaperHovered(false)}
            className="cursor-pointer bg-transparent border-0 opacity-0 h-10 w-44"
            aria-label="Portfolio & About"
          />
        </div>
      </div>
    </div>
  );
};
