import React, { useState } from 'react';
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
    // Housekeepers work the queue in urgency order; the full roster is one tap away.
    const [queueMode, setQueueMode] = useState('action');
    const dict = i18n[currentLang] || i18n.en;

    const floors = Array.from(new Set(rooms.map(r => String(r.floor)))).sort((a, b) => Number(a) - Number(b));
    const floorRooms = rooms.filter(r => houseFloor === 'ALL' || String(r.floor) === String(houseFloor));
    const pendingCount = floorRooms.filter(r => r.status === 'dirty' || r.status === 'cleaning').length;

    const queueRooms = queueMode === 'action'
        ? floorRooms.filter(r => r.status === 'dirty' || r.status === 'cleaning')
        : floorRooms;
    const visibleRooms = [...queueRooms].sort((a, b) => {
        const rankDiff = (PRIORITY_RANK[a.status] ?? 9) - (PRIORITY_RANK[b.status] ?? 9);
        return rankDiff !== 0 ? rankDiff : a.id - b.id;
    });

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {/* Housekeeping View Header with Dedicated Floor Selector */}
            <div className="rounded-xl border border-ink-900/[0.08] bg-white px-5 py-4 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                            {currentLang === 'es' ? 'Camaristas' : 'Housekeeping'}
                        </p>
                        <h2 className="mt-1 font-display text-[25px] leading-none tracking-tight text-ink-900">
                            {currentLang === 'es' ? 'Tablero de rotación' : 'Turnover board'}
                        </h2>
                        <p className="mt-1.5 text-[11px] font-medium text-stone-500">
                            {currentLang === 'es'
                                ? `${pendingCount} habitaciones pendientes en esta selección`
                                : `${pendingCount} room${pendingCount === 1 ? '' : 's'} pending in this selection`}
                        </p>
                    </div>

                    {/* Queue + Housekeeping Floor Selectors */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div
                            role="group"
                            aria-label={dict.queueFilterLabel}
                            className="flex items-center gap-0.5 rounded-lg border border-ink-900/[0.07] bg-bone-100/70 p-0.5"
                        >
                            <button
                                type="button"
                                aria-pressed={queueMode === 'action'}
                                onClick={() => setQueueMode('action')}
                                className={`cursor-pointer whitespace-nowrap rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60 ${
                                    queueMode === 'action'
                                        ? 'bg-white text-ink-900 shadow-[0_1px_2px_rgba(16,20,26,0.10)]'
                                        : 'text-stone-600 hover:text-ink-900'
                                }`}
                            >
                                {dict.actionNeeded} <span className="tabular-nums text-stone-500">{pendingCount}</span>
                            </button>
                            <button
                                type="button"
                                aria-pressed={queueMode === 'all'}
                                onClick={() => setQueueMode('all')}
                                className={`cursor-pointer whitespace-nowrap rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60 ${
                                    queueMode === 'all'
                                        ? 'bg-white text-ink-900 shadow-[0_1px_2px_rgba(16,20,26,0.10)]'
                                        : 'text-stone-600 hover:text-ink-900'
                                }`}
                            >
                                {dict.allRoomsFilter} <span className="tabular-nums text-stone-500">{floorRooms.length}</span>
                            </button>
                        </div>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                            {dict.houseFloorSelect}
                        </span>
                        <div className="flex items-center gap-0.5 rounded-lg border border-ink-900/[0.07] bg-bone-100/70 p-0.5">
                            {['ALL', ...floors].map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    aria-pressed={houseFloor === f}
                                    onClick={() => setHouseFloor(f)}
                                    className={`cursor-pointer rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60 ${
                                        houseFloor === f
                                            ? 'bg-white text-ink-900 shadow-[0_1px_2px_rgba(16,20,26,0.10)]'
                                            : 'text-stone-600 hover:text-ink-900'
                                    }`}
                                >
                                    {f === 'ALL' ? (currentLang === 'es' ? 'Todos' : 'All') : f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Turnover Cards */}
            <div className="space-y-3">
                {visibleRooms.map((room, index) => {
                    const cfg = getStatusConfig(room.status, currentLang);
                    const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;

                    return (
                        <article
                            key={room.id}
                            style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
                            className="animate-cardIn overflow-hidden rounded-xl border border-ink-900/[0.08] bg-white shadow-soft transition hover:border-ink-900/[0.14] hover:shadow-card-hover"
                        >
                            <span className={`block h-[2px] w-full ${cfg.accent}`} aria-hidden="true"></span>

                            <div className="space-y-3 px-4 py-3.5 sm:px-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-baseline gap-2.5">
                                        <span className="font-display text-[30px] leading-none tracking-tight text-ink-900">#{room.id}</span>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                                            {currentLang === 'es' ? 'Piso' : 'Floor'} {room.floor}
                                        </span>
                                        {room.wing && (
                                            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 sm:inline">
                                                · {room.wing}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${cfg.badge}`}>
                                        <span className={`h-1 w-1 rounded-full ${cfg.dot}`} aria-hidden="true"></span>
                                        <span>{cfg.label}</span>
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-ink-900/[0.06] pt-2 text-[11px] font-medium text-stone-500">
                                    <span>{room.type}</span>
                                    {cleaningMins && (
                                        <span className="flex items-center gap-1.5 text-brass-700">
                                            <i className="fa-solid fa-stopwatch text-[10px]"></i>
                                            <span className="tabular-nums font-semibold">{cleaningMins} min</span>
                                        </span>
                                    )}
                                </div>

                                {room.notes && (
                                    <div className="border-l-2 border-brass-300 py-0.5 pl-2.5">
                                        <span className="text-[11px] font-medium leading-relaxed text-stone-600">{room.notes}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 pt-0.5">
                                    {room.status === 'occupied' ? (
                                        <button
                                            type="button"
                                            onClick={() => onCheckout(room.id, '')}
                                            className="tap-target col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-ink-900 px-3 py-3 text-[11px] font-semibold text-white transition hover:bg-ink-950 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/60"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-[11px]"></i>
                                            <span>{currentLang === 'es' ? 'Check-out / marcar sucia' : 'Check out & queue turnover'}</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onChangeStatus(room.id, 'cleaning')}
                                                disabled={room.status === 'cleaning'}
                                                className={`tap-target flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-3 text-[11px] font-semibold transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/60 ${
                                                    room.status === 'cleaning'
                                                        ? 'cursor-not-allowed border-ink-900/[0.06] bg-bone-100 text-stone-500'
                                                        : 'border-ink-900/[0.1] bg-white text-stone-600 hover:border-ink-900/[0.18] hover:bg-bone-50 hover:text-ink-900'
                                                }`}
                                            >
                                                <i className="fa-solid fa-spinner text-[11px]"></i>
                                                <span>{dict.cleaning}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onOpenQc(room.id)}
                                                className="tap-target flex cursor-pointer items-center justify-center gap-2 rounded-md bg-ink-900 px-3 py-3 text-[11px] font-semibold text-white transition hover:bg-ink-950 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/60"
                                                title="Verify quality standards and mark clean"
                                            >
                                                <i className="fa-solid fa-clipboard-check text-[11px]"></i>
                                                <span>QC &amp; clean</span>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onOpenEdit(room.id)}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[10.5px] font-semibold text-stone-500 transition hover:text-ink-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-400/60"
                                    >
                                        <i className="fa-solid fa-sliders text-[10px]"></i>
                                        <span>{currentLang === 'es' ? 'Editar notas / otro estado' : 'Edit notes / custom status'}</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}

                {visibleRooms.length === 0 && (
                    <div className="rounded-xl border border-dashed border-ink-900/[0.14] bg-white p-10 text-center">
                        <i className={`fa-solid mb-2 text-xl ${queueMode === 'action' ? 'fa-circle-check text-brass-600' : 'fa-broom text-stone-300'}`}></i>
                        <p className="text-[12px] font-semibold text-stone-600">
                            {queueMode === 'action' ? dict.queueEmptyAction : dict.queueEmptyAll}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                            {queueMode === 'action' && (
                                <button
                                    type="button"
                                    onClick={() => setQueueMode('all')}
                                    className="cursor-pointer rounded-md border border-ink-900/[0.1] bg-white px-4 py-2 text-[11px] font-semibold text-ink-900 transition hover:bg-bone-50"
                                >
                                    {dict.queueShowAllRooms}
                                </button>
                            )}
                            {houseFloor !== 'ALL' && (
                                <button
                                    type="button"
                                    onClick={() => setHouseFloor('ALL')}
                                    className="cursor-pointer rounded-md border border-ink-900/[0.1] bg-white px-4 py-2 text-[11px] font-semibold text-ink-900 transition hover:bg-bone-50"
                                >
                                    {dict.queueShowAllFloors}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
