import React, { useState } from 'react';
import { INDIAN_TRAFFIC_RULES, LOK_ADALAT_DATA } from '../data/mockVehicles';
import { TrafficRule } from '../types';
import { Search, Scale, AlertTriangle, ShieldCheck, Calendar, Tag, ChevronRight } from 'lucide-react';

export const RulesDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Offenses' },
    { id: 'SPEED', label: 'Speeding' },
    { id: 'SAFETY', label: 'Safety (Helmet/Belt)' },
    { id: 'DOCUMENT', label: 'PUCC & Insurance' },
    { id: 'PARKING', label: 'Parking & Obstruction' },
    { id: 'DUI', label: 'Drunk Driving' }
  ];

  const filteredRules = INDIAN_TRAFFIC_RULES.filter(rule => {
    if (selectedCategory !== 'ALL' && rule.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rule.section.toLowerCase().includes(q) ||
        rule.violation.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Lok Adalat Special Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-5 text-white shadow-md border border-indigo-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
              National Lok Adalat Alert
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-xs">
            UP TO {LOK_ADALAT_DATA.maxWaiverPercent}% OFF
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">{LOK_ADALAT_DATA.title}</h3>
          <p className="text-xs text-indigo-200 mt-0.5">
            Next Session: <span className="font-bold text-white">{LOK_ADALAT_DATA.date}</span>
          </p>
        </div>

        <div className="text-[11px] text-slate-300 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
          Challans for Red Light, Speeding, and No Helmet can be settled with 50%-75% waiver by generating an online Lok Adalat token before the court session.
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search rules (e.g. Helmet, Speed, Sec 183)..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Catalog */}
      <div className="space-y-3">
        {filteredRules.map(rule => (
          <div
            key={rule.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 space-y-2.5 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {rule.section}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                  {rule.violation}
                </h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">1st Offense</span>
                <div className="text-sm font-black text-red-600 font-mono">
                  ₹{rule.firstOffenseFine.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {rule.description}
            </p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">Repeat Penalty:</span>
                <span className="font-bold text-slate-900 font-mono">₹{rule.repeatOffenseFine.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block">License Points / Court:</span>
                <span className="font-bold text-indigo-700">
                  {rule.penaltyPoints} Points {rule.courtCompoundable ? '(Compoundable)' : '(Non-Compoundable)'}
                </span>
              </div>
            </div>

            {rule.imprisonment && (
              <div className="text-[10px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Statutory Risk: {rule.imprisonment}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
