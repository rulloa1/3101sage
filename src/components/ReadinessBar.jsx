import React from 'react';
import { i18n } from '../constants/i18n';

export default function ReadinessBar({ rooms, currentLang }) {
    const cleanCount = rooms.filter(r => r.status === 'clean').length;
    const totalCount = rooms.length;
    const pct = totalCount > 0 ? Math.round((cleanCount / totalCount) * 100) : 0;
    const dict = i18n[currentLang] || i18n.en;

    return (
        <section className="border-b border-white/10 bg-[#121622] px-4 py-2.5 backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:gap-5">
                <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">
                        {dict.readinessLabel}
                    </span>
                    <span className="font-display text-[22px] leading-none tabular-nums text-white">{pct}%</span>
                    <span className="font-medium text-stone-300">
                        <strong className="text-white">{cleanCount}</strong> <span className="text-stone-400">of</span> {totalCount}
                        <span className="ml-1 text-stone-400">suites ready</span>
                    </span>
                </div>

                <div
                    role="progressbar"
                    aria-label={`${dict.readinessLabel} ${cleanCount} of ${totalCount} rooms ready`}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-[4px] w-full overflow-hidden rounded-full bg-white/10 sm:ml-auto sm:w-64"
                >
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    ></div>
                </div>
            </div>
        </section>
    );
}
