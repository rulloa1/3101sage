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
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Housekeeping View Header with Luxury Hospitality Suite Backdrop */}
            <div className="relative overflow-hidden bg-slate-900 text-white p-4.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl border border-slate-700/80">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-25 filter contrast-125"
                    style={{ backgroundImage: `url(${hotelSuite})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/80"></div>
                
                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-xs">
                        <i className="fa-solid fa-broom text-lg"></i>
                    </div>
                    <div>
                        <h2 className="font-bold text-sm leading-tight text-white">
                            {currentLang === 'es' ? 'Panel de Camaristas' : 'Housekeeping Turnover View'}
                        </h2>
                        <p className="text-[11px] text-slate-300">
                            {currentLang === 'es' ? 'Optimizado para teléfonos y rondas' : 'Mobile-first large touch targets'}
                        </p>
                    </div>
                </div>

                {/* Housekeeping Floor Selector */}
                <div className="relative z-10 flex items-center space-x-1 bg-slate-800/90 backdrop-blur-sm p-1 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">
                        {dict.houseFloorSelect}
                    </span>
                    {['ALL', '1', '2', '3'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setHouseFloor(f)}
                            className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-lg transition ${
                                houseFloor === f
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:text-white'
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
                        <div
                            key={room.id}
                            className={`bg-white p-4 sm:p-5 rounded-2xl shadow-soft border-2 ${cfg.border} space-y-3 hover:shadow-md transition`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-3xl font-black text-slate-800 tracking-tight">#{room.id}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {currentLang === 'es' ? 'Piso' : 'Floor'} {room.floor}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} text-white shadow-sm flex items-center gap-1.5`}>
                                    <i className={`fa-solid ${cfg.icon} text-xs`}></i>
                                    <span>{cfg.label}</span>
                                </span>
                            </div>

                            <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                                <span><i className="fa-solid fa-bed text-slate-400 mr-1"></i> {room.type}</span>
                                {cleaningMins && (
                                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        <i className="fa-solid fa-stopwatch mr-1"></i>{cleaningMins}m
                                    </span>
                                )}
                            </div>

                            {room.notes && (
                                <div className="bg-amber-50 text-amber-900 border border-amber-200 text-xs p-2.5 rounded-xl font-medium flex items-start gap-2">
                                    <i className="fa-solid fa-note-sticky text-amber-600 mt-0.5"></i>
                                    <span>{room.notes}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => onChangeStatus(room.id, 'cleaning')}
                                    disabled={room.status === 'cleaning'}
                                    className={`cursor-pointer tap-target py-3 px-3 rounded-xl text-xs font-extrabold border-2 flex items-center justify-center space-x-2 transition shadow-xs active:scale-95 ${
                                        room.status === 'cleaning'
                                            ? 'bg-amber-100 text-amber-500 border-amber-200 cursor-not-allowed opacity-60'
                                            : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                                    }`}
                                >
                                    <i className="fa-solid fa-spinner"></i>
                                    <span>{dict.cleaning}</span>
                                </button>
                                <button
                                    onClick={() => onOpenQc(room.id)}
                                    className="cursor-pointer tap-target py-3 px-3 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition active:scale-95"
                                    title="Verificar estándares de calidad"
                                >
                                    <i className="fa-solid fa-clipboard-check text-sm"></i>
                                    <span>{dict.clean}</span>
                                </button>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => onOpenEdit(room.id)}
                                    className="cursor-pointer text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-50 transition"
                                >
                                    <i className="fa-solid fa-sliders text-xs"></i>
                                    <span>{currentLang === 'es' ? 'Editar notas / otro estado' : 'Edit notes / custom status'}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
