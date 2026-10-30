/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, Layers, Cpu, Award, BookOpen, MapPin, ArrowUpRight } from 'lucide-react';
import { YOUSEF_PROFILE } from '../../data/yousefData';
import { GlassCard } from './GlassCard';

export const PortfolioAbout: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Bridging Business Operations & Software Engineering
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            The intersection where business intelligence meets clean code.
          </p>
        </div>

        {/* Grid: Story + Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <GlassCard
              tiltIntensity={5}
              elevation={12}
              glowColor="rgba(59, 130, 246, 0.18)"
              className="p-7 sm:p-8 space-y-4"
            >
              <div className="prose prose-invert max-w-none text-sm sm:text-base text-slate-300 leading-relaxed space-y-4">
                <p>
                  My journey began with a fundamental question:{' '}
                  <span className="text-white font-medium">
                    Why do companies struggle with inefficiencies when modern software can automate their most repetitive tasks?
                  </span>{' '}
                  As a Business Information Systems (BIS) student at the Higher Institute for Computers, Information and Management Technology in Tanta, I set out to bridge this critical gap.
                </p>
                <p>
                  Most developers understand how to write code, but rarely understand how a balance sheet balances, why inventory turnover affects cash flow, or how sales pipelines convert into delivery orders. Conversely, business managers understand corporate workflows but lack the technical capability to build custom automations.
                </p>
                <p>
                  This is where my dedication lies. I combine a solid foundation in{' '}
                  <span className="text-blue-400 font-medium">business domain logic</span> (finance, supply chain, CRM, and sales lifecycles) with hands-on programming skills in{' '}
                  <span className="text-blue-400 font-medium">Python, Object-Oriented Design, and PostgreSQL</span> to engineer real-world business automation.
                </p>
                <p>
                  Today, I am channeling this focus directly into{' '}
                  <span className="text-white font-semibold">Odoo ERP</span>—learning how modular ERP systems unify distinct departments under a single cohesive database, and building practical projects that turn complex operational logic into automated, error-free software solutions.
                </p>
              </div>
            </GlassCard>

            {/* Quick Fact Badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <GlassCard
                tiltIntensity={8}
                elevation={10}
                glowColor="rgba(59, 130, 246, 0.25)"
                className="p-4"
              >
                <div className="text-2xl font-bold text-blue-400 font-mono">BIS</div>
                <div className="text-xs text-slate-400 mt-1">Specialization Degree</div>
              </GlassCard>

              <GlassCard
                tiltIntensity={8}
                elevation={10}
                glowColor="rgba(34, 211, 238, 0.25)"
                className="p-4"
              >
                <div className="text-2xl font-bold text-cyan-400 font-mono">Python</div>
                <div className="text-xs text-slate-400 mt-1">Core Tech Stack</div>
              </GlassCard>

              <GlassCard
                tiltIntensity={8}
                elevation={10}
                glowColor="rgba(52, 211, 153, 0.25)"
                className="p-4"
              >
                <div className="text-2xl font-bold text-emerald-400 font-mono">Odoo</div>
                <div className="text-xs text-slate-400 mt-1">ERP Specialization</div>
              </GlassCard>
            </div>
          </div>

          {/* Right Cards: Pillars of Value */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard
              tiltIntensity={6}
              elevation={14}
              glowColor="rgba(59, 130, 246, 0.22)"
              className="p-6 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Business Process Acumen</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Deep comprehension of quotation-to-cash, procurement-to-pay, and warehouse tracking lifecycles. I design solutions that solve authentic business pain points.
              </p>
            </GlassCard>

            <GlassCard
              tiltIntensity={6}
              elevation={14}
              glowColor="rgba(34, 211, 238, 0.22)"
              className="p-6 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Python OOP & Custom Logic</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Clean, maintainable object-oriented code, inheritance patterns, business constraints, and automated triggers that mirror real corporate policies.
              </p>
            </GlassCard>

            <GlassCard
              tiltIntensity={6}
              elevation={14}
              glowColor="rgba(52, 211, 153, 0.22)"
              className="p-6 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Continuous Practical Learning</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Relentless hands-on exploration of Odoo source code, official documentation, community best practices, and building modules from scratch.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

