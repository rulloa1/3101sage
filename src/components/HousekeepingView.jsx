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
            <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg border border-gold-600/40 bg-paper-100 p-4 text-paper-50 shadow-xl">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 contrast-125"
                    style={{ backgroundImage: `url(${hotelSuite})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#1c1a17]/92 to-[#141210]/60"></div>
                <div className="hairline-gold absolute inset-x-0 top-0 opacity-70"></div>

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-gold-300 bg-black/30 text-gold-600 shadow-gold-glow">
                        <i className="fa-solid fa-broom text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-tight text-paper-50">
                            {currentLang === 'es' ? 'Panel de Camaristas' : 'Housekeeping Turnover View'}
                        </h2>
                        <p className="text-[11px] text-stone-500">
                            {currentLang === 'es' ? 'Optimizado para teléfonos y rondas' : 'Mobile-first large touch targets'}
                        </p>
                    </div>
                </div>

                {/* Housekeeping Floor Selector */}
                <div className="relative z-10 flex items-center space-x-1 rounded border border-gold-300 bg-black/30 p-1">
                    <span className="px-2 text-[10px] font-bold uppercase text-stone-500">
                        {dict.houseFloorSelect}
                    </span>
                    {['ALL', '1', '2', '3'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setHouseFloor(f)}
                            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-bold transition ${
                                houseFloor === f
                                    ? 'bg-brand-600 text-white shadow-brand-glow'
                                    : 'text-stone-700 hover:bg-stone-900/[0.055] hover:text-ink'
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
                                    <span className="text-3xl font-black tracking-tight text-ink">#{room.id}</span>
                                    <span className="ml-2 rounded-md border border-paper-300 bg-stone-900/[0.045] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-700">
                                        {currentLang === 'es' ? 'Piso' : 'Floor'} {room.floor}
                                    </span>
                                </div>
                                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${cfg.bg}`}>
                                    <i className={`fa-solid ${cfg.icon} text-xs`}></i>
                                    <span>{cfg.label}</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                                <span><i className="fa-solid fa-bed mr-1 text-stone-500"></i> {room.type}</span>
                                {cleaningMins && (
                                    <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                                        <i className="fa-solid fa-stopwatch mr-1"></i>{cleaningMins}m
                                    </span>
                                )}
                            </div>

                            {room.notes && (
                                <div className="flex items-start gap-2 rounded-md border border-gold-300 bg-gold-50 p-2.5 text-xs font-medium text-stone-800">
                                    <i className="fa-solid fa-note-sticky mt-0.5 text-gold-600"></i>
                                    <span>{room.notes}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => onChangeStatus(room.id, 'cleaning')}
                                    className="tap-target flex cursor-pointer items-center justify-center space-x-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-extrabold text-amber-700 transition hover:bg-amber-50 active:scale-95"
                                >
                                    <i className="fa-solid fa-spinner"></i>
                                    <span>{dict.cleaning}</span>
                                </button>
                                <button
                                    onClick={() => onOpenQc(room.id)}
                                    className="tap-target flex cursor-pointer items-center justify-center space-x-2 rounded-md bg-emerald-600 px-3 py-3 text-xs font-extrabold text-white shadow-md shadow-sm transition hover:bg-emerald-500 active:scale-95"
                                    title="Verificar estándares de calidad"
                                >
                                    <i className="fa-solid fa-clipboard-check text-sm"></i>
                                    <span>{dict.clean}</span>
                                </button>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => onOpenEdit(room.id)}
                                    className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs font-bold text-stone-500 transition hover:bg-stone-900/[0.045] hover:text-brand-400"
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
