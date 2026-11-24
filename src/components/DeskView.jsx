import React from 'react';
import { getStatusConfig } from '../constants/i18n';

function getCleaningMinutes(startedAt) {
    if (!startedAt) return null;
    const elapsedMs = Date.now() - startedAt;
    return Math.max(1, Math.floor(elapsedMs / 60000));
}

export default function DeskView({
    rooms,
    currentLang,
    onChangeStatus,
    onOpenQc,
    onOpenEdit
}) {
    if (rooms.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {rooms.map((room, index) => {
                const cfg = getStatusConfig(room.status, currentLang);
                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;
                const isDirty = room.status === 'dirty';
                const isCleaning = room.status === 'cleaning';

                return (
                    <article
                        key={room.id}
                        style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
                        className={`animate-cardIn group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${cfg.border}`}
                    >
                        <span className={`block h-1 w-full ${cfg.bg}`} aria-hidden="true"></span>

                        <div>
                            {/* Card Header */}
                            <div className={`flex items-start justify-between gap-2 border-b p-4 ${cfg.light}`}>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-slate-800">
                                        <span className="truncate">Room {room.id}</span>
                                        {isCleaning && (
                                            <span className="inline-block h-2 w-2 flex-shrink-0 animate-ping rounded-full bg-amber-500"></span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-1.5 py-0.5 ring-1 ring-slate-200/80">
                                            <i className="fa-solid fa-bed text-[10px] text-slate-400"></i>
                                            {room.type}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-1.5 py-0.5 ring-1 ring-slate-200/80">
                                            <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                                            Floor {room.floor}
                                        </span>
                                        {room.wing && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-1.5 py-0.5 ring-1 ring-slate-200/80">
                                                <i className="fa-solid fa-building text-[10px] text-slate-400"></i>
                                                {room.wing}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm ${cfg.bg} ${isCleaning ? 'pulse-live' : ''}`}>
                                    <i className={`fa-solid ${cfg.icon} mr-1.5 text-[10px]`}></i>
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-2 p-3.5">
                                {cleaningMins && (
                                    <div className="flex items-center justify-between rounded-xl border border-amber-200/90 bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-800">
                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-solid fa-stopwatch fa-spin text-amber-600"></i>
                                            Active cleaning
                                        </span>
                                        <span className="font-mono">{cleaningMins} min</span>
                                    </div>
                                )}

                                {room.notes ? (
                                    <div className="flex items-start gap-2 rounded-xl border border-amber-200/90 bg-amber-50/90 p-2.5 text-xs shadow-xs">
                                        <i className="fa-solid fa-triangle-exclamation mt-0.5 text-xs text-amber-600"></i>
                                        <span className="font-medium leading-relaxed text-amber-900">{room.notes}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 py-1 text-xs italic text-slate-400">
                                        <i className="fa-regular fa-comment-dots text-slate-300"></i>
                                        <span>No special notes</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="px-3.5 pb-3.5">
                            <div className="flex gap-2 border-t border-slate-100 pt-2.5">
                                {isDirty && (
                                    <button
                                        type="button"
                                        onClick={() => onChangeStatus(room.id, 'cleaning')}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-2.5 py-2 text-xs font-bold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                    >
                                        <i className="fa-solid fa-play text-[11px]"></i> <span>Start Clean</span>
                                    </button>
                                )}

                                {isCleaning && (
                                    <button
                                        type="button"
                                        onClick={() => onOpenQc(room.id)}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                        title="Perform the 3-point QC inspection and mark clean"
                                    >
                                        <i className="fa-solid fa-clipboard-check text-xs"></i> <span>QC &amp; Clean</span>
                                    </button>
                                )}

                                {!isDirty && !isCleaning && (
                                    <button
                                        type="button"
                                        onClick={() => onChangeStatus(room.id, 'dirty')}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                                    >
                                        <i className="fa-solid fa-broom text-[11px]"></i> <span>Mark Dirty</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onOpenEdit(room.id)}
                                    aria-label={`Edit room ${room.id}`}
                                    className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                                    title="Edit room details"
                                >
                                    <i className="fa-solid fa-sliders text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
