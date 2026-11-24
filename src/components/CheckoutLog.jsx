import React, { useState, useEffect } from 'react';
import { todayCheckouts, formatElapsed } from '../services/checkoutService';
import { i18n } from '../constants/i18n';

export default function CheckoutLog({ log, onClear, currentLang = 'en' }) {
    const [open, setOpen] = useState(true);
    const [, setTick] = useState(0);
    const dict = i18n[currentLang] || i18n.en;

    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(id);
    }, []);

    const entries = todayCheckouts(log).slice().reverse();

    if (entries.length === 0) return null;

    return (
        <section
            aria-label={dict.todaysCheckouts}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-slate-50"
            >
                <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-right-from-bracket text-xs text-blue-600"></i>
                    <span className="text-xs font-bold text-slate-900">{dict.todaysCheckouts}</span>
                    <span className="font-mono text-xs font-bold text-slate-400 tabular-nums">
                        ({entries.length})
                    </span>
                </div>
                <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-xs text-slate-400`}></i>
            </button>

            {open && (
                <div className="border-t border-slate-200">
                    <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
                        {entries.map(entry => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between px-4 py-2.5 transition hover:bg-slate-50/70"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-8 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs font-extrabold text-slate-900 tabular-nums">
                                        {entry.roomId}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="truncate text-xs font-semibold text-slate-900">
                                            {entry.guestName || 'Guest'}
                                        </div>
                                        <div className="truncate text-[11px] text-slate-500">
                                            {entry.roomType} &middot; {dict.floorLabel} {entry.floor}
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-3 flex flex-shrink-0 items-center gap-3">
                                    <span className="hidden items-center gap-1 text-[11px] font-semibold text-rose-700 sm:inline-flex">
                                        <i className="fa-solid fa-broom text-[10px]"></i>
                                        <span>{dict.queuedTurnover}</span>
                                    </span>
                                    <span className="font-mono text-[11px] font-medium text-slate-400 tabular-nums">
                                        {formatElapsed(entry.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {onClear && (
                        <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-4 py-2">
                            <button
                                type="button"
                                onClick={onClear}
                                className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition hover:text-rose-600"
                            >
                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                                <span>{dict.clearLog}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
