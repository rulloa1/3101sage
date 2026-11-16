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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rooms.map((room) => {
                const cfg = getStatusConfig(room.status, currentLang);
                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;

                return (
                    <article
                        key={room.id}
                        className={`panel panel-raise flex flex-col justify-between overflow-hidden border ${cfg.border}`}
                    >
                        <div>
                            {/* Card Header */}
                            <div className={`flex items-center justify-between border-b border-paper-200 p-4 ${cfg.light}`}>
                                <div>
                                    <div className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-ink">
                                        <span>Room {room.id}</span>
                                        {room.status === 'cleaning' && (
                                            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                                        )}
                                    </div>
                                    <div className="mt-0.5 text-[11px] font-semibold text-stone-500">
                                        {room.type} <span className="text-stone-400">•</span> Floor {room.floor}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm ${cfg.bg} ${room.status === 'cleaning' ? 'pulse-live' : ''}`}>
                                    <i className={`fa-solid ${cfg.icon} mr-1.5 text-[10px]`}></i> {cfg.label}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-2 p-3.5">
                                {cleaningMins && (
                                    <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-700">
                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-solid fa-stopwatch fa-spin text-amber-600"></i> Active Cleaning
                                        </span>
                                        <span className="font-mono">{cleaningMins} min elapsed</span>
                                    </div>
                                )}

                                {room.notes ? (
                                    <div className="flex items-start gap-2 rounded-md border border-gold-300 bg-gold-50 p-2.5 text-xs text-gold-600/90">
                                        <i className="fa-solid fa-triangle-exclamation mt-0.5 text-xs text-gold-600"></i>
                                        <span className="font-medium leading-relaxed text-stone-800">{room.notes}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 py-1 text-xs italic text-stone-500">
                                        <i className="fa-regular fa-comment-dots text-stone-400"></i>
                                        <span>No special notes</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3.5 pt-0">
                            <div className="flex gap-2 border-t border-paper-200 pt-2">
                                {room.status === 'dirty' && (
                                    <button
                                        onClick={() => onChangeStatus(room.id, 'cleaning')}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-amber-500 px-2.5 py-2 text-xs font-bold text-ink shadow-sm transition hover:bg-amber-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                    >
                                        <i className="fa-solid fa-play text-[11px]"></i> <span>Start Clean</span>
                                    </button>
                                )}

                                {room.status === 'cleaning' && (
                                    <button
                                        onClick={() => onOpenQc(room.id)}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                                        title="Perform 3-Point QC inspection & mark clean"
                                    >
                                        <i className="fa-solid fa-clipboard-check text-xs"></i> <span>QC & Clean</span>
                                    </button>
                                )}

                                {room.status !== 'dirty' && room.status !== 'cleaning' && (
                                    <button
                                        onClick={() => onChangeStatus(room.id, 'dirty')}
                                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-paper-300 bg-stone-900/[0.04] px-2.5 py-2 text-xs font-bold text-stone-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 active:scale-95"
                                    >
                                        <i className="fa-solid fa-broom text-[11px]"></i> <span>Mark Dirty</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => onOpenEdit(room.id)}
                                    className="flex cursor-pointer items-center justify-center rounded-md border border-paper-300 bg-stone-900/[0.04] px-3 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-900/[0.07] hover:text-ink active:scale-95"
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
