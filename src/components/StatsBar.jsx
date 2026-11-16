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
        value: 'text-emerald-300',
        well: 'bg-emerald-500/12 text-emerald-400 ring-1 ring-emerald-400/25',
        active: 'border-emerald-400/60 bg-emerald-500/[0.12] ring-2 ring-emerald-400/25'
    },
    amber: {
        value: 'text-amber-300',
        well: 'bg-amber-500/12 text-amber-400 ring-1 ring-amber-400/25',
        active: 'border-amber-400/60 bg-amber-500/[0.12] ring-2 ring-amber-400/25'
    },
    rose: {
        value: 'text-rose-300',
        well: 'bg-rose-500/12 text-rose-400 ring-1 ring-rose-400/25',
        active: 'border-rose-400/60 bg-rose-500/[0.12] ring-2 ring-rose-400/25'
    },
    blue: {
        value: 'text-blue-300',
        well: 'bg-blue-500/12 text-blue-400 ring-1 ring-blue-400/25',
        active: 'border-blue-400/60 bg-blue-500/[0.12] ring-2 ring-blue-400/25'
    },
    purple: {
        value: 'text-purple-300',
        well: 'bg-purple-500/12 text-purple-400 ring-1 ring-purple-400/25',
        active: 'border-purple-400/60 bg-purple-500/[0.12] ring-2 ring-purple-400/25'
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
        <section className="border-b border-white/[0.07] bg-ink-900/40 px-4 py-3.5 backdrop-blur-xl sm:px-6">
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
                            className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                key === 'maintenance' ? 'col-span-2 sm:col-span-1' : ''
                            } ${
                                isActive
                                    ? tone.active
                                    : 'border-white/[0.08] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]'
                            }`}
                        >
                            <div>
                                <div className={`text-2xl font-black tracking-tight ${tone.value}`}>{counts[key]}</div>
                                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    {dict[key]}
                                </div>
                            </div>
                            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.well}`}>
                                <i className={`fa-solid ${icon} text-base ${iconSpin ? 'fa-spin' : ''}`}></i>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
