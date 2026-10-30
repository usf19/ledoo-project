import React, { useState } from 'react';
import { Code, Database, Layers, CheckCircle, Terminal, Cpu } from 'lucide-react';
import { SKILLS_DATA, SkillItem } from '../../data/yousefData';
import { GlassCard } from './GlassCard';

export const PortfolioSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Competencies', icon: Layers },
    { id: 'programming', label: 'Programming & Development', icon: Code },
    { id: 'database', label: 'Databases & Modeling', icon: Database },
    { id: 'erp', label: 'ERP & Business Systems', icon: Cpu },
  ];

  const displayedCategories =
    activeCategory === 'all'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((c) => c.category === activeCategory);

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Technical Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Organized Skills & Technologies
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Curated toolkit combining enterprise backend engineering, relational persistence, and modular ERP automation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30'
                    : 'bg-[#0f1017] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="space-y-10">
          {displayedCategories.map((group) => (
            <div key={group.category} className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-lg font-semibold text-white tracking-tight">{group.title}</h3>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">{group.description}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.skills.map((skill: SkillItem) => (
                  <GlassCard
                    key={skill.name}
                    tiltIntensity={8}
                    elevation={12}
                    glowColor="rgba(59, 130, 246, 0.16)"
                    className="p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </span>
                        {skill.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {skill.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                        Practical BIS Application
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
