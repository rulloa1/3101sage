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
        {
            key: 'clean', value: clean, label: dict.clean, icon: 'fa-circle-check',
            base: 'bg-emerald-50/70 border-emerald-200/90 hover:border-emerald-400',
            active: 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-500/30',
            valueTone: 'text-emerald-800', labelTone: 'text-emerald-700',
            iconBox: 'bg-emerald-100 text-emerald-600'
        },
        {
            key: 'cleaning', value: cleaning, label: dict.cleaning, icon: 'fa-arrows-rotate fa-spin',
            base: 'bg-amber-50/70 border-amber-200/90 hover:border-amber-400',
            active: 'bg-amber-100/80 border-amber-500 ring-2 ring-amber-500/30',
            valueTone: 'text-amber-800', labelTone: 'text-amber-700',
            iconBox: 'bg-amber-100 text-amber-600'
        },
        {
            key: 'dirty', value: dirty, label: dict.dirty, icon: 'fa-broom',
            base: 'bg-rose-50/70 border-rose-200/90 hover:border-rose-400',
            active: 'bg-rose-100/80 border-rose-500 ring-2 ring-rose-500/30',
            valueTone: 'text-rose-800', labelTone: 'text-rose-700',
            iconBox: 'bg-rose-100 text-rose-600'
        },
        {
            key: 'occupied', value: occupied, label: dict.occupied, icon: 'fa-user-check',
            base: 'bg-blue-50/70 border-blue-200/90 hover:border-blue-400',
            active: 'bg-blue-100/80 border-blue-500 ring-2 ring-blue-500/30',
            valueTone: 'text-blue-800', labelTone: 'text-blue-700',
            iconBox: 'bg-blue-100 text-blue-600'
        },
        {
            key: 'maintenance', value: maint, label: dict.maintenance, icon: 'fa-wrench',
            base: 'bg-purple-50/70 border-purple-200/90 hover:border-purple-400',
            active: 'bg-purple-100/80 border-purple-500 ring-2 ring-purple-500/30',
            valueTone: 'text-purple-800', labelTone: 'text-purple-700',
            iconBox: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <section className="border-b border-slate-200/90 bg-white px-4 py-3.5 shadow-soft sm:px-6">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-5">
                {stats.map((stat) => {
                    const isActive = currentStatusFilter === stat.key;
                    return (
                        <button
                            key={stat.key}
                            type="button"
                            aria-pressed={isActive}
                            aria-label={`Filter by ${stat.label} (${stat.value})`}
                            onClick={() => onStatusFilter(stat.key)}
                            className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                isActive ? stat.active : stat.base
                            } ${stat.key === 'maintenance' ? 'col-span-2 sm:col-span-1' : ''}`}
                        >
                            <div>
                                <div className={`text-2xl font-black tracking-tight ${stat.valueTone}`}>{stat.value}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${stat.labelTone}`}>{stat.label}</div>
                            </div>
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBox}`}>
                                <i className={`fa-solid ${stat.icon} text-base`}></i>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
