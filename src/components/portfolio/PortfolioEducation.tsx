import React from 'react';
import { GraduationCap, BookOpen, Award, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { YOUSEF_PROFILE } from '../../data/yousefData';
import { GlassCard } from './GlassCard';

export const PortfolioEducation: React.FC = () => {
  const { education } = YOUSEF_PROFILE;

  const coursework = [
    'Enterprise Resource Planning (ERP) Principles',
    'Systems Analysis & Design (SAD)',
    'Relational Database Systems (SQL & PostgreSQL)',
    'Object-Oriented Programming in Python',
    'Business Process Modeling (BPMN)',
    'Accounting Information Systems & Financial Logic',
    'Operations & Supply Chain Management',
    'Software Project Management',
  ];

  return (
    <section id="education" className="py-20 md:py-28 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Academic Background
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Formal Education & Specialization
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            The institutional foundation empowering my blend of commercial process understanding and computer science.
          </p>
        </div>

        {/* Education Highlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          {/* Main Institution Card */}
          <GlassCard
            tiltIntensity={6}
            elevation={16}
            glowColor="rgba(59, 130, 246, 0.22)"
            className="lg:col-span-7 p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-blue-400">
                  {education.duration}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  {education.degree}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  {education.institution}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tanta, Egypt</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Academic Curriculum & Focus
              </h4>
              <ul className="space-y-2.5">
                {education.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          {/* Key Coursework Box */}
          <GlassCard
            tiltIntensity={6}
            elevation={16}
            glowColor="rgba(34, 211, 238, 0.2)"
            className="lg:col-span-5 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Relevant Coursework</h4>
                <span className="text-xs text-slate-400">BIS Core Modules</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coursework.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-slate-300"
                >
                  {course}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.08] text-xs text-slate-400 leading-relaxed">
              <strong className="text-white block mb-1">Practical Integration:</strong>
              Classroom theoretical models are continuously implemented as applied code repositories and practical Odoo sandbox testing modules.
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

