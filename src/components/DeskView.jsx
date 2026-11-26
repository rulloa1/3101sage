import React, { useState } from 'react';
import { getStatusConfig } from '../constants/i18n';

function getCleaningMinutes(startedAt) {
    if (!startedAt) return null;
    const elapsedMs = Date.now() - startedAt;
    return Math.max(1, Math.floor(elapsedMs / 60000));
}

const primaryAction =
    'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#1b2230] hover:bg-[#252f42] border border-white/10 px-2.5 py-2 text-[11px] font-semibold text-stone-200 transition hover:border-amber-400/40 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400';
const subtleAction =
    'flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#171c2b] px-2.5 py-2 text-[11px] font-semibold text-stone-400 transition hover:bg-white/10 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400';

export default function DeskView({
    rooms,
    currentLang,
    onChangeStatus,
    onOpenQc,
    onOpenEdit,
    onCheckout
}) {
    // Track which room is in "confirm checkout" state
    const [confirmingCheckoutId, setConfirmingCheckoutId] = useState(null);
    const [guestName, setGuestName] = useState('');

    if (rooms.length === 0) {
        return null;
    }

    const handleCheckoutConfirm = (roomId) => {
        onCheckout(roomId, guestName.trim());
        setConfirmingCheckoutId(null);
        setGuestName('');
    };

    const handleCheckoutCancel = () => {
        setConfirmingCheckoutId(null);
        setGuestName('');
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {rooms.map((room, index) => {
                const cfg = getStatusConfig(room.status, currentLang);
                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;
                const isDirty = room.status === 'dirty';
                const isCleaning = room.status === 'cleaning';
                const isConfirming = confirmingCheckoutId === room.id;

                // Dark status badge styling
                let badgeStyle = 'border border-blue-500/40 bg-blue-500/20 text-blue-300';
                if (room.status === 'clean') badgeStyle = 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300';
                if (room.status === 'dirty') badgeStyle = 'border border-red-500/40 bg-red-500/20 text-red-300';
                if (room.status === 'cleaning') badgeStyle = 'border border-amber-500/40 bg-amber-500/20 text-amber-300';
                if (room.status === 'dnd' || room.status === 'maintenance') badgeStyle = 'border border-purple-500/40 bg-purple-500/20 text-purple-300';

                return (
                    <article
                        key={room.id}
                        style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
                        className="animate-cardIn group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#141924] shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-2xl"
                    >
                        <span className={`block h-[2px] w-full ${cfg.accent}`} aria-hidden="true"></span>

                        <div>
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-3.5">
                                <div className="min-w-0">
                                    <h3 className="flex items-baseline gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                                            Suite
                                        </span>
                                        <span className="font-display text-[27px] leading-none tracking-tight text-white">
                                            {room.id}
                                        </span>
                                        {isCleaning && (
                                            <span className="inline-block h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-amber-400"></span>
                                        )}
                                    </h3>
                                    <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10.5px] font-medium text-stone-400">
                                        <span>{room.type}</span>
                                        <span className="text-stone-600" aria-hidden="true">&bull;</span>
                                        <span>Floor {room.floor}</span>
                                        {room.wing && (
                                            <>
                                                <span className="text-stone-600" aria-hidden="true">&bull;</span>
                                                <span>{room.wing}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${badgeStyle} ${isCleaning ? 'pulse-live' : ''}`}>
                                    <span className={`h-1 w-1 rounded-full ${cfg.dot}`} aria-hidden="true"></span>
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-2 border-t border-white/5 px-4 py-3">
                                {cleaningMins && (
                                    <div className="flex items-center justify-between text-[10.5px] font-medium">
                                        <span className="flex items-center gap-1.5 text-stone-400">
                                            <i className="fa-solid fa-stopwatch text-[10px] text-amber-400"></i>
                                            In progress
                                        </span>
                                        <span className="tabular-nums font-semibold text-amber-300">{cleaningMins} min</span>
                                    </div>
                                )}

                                {room.notes ? (
                                    <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 py-1 px-2.5 text-amber-200">
                                        <span className="text-[11px] font-medium leading-relaxed">{room.notes}</span>
                                    </div>
                                ) : (
                                    <p className="py-0.5 text-[10.5px] italic text-stone-500">No special notes</p>
                                )}
                            </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="px-3.5 pb-3.5">
                            {isConfirming ? (
                                <div className="space-y-2 border-t border-white/5 pt-2.5">
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCheckoutConfirm(room.id);
                                            if (e.key === 'Escape') handleCheckoutCancel();
                                        }}
                                        placeholder="Guest name (optional)"
                                        autoFocus
                                        aria-label={`Guest name for room ${room.id} checkout`}
                                        className="w-full rounded-lg border border-white/10 bg-[#171c2b] px-2.5 py-1.5 text-[11px] font-medium text-white placeholder:text-stone-500 transition focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => handleCheckoutConfirm(room.id)} className={primaryAction}>
                                            <i className="fa-solid fa-right-from-bracket text-[10px]"></i> <span>Confirm checkout</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCheckoutCancel}
                                            aria-label="Cancel checkout"
                                            className="cursor-pointer rounded-lg border border-white/10 bg-[#171c2b] px-3 py-2 text-[11px] font-semibold text-stone-400 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
                                        >
                                            <i className="fa-solid fa-xmark text-[11px]"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2 border-t border-white/5 pt-2.5">
                                    {isDirty && (
                                        <button type="button" onClick={() => onChangeStatus(room.id, 'cleaning')} className={primaryAction}>
                                            <i className="fa-solid fa-play text-[10px] text-amber-400"></i> <span>Start clean</span>
                                        </button>
                                    )}

                                    {isCleaning && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenQc(room.id)}
                                            className={primaryAction}
                                            title="Perform the 3-point QC inspection and mark clean"
                                        >
                                            <i className="fa-solid fa-clipboard-check text-[10px] text-emerald-400"></i> <span>QC &amp; clean</span>
                                        </button>
                                    )}

                                    {room.status === 'occupied' && (
                                        <button type="button" onClick={() => setConfirmingCheckoutId(room.id)} className={primaryAction}>
                                            <i className="fa-solid fa-right-from-bracket text-[10px] text-blue-400"></i> <span>Check out</span>
                                        </button>
                                    )}

                                    {!isDirty && !isCleaning && room.status !== 'occupied' && (
                                        <button
                                            type="button"
                                            onClick={() => onChangeStatus(room.id, 'dirty')}
                                            className={`${subtleAction} flex-1 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300`}
                                        >
                                            <i className="fa-solid fa-broom text-[10px]"></i> <span>Mark dirty</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onOpenEdit(room.id)}
                                        aria-label={`Edit room ${room.id}`}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-[#171c2b] px-2.5 py-2 text-[11px] font-semibold text-stone-400 transition hover:border-amber-400/40 hover:bg-white/10 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                                        title="Edit room details"
                                    >
                                        <i className="fa-solid fa-sliders text-[11px]"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
