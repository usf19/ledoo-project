/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { YOUSEF_PROFILE } from '../../data/yousefData';

export const PortfolioFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050608] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              YW
            </div>
            <div className="text-left">
              <span className="font-semibold text-white block">Yousef Waleed</span>
              <span className="text-[11px] text-slate-500">
                Business Information Systems • Aspiring Odoo ERP Developer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#odoo" className="hover:text-white transition-colors">Odoo ERP</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>© 2026 Yousef Waleed. Built with clean code, Python & modern Web technologies.</span>
          <span>Ashmoun, Al Minufiyah, Egypt</span>
        </div>
      </div>
    </footer>
  );
};
