import React from 'react';
import { i18n } from '../constants/i18n';

export default function ReadinessBar({ rooms, currentLang }) {
    const cleanCount = rooms.filter(r => r.status === 'clean').length;
    const totalCount = rooms.length;
    const pct = totalCount > 0 ? Math.round((cleanCount / totalCount) * 100) : 0;
    const dict = i18n[currentLang];

    return (
        <section className="bg-slate-900 text-white px-4 sm:px-6 py-2 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">{dict.readinessLabel}</span>
                    <span className="font-bold text-amber-300">{pct}%</span>
                    <span className="text-slate-500 font-medium">({cleanCount} of {totalCount} rooms ready)</span>
                </div>
                <div
                    role="progressbar"
                    aria-label={`${dict.readinessLabel}: ${cleanCount} of ${totalCount} rooms ready`}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="w-full sm:w-64 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/80"
                >
                    <div 
                        className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                    ></div>
                </div>
            </div>
        </section>
    );
}
