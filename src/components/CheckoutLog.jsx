import React, { useState, useEffect } from 'react';
import { todayCheckouts, formatElapsed } from '../services/checkoutService';

export default function CheckoutLog({ log, onClear }) {
    const [open, setOpen] = useState(true);
    const [, setTick] = useState(0);

    // Refresh elapsed times every 60 seconds
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(id);
    }, []);

    const entries = todayCheckouts(log).slice().reverse(); // newest first

    if (entries.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141924] shadow-xl">
            {/* Header row — click to collapse */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-white/[0.04]"
            >
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-right-from-bracket text-[11px] text-amber-400"></i>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white">Today's checkouts</span>
                    <span className="rounded-md border border-white/10 bg-[#171c2b] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-stone-300">
                        {entries.length}
                    </span>
                </div>
                <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-[10px] text-stone-400`}></i>
            </button>

            {open && (
                <div className="border-t border-white/5">
                    <div className="max-h-72 divide-y divide-white/5 overflow-y-auto">
                        {entries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 transition hover:bg-white/[0.03]">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#171c2b]">
                                        <span className="font-display text-[15px] leading-none text-white">{entry.roomId}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-[11.5px] font-semibold text-white">
                                            {entry.guestName || 'Guest'}
                                        </div>
                                        <div className="truncate text-[10px] font-medium text-stone-400">
                                            {entry.roomType} &middot; Floor {entry.floor}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-3 flex flex-shrink-0 items-center gap-3">
                                    <span className="hidden items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-300 sm:flex">
                                        <span className="h-1 w-1 rounded-full bg-rose-400"></span>
                                        <span>Queued</span>
                                    </span>
                                    <span className="text-[10px] font-medium tabular-nums text-stone-400">
                                        {formatElapsed(entry.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {onClear && (
                        <div className="flex justify-end border-t border-white/5 px-4 py-2 bg-[#0d1017]/50">
                            <button
                                type="button"
                                onClick={onClear}
                                className="flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 transition hover:text-rose-400"
                            >
                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                                <span>Clear today's log</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
