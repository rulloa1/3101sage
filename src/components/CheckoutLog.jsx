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
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
            {/* Header row — click to collapse */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="cursor-pointer w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/80 transition"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <i className="fa-solid fa-right-from-bracket text-xs"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800">Today's Checkouts</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                        {entries.length}
                    </span>
                </div>
                <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-slate-400 text-xs`}></i>
            </button>

            {open && (
                <div className="border-t border-slate-100">
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {entries.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/60 transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Room badge */}
                                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                                        {entry.roomId}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-800 truncate">
                                            {entry.guestName || 'Guest'}
                                        </div>
                                        <div className="text-[11px] text-slate-400 font-medium truncate">
                                            {entry.roomType} &bull; Floor {entry.floor}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                    {/* Dirty queued badge */}
                                    <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                        <i className="fa-solid fa-broom text-[9px]"></i>
                                        <span>Queued</span>
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium tabular-nums">
                                        {formatElapsed(entry.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {onClear && (
                        <div className="px-4 py-2 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={onClear}
                                className="cursor-pointer text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
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
