import React from 'react';
import { i18n } from '../constants/i18n';

export default function StatsBar({ rooms, currentStatusFilter, onStatusFilter, currentLang }) {
    const clean = rooms.filter(r => r.status === 'clean').length;
    const cleaning = rooms.filter(r => r.status === 'cleaning').length;
    const dirty = rooms.filter(r => r.status === 'dirty').length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const maint = rooms.filter(r => r.status === 'maintenance' || r.status === 'dnd').length;

    const dict = i18n[currentLang] || i18n.en;

    const stats = [
        { key: 'clean', value: clean, label: dict.clean, dot: 'bg-emerald-400', line: 'bg-emerald-400', active: 'bg-emerald-500/15' },
        { key: 'cleaning', value: cleaning, label: dict.cleaning, dot: 'bg-amber-400', line: 'bg-amber-400', active: 'bg-amber-500/15' },
        { key: 'dirty', value: dirty, label: dict.dirty, dot: 'bg-rose-400', line: 'bg-rose-400', active: 'bg-rose-500/15' },
        { key: 'occupied', value: occupied, label: dict.occupied, dot: 'bg-blue-400', line: 'bg-blue-400', active: 'bg-blue-500/15' },
        { key: 'maintenance', value: maint, label: dict.maintenance, dot: 'bg-stone-400', line: 'bg-stone-400', active: 'bg-white/10' }
    ];

    return (
        <section className="border-b border-white/10 bg-[#0d1017]/90 backdrop-blur-sm">
            <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-5">
                {stats.map((stat) => {
                    const isActive = currentStatusFilter === stat.key;
                    return (
                        <button
                            key={stat.key}
                            type="button"
                            aria-pressed={isActive}
                            aria-label={`Filter by ${stat.label} (${stat.value})`}
                            onClick={() => onStatusFilter(stat.key)}
                            className={`group relative flex cursor-pointer flex-col gap-1 border-b border-white/5 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-amber-400 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0 ${
                                isActive ? stat.active : 'hover:bg-white/[0.04]'
                            } ${stat.key === 'maintenance' ? 'col-span-2 border-b-0 sm:col-span-1' : ''}`}
                        >
                            <span className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} aria-hidden="true"></span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400 transition-colors group-hover:text-stone-200">
                                    {stat.label}
                                </span>
                            </span>
                            <span className="font-display text-[26px] leading-none tabular-nums text-white">
                                {stat.value}
                            </span>
                            <span
                                className={`absolute inset-x-0 top-0 h-[2px] transition-opacity ${stat.line} ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                aria-hidden="true"
                            ></span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
