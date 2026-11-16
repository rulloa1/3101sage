import React from 'react';
import { i18n } from '../constants/i18n';

const TILES = [
    { key: 'clean', accent: 'emerald', icon: 'fa-circle-check', iconSpin: false },
    { key: 'cleaning', accent: 'amber', icon: 'fa-arrows-rotate', iconSpin: true },
    { key: 'dirty', accent: 'rose', icon: 'fa-broom', iconSpin: false },
    { key: 'occupied', accent: 'blue', icon: 'fa-user-check', iconSpin: false },
    { key: 'maintenance', accent: 'purple', icon: 'fa-wrench', iconSpin: false }
];

const ACCENTS = {
    emerald: {
        value: 'text-emerald-700',
        well: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        active: 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
    },
    amber: {
        value: 'text-amber-700',
        well: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        active: 'border-amber-300 bg-amber-50 ring-2 ring-amber-200'
    },
    rose: {
        value: 'text-rose-700',
        well: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        active: 'border-rose-300 bg-rose-50 ring-2 ring-rose-200'
    },
    blue: {
        value: 'text-blue-700',
        well: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
        active: 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
    },
    purple: {
        value: 'text-purple-700',
        well: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
        active: 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
    }
};

export default function StatsBar({ rooms, currentStatusFilter, onStatusFilter, currentLang }) {
    const counts = {
        clean: rooms.filter(r => r.status === 'clean').length,
        cleaning: rooms.filter(r => r.status === 'cleaning').length,
        dirty: rooms.filter(r => r.status === 'dirty').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        maintenance: rooms.filter(r => r.status === 'maintenance' || r.status === 'dnd').length
    };

    const dict = i18n[currentLang];

    return (
        <section className="border-b border-paper-200 bg-paper-50/85 px-4 py-3.5 backdrop-blur-xl sm:px-6">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-5">
                {TILES.map(({ key, accent, icon, iconSpin }) => {
                    const isActive = currentStatusFilter === key;
                    const tone = ACCENTS[accent];

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onStatusFilter(key)}
                            aria-pressed={isActive}
                            className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                key === 'maintenance' ? 'col-span-2 sm:col-span-1' : ''
                            } ${
                                isActive
                                    ? tone.active
                                    : 'border-paper-200 bg-stone-900/[0.025] hover:border-[#d8cdb9] hover:bg-stone-900/[0.045]'
                            }`}
                        >
                            <div>
                                <div className={`text-2xl font-black tracking-tight ${tone.value}`}>{counts[key]}</div>
                                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
                                    {dict[key]}
                                </div>
                            </div>
                            <span className={`flex h-9 w-9 items-center justify-center rounded-md ${tone.well}`}>
                                <i className={`fa-solid ${icon} text-base ${iconSpin ? 'fa-spin' : ''}`}></i>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
