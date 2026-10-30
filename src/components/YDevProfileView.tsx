/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageView, ProjectItem } from '../types';

interface YDevProfileViewProps {
  visible: boolean;
  activeTab: PageView;
  onTabChange: (tab: PageView) => void;
  onBackClick: () => void;
  isBackHovered: boolean;
  onBackHoverChange: (hovered: boolean) => void;
  onMaterialTweak?: (roughness: number, iridescence: number) => void;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'prism-engine',
    title: 'Specular Prism Engine',
    category: 'Computer Graphics & Shaders',
    description:
      'Physically grounded WebGL engine simulating spectral caustics, wavelength dispersion, and thin-film iridescence in real-time.',
    tags: ['WebGL', 'GLSL', 'Three.js', 'PBR'],
    year: '2026',
    metrics: '60 FPS on mobile',
  },
  {
    id: 'spatial-canvas',
    title: 'Synapse 3D Spatial Canvas',
    category: 'Creative Tech & Systems',
    description:
      'Infinite zoomable 3D node-graph workspace for creative coding, audio graph synthesis, and collaborative architecture exploration.',
    tags: ['React', 'TypeScript', 'WebSockets', 'Three.js'],
    year: '2025',
    metrics: '<15ms sync latency',
  },
  {
    id: 'kinetic-type',
    title: 'Kinetic Typography Lab',
    category: 'Interactive Design',
    description:
      'Audio-reactive variable font deformation framework warping glyph geometry with Web Audio FFT frequency bands.',
    tags: ['Variable Fonts', 'Canvas 2D', 'Web Audio API'],
    year: '2025',
    metrics: '40k+ playground visits',
  },
  {
    id: 'fintech-terminal',
    title: 'Horizon Analytics Terminal',
    category: 'High Performance Frontend',
    description:
      'Institutional financial analytics dashboard featuring GPU-accelerated heatmaps and streaming depth-of-market order books.',
    tags: ['Next.js', 'Tailwind', 'Rust/Wasm', 'D3'],
    year: '2024',
    metrics: '100k events/sec',
  },
];

