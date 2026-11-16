import React from 'react';
import { i18n } from '../constants/i18n';

export default function StatsBar({ rooms, currentStatusFilter, onStatusFilter, currentLang }) {
    const clean = rooms.filter(r => r.status === 'clean').length;
    const cleaning = rooms.filter(r => r.status === 'cleaning').length;
    const dirty = rooms.filter(r => r.status === 'dirty').length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const maint = rooms.filter(r => r.status === 'maintenance' || r.status === 'dnd').length;

    const dict = i18n[currentLang];

    return (
        <section className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3.5 shadow-soft">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Clean / Ready */}
                <div 
                    onClick={() => onStatusFilter('clean')} 
                    className={`cursor-pointer group p-3 rounded-2xl border transition flex items-center justify-between ${
                        currentStatusFilter === 'clean' 
                            ? 'bg-emerald-100/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/30' 
                            : 'bg-emerald-50/60 border-emerald-200/90 hover:border-emerald-400 hover:shadow-md'
                    }`}
                >
                    <div>
                        <div className="text-2xl font-black text-emerald-800 tracking-tight">{clean}</div>
                        <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold">{dict.clean}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <i className="fa-solid fa-circle-check text-base"></i>
                    </div>
                </div>

                {/* In Progress (Cleaning) */}
                <div 
                    onClick={() => onStatusFilter('cleaning')} 
                    className={`cursor-pointer group p-3 rounded-2xl border transition flex items-center justify-between ${
                        currentStatusFilter === 'cleaning' 
                            ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-500/30' 
                            : 'bg-amber-50/60 border-amber-200/90 hover:border-amber-400 hover:shadow-md'
                    }`}
                >
                    <div>
                        <div className="text-2xl font-black text-amber-800 tracking-tight">{cleaning}</div>
                        <div className="text-[11px] uppercase tracking-wider text-amber-700 font-bold">{dict.cleaning}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <i className="fa-solid fa-arrows-rotate text-base fa-spin"></i>
                    </div>
                </div>

                {/* Dirty / Vacant */}
                <div 
                    onClick={() => onStatusFilter('dirty')} 
                    className={`cursor-pointer group p-3 rounded-2xl border transition flex items-center justify-between ${
                        currentStatusFilter === 'dirty' 
                            ? 'bg-rose-100/80 border-rose-500 shadow-md ring-2 ring-rose-500/30' 
                            : 'bg-rose-50/60 border-rose-200/90 hover:border-rose-400 hover:shadow-md'
                    }`}
                >
                    <div>
                        <div className="text-2xl font-black text-rose-800 tracking-tight">{dirty}</div>
                        <div className="text-[11px] uppercase tracking-wider text-rose-700 font-bold">{dict.dirty}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <i className="fa-solid fa-broom text-base"></i>
                    </div>
                </div>

                {/* Occupied */}
                <div 
                    onClick={() => onStatusFilter('occupied')} 
                    className={`cursor-pointer group p-3 rounded-2xl border transition flex items-center justify-between ${
                        currentStatusFilter === 'occupied' 
                            ? 'bg-blue-100/80 border-blue-500 shadow-md ring-2 ring-blue-500/30' 
                            : 'bg-blue-50/60 border-blue-200/90 hover:border-blue-400 hover:shadow-md'
                    }`}
                >
                    <div>
                        <div className="text-2xl font-black text-blue-800 tracking-tight">{occupied}</div>
                        <div className="text-[11px] uppercase tracking-wider text-blue-700 font-bold">{dict.occupied}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <i className="fa-solid fa-user-check text-base"></i>
                    </div>
                </div>

                {/* Maintenance / DND */}
                <div 
                    onClick={() => onStatusFilter('maintenance')} 
                    className={`cursor-pointer group p-3 rounded-2xl border transition flex items-center justify-between col-span-2 sm:col-span-1 ${
                        currentStatusFilter === 'maintenance' 
                            ? 'bg-purple-100/80 border-purple-500 shadow-md ring-2 ring-purple-500/30' 
                            : 'bg-purple-50/60 border-purple-200/90 hover:border-purple-400 hover:shadow-md'
                    }`}
                >
                    <div>
                        <div className="text-2xl font-black text-purple-800 tracking-tight">{maint}</div>
                        <div className="text-[11px] uppercase tracking-wider text-purple-700 font-bold">{dict.maintenance}</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <i className="fa-solid fa-wrench text-base"></i>
                    </div>
                </div>
            </div>
        </section>
    );
}
