import React, { useState } from 'react';
import { Github, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { FEATURED_PROJECTS, PortfolioProject } from '../../data/yousefData';
import { GlassCard } from './GlassCard';

export const PortfolioProjects: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects =
    filter === 'all'
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Portfolio & Practical Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Academic & Practical Projects
            </h2>
            <p className="mt-3 text-base text-slate-300 leading-relaxed">
              Hands-on implementations applying Python, relational database modeling, and Odoo ERP modules to solve real business challenges.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'odoo', label: 'Odoo ERP' },
              { id: 'software', label: 'Python OOP' },
              { id: 'database', label: 'Databases' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0f1017] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {filteredProjects.map((project: PortfolioProject) => (
            <GlassCard
              key={project.id}
              tiltIntensity={7}
              elevation={15}
              glowColor="rgba(59, 130, 246, 0.2)"
              className="p-7 flex flex-col justify-between"
            >
              <div>
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-blue-400">{project.category}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      project.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {project.status === 'Completed' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {project.title}
                </h3>
                <span className="text-xs text-slate-400 font-medium block mb-4">
                  {project.subtitle}
                </span>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Problem Solved Box */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Business Problem Solved:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.problemSolved}
                  </p>
                </div>
              </div>

              {/* Technologies & Links Footer */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.05] text-slate-300 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  <span className="text-xs font-mono text-slate-500">{project.date}</span>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* Editable Placeholder for Future Projects */}
          <GlassCard
            tiltIntensity={5}
            elevation={10}
            glowColor="rgba(147, 197, 253, 0.12)"
            className="p-7 border-dashed border-white/[0.14] flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-slate-500">Upcoming Module</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Planned
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-300 mb-2">
                Custom Odoo Invoicing & Payment Gateway Integration
              </h3>
              <span className="text-xs text-slate-500 font-medium block mb-4">
                Financial Operations & Accounting Workflow
              </span>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Next scheduled hands-on project extending Odoo's `account.move` model to automate electronic invoicing reconciliation and recurring payment schedules for retail merchants.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-slate-500">
              <span className="font-mono">In Planning Phase</span>
              <span className="flex items-center gap-1 text-slate-400">
                <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                Will be added upon implementation
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