export const YDevProfileView: React.FC<YDevProfileViewProps> = ({
  visible,
  activeTab,
  onTabChange,
  onBackClick,
  isBackHovered,
  onBackHoverChange,
  onMaterialTweak,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [studioRoughness, setStudioRoughness] = useState(0.36);
  const [studioIridescence, setStudioIridescence] = useState(0.85);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('yousefwaleedelmasry@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactMessage('');
    }, 3000);
  };

  const handleRoughnessChange = (val: number) => {
    setStudioRoughness(val);
    onMaterialTweak?.(val, studioIridescence);
  };

  const handleIridescenceChange = (val: number) => {
    setStudioIridescence(val);
    onMaterialTweak?.(studioRoughness, val);
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-opacity z-30 flex flex-col justify-between ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transitionDuration: visible ? '400ms' : '250ms',
      }}
    >
      {/* 1. Header with floating 3D Back Sliver hit area and navigation tabs */}
      <header className="w-full pt-8 px-8 md:px-16 flex items-center justify-between pointer-events-auto">
        {/* Back Hitbox matching the 3D smoked glass sliver at top-left */}
        <button
          type="button"
          onClick={onBackClick}
          onMouseEnter={() => onBackHoverChange(true)}
          onMouseLeave={() => onBackHoverChange(false)}
          className="cursor-pointer focus:outline-none transition-all duration-200 select-none flex items-center gap-2 group py-2 px-3 rounded-lg hover:bg-white/5"
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'max(13px, 0.72vw)',
            fontWeight: 500,
            color: isBackHovered ? '#b9abff' : '#ffffff',
          }}
          aria-label="Return to shattered hero slab"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Back to Slab</span>
        </button>

        {/* Multi-Page Navigation Tabs */}
        <nav
          className="flex items-center gap-1 md:gap-2 bg-[#121216]/80 border border-white/10 rounded-full p-1.5 backdrop-blur-md shadow-2xl"
          style={{ fontSize: 'max(11px, 0.68vw)' }}
        >
          {(
            [
              { id: 'about', label: 'About' },
              { id: 'projects', label: 'Work' },
              { id: 'services', label: 'Services' },
              { id: 'studio', label: 'Studio' },
              { id: 'contact', label: 'Contact' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-full transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-white text-[#050507] font-medium shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* 2. Main Scrollable Content Container */}
      <main className="w-full flex-1 overflow-y-auto px-8 md:px-16 py-8 pointer-events-auto max-w-5xl mx-auto flex flex-col justify-center select-text">
        {/* TAB 1: ABOUT YDEV */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36d67e]">
                CREATIVE TECHNOLOGIST & ENGINEER
              </span>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mt-2 mb-4 leading-tight">
                Yousef Waleed <span className="text-white/40 font-normal">(YDev)</span>
              </h2>
              <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-3xl">
                I build high-performance, immersive digital experiences at the intersection of computer graphics, mathematics, and modern web architecture. Specializing in WebGL, custom GLSL shaders, and full-stack TypeScript applications that feel tactile, responsive, and alive.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#15151a]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-xs text-white/40 font-mono mb-2">01 / GRAPHICS</div>
                <h3 className="text-base font-semibold text-white mb-2">Real-Time Shaders</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Physically-based rendering, thin-film iridescence, volumetric refraction, and GPU particle physics running at 60 FPS.
                </p>
              </div>

              <div className="bg-[#15151a]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-xs text-white/40 font-mono mb-2">02 / ARCHITECTURE</div>
                <h3 className="text-base font-semibold text-white mb-2">Full-Stack Systems</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Scalable React, TypeScript, and Node.js architectures engineered for sub-millisecond responsiveness and zero layout shift.
                </p>
              </div>

              <div className="bg-[#15151a]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-xs text-white/40 font-mono mb-2">03 / INTERACTION</div>
                <h3 className="text-base font-semibold text-white mb-2">Tactile Micro-UX</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Second-order spring physics, homography projection transforms, and haptic feedback that turn software into physical sculpture.
                </p>
              </div>
            </div>

            {/* Skills & Badges */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-3 font-semibold">
                Core Competencies & Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'WebGL & GLSL',
                  'Three.js',
                  'TypeScript',
                  'React 19 & Next.js',
                  'Node.js & Express',
                  'Tailwind CSS',
                  'GPU Shaders',
                  'Web Audio API',
                  'Mathematical Geometry',
                  'Performance Profiling',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELECTED WORK */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36d67e]">
                  PORTFOLIO & EXPERIMENTS
                </span>
                <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mt-1">
                  Selected Works
                </h2>
              </div>
              <span className="text-xs text-white/40 font-mono">2024 — 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="group bg-[#15151a]/60 border border-white/10 hover:border-white/30 rounded-2xl p-6 transition-all duration-200 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/40 font-mono mb-2">
                      <span>{proj.category}</span>
                      <span>{proj.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#b9abff] transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                    {proj.metrics && (
                      <span className="text-[11px] font-mono text-[#36d67e]">{proj.metrics}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36d67e]">
                EXPERTISE & OFFERINGS
              </span>
              <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mt-1 mb-3">
                What I Build & Deliver
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-2xl">
                Partnering with design-led tech companies, creative agencies, and visionary founders to build memorable, world-class digital products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  title: 'Bespoke 3D & WebGL Sites',
                  desc: 'High-concept interactive landing pages, 3D product visualizers, and brand experiences that capture attention and convert.',
                  deliverables: 'Interactive canvases, real-time lighting, procedural geometry, mobile optimization.',
                },
                {
                  title: 'Full-Stack Web Engineering',
                  desc: 'Robust, production-grade web applications built with TypeScript, React, Next.js, and high-performance server architectures.',
                  deliverables: 'Clean architecture, state management, OAuth integrations, zero-bug delivery.',
                },
                {
                  title: 'Custom Shader Development',
                  desc: 'Handcrafted GLSL shaders for glass refraction, liquid surfaces, holographic films, and computational art.',
                  deliverables: 'PBR materials, custom onBeforeCompile pipelines, post-processing filters.',
                },
                {
                  title: 'Performance & 60 FPS Audits',
                  desc: 'Deep profiling of WebGL draw calls, GPU memory leaks, garbage collection spikes, and responsiveness.',
                  deliverables: 'FPS stabilization, instanced mesh batching, buttery smooth touch & scroll.',
                },
              ].map((serv, idx) => (
                <div
                  key={idx}
                  className="bg-[#15151a]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">{serv.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{serv.desc}</p>
                  </div>
                  <div className="text-xs font-mono text-white/40 pt-2 border-t border-white/5">
                    <span className="text-white/60">Focus: </span>
                    {serv.deliverables}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDIO & MATERIALS LAB */}
        {activeTab === 'studio' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36d67e]">
                FACET LAB & MATERIAL PHYSICS
              </span>
              <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mt-1 mb-2">
                Real-time glass, in five terms.
              </h2>
              <p className="text-sm text-white/60 max-w-2xl mb-4">
                The optical math powering the shattered smoked-glass hero in real-time WebGL.
              </p>
            </div>

            {/* Interactive Live Material Tweaker */}
            <div className="bg-[#15151a]/80 border border-white/15 rounded-2xl p-5 backdrop-blur-md">
              <div className="text-xs font-mono uppercase tracking-wider text-[#b9abff] mb-3 flex items-center justify-between">
                <span>Interactive Shader Controls (Live Preview)</span>
                <span className="text-white/40">Adjust parameters below</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Roughness (GGX Microfacet)</span>
                    <span className="font-mono">{studioRoughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.85"
                    step="0.01"
                    value={studioRoughness}
                    onChange={(e) => handleRoughnessChange(parseFloat(e.target.value))}
                    className="w-full accent-[#36d67e] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
                    <span>Specular Mirror</span>
                    <span>Frosted Diffusion</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Iridescence Sheen</span>
                    <span className="font-mono">{studioIridescence.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={studioIridescence}
                    onChange={(e) => handleIridescenceChange(parseFloat(e.target.value))}
                    className="w-full accent-[#b9abff] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
                    <span>Neutral Smoked Glass</span>
                    <span>Vibrant Prismatic Sheen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The 5 Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-white/65 leading-relaxed">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <strong className="text-white font-medium">Iridescence</strong> — Thin-film interference produces structural coloration that shifts dynamically with view angle, governed by film thickness and refractive index.
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <strong className="text-white font-medium">Index of refraction</strong> — The ratio of light's vacuum speed to phase velocity in the medium, dictating Fresnel reflectance and critical-angle total internal reflection.
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <strong className="text-white font-medium">Dispersion</strong> — Spectral variation where refractive index depends on wavelength, decomposing white light into chromatic caustics and rainbow fringes.
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <strong className="text-white font-medium">Transmission</strong> — Coherent propagation of radiance through bulk volume without diffuse scattering, governed by the Beer-Lambert attenuation law.
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:col-span-2">
                <strong className="text-white font-medium">Roughness</strong> — Microfacet distribution variance (GGX / Beckmann) controlling transition from pristine mirror specular highlights to frosted subsurface diffusion.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36d67e]">
                GET IN TOUCH
              </span>
              <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mt-1 mb-2">
                Let's Build Something Exceptional
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-xl">
                Open for high-impact creative engineering contracts, technical advisory, and bespoke 3D WebGL projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Direct Email Card */}
              <div className="bg-[#15151a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-mono text-white/40 mb-2">Direct Channel</div>
                  <h3 className="text-lg font-semibold text-white mb-2">yousefwaleedelmasry@gmail.com</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    Feel free to reach out directly with project briefs, collaboration ideas, or technical inquiries. I typically reply within 24 hours.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-4 py-2 rounded-lg bg-white text-[#050507] hover:bg-[#36d67e] transition-colors font-medium text-xs flex items-center gap-2 cursor-pointer shadow"
                  >
                    {copiedEmail ? '✓ Copied to Clipboard!' : 'Copy Email Address'}
                  </button>

                  <a
                    href="mailto:yousefwaleedelmasry@gmail.com"
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors font-medium text-xs flex items-center gap-2 cursor-pointer"
                  >
                    Open Mail App ↗
                  </a>
                </div>
              </div>

              {/* Quick Message Form */}
              <form
                onSubmit={handleSendMessage}
                className="bg-[#15151a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs uppercase font-mono text-white/40 mb-3">Quick Note</div>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell me about your project, timeline, or vision..."
                    className="w-full bg-white/5 border border-white/10 focus:border-[#b9abff] rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none resize-none leading-relaxed transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-[11px] text-white/40">YDev Studio — Cairo / Remote</span>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#b9abff] text-[#050507] hover:bg-white transition-colors font-medium text-xs cursor-pointer shadow"
                  >
                    {messageSent ? '✓ Sent Successfully!' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer info bar */}
      <footer className="w-full pb-6 px-8 md:px-16 flex items-center justify-between text-xs text-white/30 font-mono pointer-events-auto">
        <span>YDev Studio © 2026</span>
        <span>Three.js r169 · RoomEnvironment · ACES Filmic</span>
      </footer>
    </div>
  );
};
