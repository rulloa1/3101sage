import React from 'react';
import { i18n } from '../constants/i18n';

export default function ReadinessBar({ rooms, currentLang }) {
    const cleanCount = rooms.filter(r => r.status === 'clean').length;
    const totalCount = rooms.length;
    const pct = totalCount > 0 ? Math.round((cleanCount / totalCount) * 100) : 0;
    const dict = i18n[currentLang];

    return (
        <section className="border-b border-paper-200 bg-paper-100 px-4 py-2 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs sm:flex-row">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-500">{dict.readinessLabel}</span>
                    <span className="font-black text-gold-600">{pct}%</span>
                    <span className="font-medium text-stone-500">({cleanCount} of {totalCount} rooms clean)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-paper-300 bg-paper-200 sm:w-64">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    ></div>
                </div>
            </div>
        </section>
    );
}
