import React, { useMemo, useState } from 'react';
import { getStatusConfig, i18n } from '../constants/i18n';

function getCleaningMinutes(startedAt) {
    if (!startedAt) return null;
    const elapsedMs = Date.now() - startedAt;
    return Math.max(1, Math.floor(elapsedMs / 60000));
}

const PRIORITY_RANK = {
    cleaning: 0,
    dirty: 1,
    maintenance: 2,
    dnd: 3,
    occupied: 4,
    clean: 5
};

export default function HousekeepingView({
    rooms,
    currentLang,
    onChangeStatus,
    onOpenQc,
    onOpenEdit,
    onCheckout
}) {
    const [houseFloor, setHouseFloor] = useState('ALL');
    const [queueMode, setQueueMode] = useState('action'); // 'action' | 'all'
    const dict = i18n[currentLang] || i18n.en;

    const floors = useMemo(
        () => Array.from(new Set(rooms.map(r => String(r.floor)))).sort((a, b) => Number(a) - Number(b)),
        [rooms]
    );

    const floorRooms = useMemo(
        () => rooms.filter(r => houseFloor === 'ALL' || String(r.floor) === String(houseFloor)),
        [rooms, houseFloor]
    );

    const pendingCount = useMemo(
        () => floorRooms.filter(r => r.status === 'dirty' || r.status === 'cleaning').length,
        [floorRooms]
    );

    const visibleRooms = useMemo(() => {
        const subset = queueMode === 'action'
            ? floorRooms.filter(r => r.status === 'dirty' || r.status === 'cleaning')
            : floorRooms;

        return [...subset].sort((a, b) => {
            const rankDiff = (PRIORITY_RANK[a.status] ?? 9) - (PRIORITY_RANK[b.status] ?? 9);
            if (rankDiff !== 0) return rankDiff;
            return a.id - b.id;
        });
    }, [floorRooms, queueMode]);

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {/* Housekeeping Queue Controls */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            {currentLang === 'es' ? 'Cola de Limpieza' : 'Housekeeping Turnover Queue'}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                            {pendingCount} {dict.pendingTurnover}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Action Needed vs All Suites */}
                        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5">
                            <button
                                type="button"
                                aria-pressed={queueMode === 'action'}
                                onClick={() => setQueueMode('action')}
                                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                                    queueMode === 'action'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {dict.actionNeeded} ({pendingCount})
                            </button>
                            <button
                                type="button"
                                aria-pressed={queueMode === 'all'}
                                onClick={() => setQueueMode('all')}
                                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                                    queueMode === 'all'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {dict.allRoomsFilter} ({floorRooms.length})
                            </button>
                        </div>

                        {/* Floor Selector */}
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5">
                            {['ALL', ...floors].map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    aria-pressed={houseFloor === f}
                                    onClick={() => setHouseFloor(f)}
                                    className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                                        houseFloor === f
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {f === 'ALL'
                                        ? (currentLang === 'es' ? 'Todos' : 'All')
                                        : `${dict.houseFloorSelect} ${f}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Turnover Cards */}
            <div className="space-y-3">
                {visibleRooms.map((room) => {
                    const cfg = getStatusConfig(room.status, currentLang);
                    const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;

                    return (
                        <article
                            key={room.id}
                            className={`overflow-hidden rounded-xl border bg-white ${cfg.border}`}
                        >
                            <span className={`block h-0.5 w-full ${cfg.bar}`} aria-hidden="true"></span>

                            <div className="space-y-3 p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-baseline gap-2.5">
                                            <span className="font-mono text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                                                #{room.id}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">
                                                {dict.floorLabel} {room.floor}
                                                {room.wing ? ` · ${room.wing}` : ''}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs font-medium text-slate-600">{room.type}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${cfg.softBg} ${cfg.softBorder} ${cfg.softText}`}
                                        >
                                            <i className={`fa-solid ${cfg.icon} text-[10px]`}></i>
                                            <span>{cfg.label}</span>
                                        </span>
                                        {cleaningMins && (
                                            <span className="font-mono text-xs font-bold text-amber-700 tabular-nums">
                                                <i className="fa-regular fa-clock mr-1"></i>
                                                {cleaningMins} min
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {room.notes && (
                                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-medium text-amber-950">
                                        <i className="fa-regular fa-note-sticky mt-0.5 text-amber-600"></i>
                                        <span>{room.notes}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {room.status === 'occupied' ? (
                                        <button
                                            type="button"
                                            onClick={() => onCheckout(room.id, '')}
                                            className="tap-target col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-sm"></i>
                                            <span>
                                                {currentLang === 'es'
                                                    ? 'Check-Out / Marcar Sucia'
                                                    : 'Check Out & Queue Turnover'}
                                            </span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onChangeStatus(room.id, 'cleaning')}
                                                disabled={room.status === 'cleaning'}
                                                className={`tap-target flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition active:scale-[0.99] ${
                                                    room.status === 'cleaning'
                                                        ? 'cursor-not-allowed border-amber-200 bg-amber-50 text-amber-600 opacity-70'
                                                        : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                                                }`}
                                            >
                                                <i className="fa-solid fa-play text-[11px]"></i>
                                                <span>{dict.quickActionStart}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onOpenQc(room.id)}
                                                className="tap-target flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
                                                title="Verify quality standards and mark clean"
                                            >
                                                <i className="fa-solid fa-clipboard-check text-sm"></i>
                                                <span>{dict.quickActionQc}</span>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => onOpenEdit(room.id)}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <i className="fa-solid fa-sliders text-[11px]"></i>
                                        <span>
                                            {currentLang === 'es'
                                                ? 'Editar notas / estado'
                                                : 'Edit notes / status'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}

                {visibleRooms.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <i className="fa-solid fa-circle-check mb-2 text-2xl text-emerald-500"></i>
                        <p className="text-sm font-bold text-slate-800">
                            {queueMode === 'action'
                                ? (currentLang === 'es'
                                    ? 'Sin habitaciones pendientes en este piso'
                                    : 'No suites pending turnover in this selection')
                                : (currentLang === 'es'
                                    ? 'No hay habitaciones en este piso'
                                    : 'No suites on this floor')}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                            {queueMode === 'action' && (
                                <button
                                    type="button"
                                    onClick={() => setQueueMode('all')}
                                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    {currentLang === 'es' ? 'Ver todas las suites' : 'Show all suites'}
                                </button>
                            )}
                            {houseFloor !== 'ALL' && (
                                <button
                                    type="button"
                                    onClick={() => setHouseFloor('ALL')}
                                    className="cursor-pointer rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                    {currentLang === 'es' ? 'Ver todos los pisos' : 'Show all floors'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
