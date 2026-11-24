import React, { useState } from 'react';
import { getStatusConfig, i18n } from '../constants/i18n';

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
    const dict = i18n[currentLang] || i18n.en;

    const floors = Array.from(new Set(rooms.map(r => String(r.floor)))).sort((a, b) => Number(a) - Number(b));
    const filtered = rooms.filter(r => houseFloor === 'ALL' || String(r.floor) === String(houseFloor));
    const pendingCount = filtered.filter(r => r.status === 'dirty' || r.status === 'cleaning').length;

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {/* Housekeeping View Header with Dedicated Floor Selector */}
            <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
                            <i className="fa-solid fa-broom text-lg"></i>
                        </span>
                        <div>
                            <h2 className="text-sm font-bold leading-tight">
                                {currentLang === 'es' ? 'Panel de Camaristas' : 'Housekeeping Turnover'}
                            </h2>
                            <p className="text-[11px] text-slate-400">
                                {currentLang === 'es'
                                    ? `${pendingCount} habitaciones pendientes en esta selección`
                                    : `${pendingCount} room${pendingCount === 1 ? '' : 's'} pending in this selection`}
                            </p>
                        </div>
                    </div>

                    {/* Housekeeping Floor Selector */}
                    <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1">
                        <span className="px-2 text-[10px] font-bold uppercase text-slate-400">
                            {dict.houseFloorSelect}
                        </span>
                        {['ALL', ...floors].map((f) => (
                            <button
                                key={f}
                                type="button"
                                aria-pressed={houseFloor === f}
                                onClick={() => setHouseFloor(f)}
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                                    houseFloor === f
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {f === 'ALL' ? (currentLang === 'es' ? 'Todos' : 'All') : f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Room Turnover Cards */}
            <div className="space-y-3">
                {filtered.map((room, index) => {
                    const cfg = getStatusConfig(room.status, currentLang);
                    const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;

                    return (
                        <article
                            key={room.id}
                            style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
                            className={`animate-cardIn space-y-3 overflow-hidden rounded-2xl border-2 bg-white p-4 shadow-soft transition hover:shadow-md sm:p-5 ${cfg.border}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tight text-slate-800">#{room.id}</span>
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {currentLang === 'es' ? 'Piso' : 'Floor'} {room.floor}
                                    </span>
                                    {room.wing && (
                                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 ring-1 ring-indigo-100">
                                            {room.wing}
                                        </span>
                                    )}
                                </div>
                                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm ${cfg.bg}`}>
                                    <i className={`fa-solid ${cfg.icon} text-xs`}></i>
                                    <span>{cfg.label}</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                <span><i className="fa-solid fa-bed mr-1 text-slate-400"></i> {room.type}</span>
                                {cleaningMins && (
                                    <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                                        <i className="fa-solid fa-stopwatch mr-1"></i>{cleaningMins}m
                                    </span>
                                )}
                            </div>

                            {room.notes && (
                                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs font-medium text-amber-900">
                                    <i className="fa-solid fa-note-sticky mt-0.5 text-amber-600"></i>
                                    <span>{room.notes}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => onChangeStatus(room.id, 'cleaning')}
                                    className="tap-target flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-3 text-xs font-extrabold text-amber-800 shadow-xs transition hover:bg-amber-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                >
                                    <i className="fa-solid fa-spinner"></i>
                                    <span>{dict.cleaning}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onOpenQc(room.id)}
                                    className="tap-target flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                    title="Verify quality standards and mark clean"
                                >
                                    <i className="fa-solid fa-clipboard-check text-sm"></i>
                                    <span>QC &amp; Clean</span>
                                </button>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={() => onOpenEdit(room.id)}
                                    className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                                >
                                    <i className="fa-solid fa-sliders text-xs"></i>
                                    <span>{currentLang === 'es' ? 'Editar notas / otro estado' : 'Edit notes / custom status'}</span>
                                </button>
                            </div>
                        </article>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <i className="fa-solid fa-broom mb-2 text-2xl text-slate-300"></i>
                        <p className="text-sm font-bold text-slate-600">
                            {currentLang === 'es' ? 'No hay habitaciones en este piso' : 'No rooms on this floor'}
                        </p>
                        <button
                            type="button"
                            onClick={() => setHouseFloor('ALL')}
                            className="mt-3 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                            {currentLang === 'es' ? 'Ver todos los pisos' : 'Show all floors'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
