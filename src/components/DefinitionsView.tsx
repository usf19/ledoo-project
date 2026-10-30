/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DefinitionsViewProps {
  visible: boolean;
  onBackClick: () => void;
  isBackHovered: boolean;
  onBackHoverChange: (hovered: boolean) => void;
}

export const DefinitionsView: React.FC<DefinitionsViewProps> = ({
  visible,
  onBackClick,
  isBackHovered,
  onBackHoverChange,
}) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-opacity duration-400 z-30 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transitionDuration: visible ? '400ms' : '250ms',
      }}
    >
      {/* Interactive Back Hit Box (aligned with 3D sliver at 0.219 W, 0.238 H) */}
      <button
        type="button"
        onClick={onBackClick}
        onMouseEnter={() => onBackHoverChange(true)}
        onMouseLeave={() => onBackHoverChange(false)}
        className={`fixed pointer-events-auto cursor-pointer focus:outline-none transition-colors duration-200 select-none ${
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          left: '21.9vw',
          top: '23.8vh',
          transform: 'translate(-50%, -50%)',
          fontSize: 'max(13px, 0.66vw)',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          color: isBackHovered ? '#b9abff' : '#ffffff',
          padding: '12px 24px',
          background: 'transparent',
          border: 'none',
        }}
        aria-label="Back to main hero"
      >
        ← Back
      </button>

      {/* Five Terms Column */}
      <div
        className="fixed pointer-events-auto text-left"
        style={{
          left: '32.4vw',
          width: 'max(300px, 33.9vw)',
          top: '35.9vh',
        }}
      >
        {/* Title */}
        <h2
          className="text-white mb-6 select-text"
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 650,
            fontSize: 'max(20px, 1.36vw)',
            letterSpacing: '-0.022em',
            lineHeight: 1.15,
          }}
        >
          Real-time glass, in five terms.
        </h2>

        {/* Five Paragraphs */}
        <div
          className="flex flex-col select-text"
          style={{
            gap: 'max(14px, 1.05vw)',
            fontSize: 'max(12px, 0.73vw)',
            lineHeight: 1.72,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <p>
            <strong className="text-white font-medium">Iridescence</strong> —{' '}
            Thin-film interference produces structural coloration that shifts dynamically with view angle, governed by nanometer-scale film thickness and complex refractive indices.
          </p>

          <p>
            <strong className="text-white font-medium">Index of refraction</strong> —{' '}
            The ratio of vacuum light speed to optical phase velocity within the medium, determining boundary Fresnel reflectance and critical-angle total internal reflection.
          </p>

          <p>
            <strong className="text-white font-medium">Dispersion</strong> —{' '}
            Wavelength-dependent variation of the refractive index, splitting broadband white illumination into spectral caustics and prismatic rainbow fringing.
          </p>

          <p>
            <strong className="text-white font-medium">Transmission</strong> —{' '}
            Specular transit of radiance through bulk medium without diffuse scattering, modulated by volumetric Beer-Lambert attenuation and internal extinction coefficients.
          </p>

          <p>
            <strong className="text-white font-medium">Roughness</strong> —{' '}
            Microfacet distribution variance (GGX / Beckmann) controlling the physical transition from crisp specular clarity to soft subsurface diffusion.
          </p>
        </div>
      </div>
    </div>
  );
};
