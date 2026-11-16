import React, { useState } from 'react';
import { getStatusConfig, i18n } from '../constants/i18n';
import hotelSuite from '../assets/hotel-suite.jpg';

function getCleaningMinutes(startedAt) {
    if (!startedAt) return null;
    const elapsedMs = Date.now() - startedAt;
    return Math.max(1, Math.floor(elapsedMs / 60000));
}

export default function HousekeepingView({
    rooms,
    currentLang,
    onChangeStatus,
    onOpenQc,
    onOpenEdit
}) {
    const [houseFloor, setHouseFloor] = useState('ALL');
    const dict = i18n[currentLang];

    const filtered = rooms.filter(r => houseFloor === 'ALL' || String(r.floor) === String(houseFloor));

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {/* Housekeeping View Header with Luxury Hospitality Suite Backdrop */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/10 p-4 text-white shadow-lux">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 contrast-125"
                    style={{ backgroundImage: `url(${hotelSuite})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/92 to-ink-950/70"></div>
                <div className="hairline-gold absolute inset-x-0 top-0 opacity-70"></div>

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-500/[0.12] text-gold-400 shadow-gold-glow">
                        <i className="fa-solid fa-broom text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-tight text-white">
                            {currentLang === 'es' ? 'Panel de Camaristas' : 'Housekeeping Turnover View'}
                        </h2>
                        <p className="text-[11px] text-slate-400">
                            {currentLang === 'es' ? 'Optimizado para teléfonos y rondas' : 'Mobile-first large touch targets'}
                        </p>
                    </div>
                </div>

                {/* Housekeeping Floor Selector */}
                <div className="relative z-10 flex items-center space-x-1 rounded-xl border border-white/10 bg-ink-950/70 p-1 backdrop-blur-sm">
                    <span className="px-2 text-[10px] font-bold uppercase text-slate-400">
                        {dict.houseFloorSelect}
                    </span>
                    {['ALL', '1', '2', '3'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setHouseFloor(f)}
                            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-bold transition ${
                                houseFloor === f
                                    ? 'bg-brand-600 text-white shadow-brand-glow'
                                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                            }`}
                        >
                            {f === 'ALL' ? (currentLang === 'es' ? 'Todos' : 'All') : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Room Turnover Cards */}
            <div className="space-y-3">
                {filtered.map((room) => {
                    const cfg = getStatusConfig(room.status, currentLang);
                    const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;

                    return (
                        <article
                            key={room.id}
                            className={`panel panel-raise space-y-3 border-l-2 p-4 sm:p-5 ${cfg.border}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-3xl font-black tracking-tight text-white">#{room.id}</span>
                                    <span className="ml-2 rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                        {currentLang === 'es' ? 'Piso' : 'Floor'} {room.floor}
                                    </span>
                                </div>
                                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${cfg.bg}`}>
                                    <i className={`fa-solid ${cfg.icon} text-xs`}></i>
                                    <span>{cfg.label}</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                                <span><i className="fa-solid fa-bed mr-1 text-slate-500"></i> {room.type}</span>
                                {cleaningMins && (
                                    <span className="rounded border border-amber-500/25 bg-amber-500/[0.10] px-2 py-0.5 font-bold text-amber-300">
                                        <i className="fa-solid fa-stopwatch mr-1"></i>{cleaningMins}m
                                    </span>
                                )}
                            </div>

                            {room.notes && (
                                <div className="flex items-start gap-2 rounded-xl border border-gold-500/25 bg-gold-500/[0.07] p-2.5 text-xs font-medium text-slate-200">
                                    <i className="fa-solid fa-note-sticky mt-0.5 text-gold-400"></i>
                                    <span>{room.notes}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => onChangeStatus(room.id, 'cleaning')}
                                    className="tap-target flex cursor-pointer items-center justify-center space-x-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.10] px-3 py-3 text-xs font-extrabold text-amber-300 transition hover:bg-amber-500/[0.18] active:scale-95"
                                >
                                    <i className="fa-solid fa-spinner"></i>
                                    <span>{dict.cleaning}</span>
                                </button>
                                <button
                                    onClick={() => onOpenQc(room.id)}
                                    className="tap-target flex cursor-pointer items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-950/40 transition hover:bg-emerald-500 active:scale-95"
                                    title="Verificar estándares de calidad"
                                >
                                    <i className="fa-solid fa-clipboard-check text-sm"></i>
                                    <span>{dict.clean}</span>
                                </button>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => onOpenEdit(room.id)}
                                    className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-brand-400"
                                >
                                    <i className="fa-solid fa-sliders text-xs"></i>
                                    <span>{currentLang === 'es' ? 'Editar notas / otro estado' : 'Edit notes / custom status'}</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
