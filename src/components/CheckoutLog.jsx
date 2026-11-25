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
        <div className="overflow-hidden rounded-xl border border-ink-900/[0.08] bg-white shadow-soft">
            {/* Header row — click to collapse */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-bone-50/70"
            >
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-right-from-bracket text-[10px] text-stone-500"></i>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-800">Today's checkouts</span>
                    <span className="rounded-md border border-ink-900/[0.08] bg-bone-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-stone-600">
                        {entries.length}
                    </span>
                </div>
                <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-[10px] text-stone-500`}></i>
            </button>

            {open && (
                <div className="border-t border-ink-900/[0.06]">
                    <div className="max-h-72 divide-y divide-ink-900/[0.05] overflow-y-auto">
                        {entries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 transition hover:bg-bone-50/60">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-ink-900">
                                        <span className="font-display text-[15px] leading-none text-white">{entry.roomId}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-[11.5px] font-semibold text-ink-900">
                                            {entry.guestName || 'Guest'}
                                        </div>
                                        <div className="truncate text-[10px] font-medium text-stone-500">
                                            {entry.roomType} &middot; Floor {entry.floor}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-3 flex flex-shrink-0 items-center gap-3">
                                    <span className="hidden items-center gap-1 rounded-full border border-rose-200/80 bg-rose-50/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-700 sm:flex">
                                        <span className="h-1 w-1 rounded-full bg-rose-500"></span>
                                        <span>Queued</span>
                                    </span>
                                    <span className="text-[10px] font-medium tabular-nums text-stone-500">
                                        {formatElapsed(entry.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {onClear && (
                        <div className="flex justify-end border-t border-ink-900/[0.06] px-4 py-2">
                            <button
                                type="button"
                                onClick={onClear}
                                className="flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500 transition hover:text-rose-600"
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
