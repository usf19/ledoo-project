/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Mail, MapPin, GraduationCap, CheckCircle2 } from 'lucide-react';
import { YOUSEF_PROFILE } from '../../data/yousefData';
import { GlassCard } from './GlassCard';

export const PortfolioHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Background ambient lighting and subtle micro-grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BIS Student • Aspiring Odoo ERP Developer</span>
            </div>

            {/* Main Name & Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Yousef Waleed
              </h1>
              <p className="mt-3 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-cyan-300 to-slate-200 bg-clip-text text-transparent">
                {YOUSEF_PROFILE.headline}
              </p>
            </div>

            {/* Professional Introduction */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl whitespace-pre-line">
              {YOUSEF_PROFILE.introduction}
            </p>

            {/* Quick Meta Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Ashmoun, Al Minufiyah, Egypt</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>BIS Student • Tanta Institute</span>
              </div>
            </div>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/20 text-white font-medium text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Contact Me</span>
              </a>
            </div>

          </div>

          {/* Right Column: Physical 3D Smoked Glass Profile Card */}
          <div className="lg:col-span-5 flex justify-center">
            <GlassCard
              tiltIntensity={9}
              elevation={18}
              glowColor="rgba(59, 130, 246, 0.22)"
              className="w-full max-w-md p-7 text-left"
            >
              {/* Profile Header with Avatar representation */}
              <div className="flex items-center gap-4 border-b border-white/[0.08] pb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25">
                    <div className="w-full h-full rounded-[14px] bg-[#0c0d12] flex items-center justify-center font-bold text-xl text-white">
                      YW
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f1017]" title="Active & Learning" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Yousef Waleed</h3>
                  <p className="text-xs text-blue-400 font-medium">Business Information Systems</p>
                  <p className="text-[11px] text-slate-400">Aspiring Odoo ERP Developer</p>
                </div>
              </div>

              {/* Core Focus Badges */}
              <div className="py-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Key Competency Areas
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Business Process Mapping', desc: 'Analyzing commercial workflows into modular logic' },
                    { title: 'Python & Object-Oriented Code', desc: 'Writing clean models, classes, and backend methods' },
                    { title: 'Odoo ERP Ecosystem', desc: 'Developing custom modules, XML views, and ORM records' },
                    { title: 'Relational Database Design', desc: 'PostgreSQL architecture, normalization, and joins' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-200">{item.title}</span>
                        <span className="block text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institution Footer */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Higher Institute Tanta</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Open to Internships
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
