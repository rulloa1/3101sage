import React, { useState, useEffect } from 'react';

export default function EarlyCheckinModal({
    isOpen,
    onClose,
    rooms,
    onConfirm,
    todayEarlyTotal
}) {
    const cleanRooms = rooms.filter(r => r.status === 'clean');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [fee, setFee] = useState(25);
    const [guestName, setGuestName] = useState('');

    // Fresh form each time the dialog opens.
    useEffect(() => {
        if (!isOpen) return;
        setFee(25);
        setGuestName('');
        setSelectedRoomId(cleanRooms.length > 0 ? cleanRooms[0].id : '');
        // Only reset on open, not on every inventory change while typing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    // If the selected room stopped being clean, fall back to the first available one.
    const activeRoomId = cleanRooms.some(r => r.id === Number(selectedRoomId))
        ? Number(selectedRoomId)
        : (cleanRooms.length > 0 ? cleanRooms[0].id : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activeRoomId) return;
        onConfirm(activeRoomId, fee, guestName.trim());
        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="early-checkin-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-600 shadow-xs">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                        <div>
                            <h3 id="early-checkin-title" className="text-base font-bold text-slate-800">Early Check-In Monetizer</h3>
                            <p className="text-[11px] font-semibold text-slate-400">Immediate non-room profit generator</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close early check-in"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-receipt text-emerald-600"></i>
                        Collected today
                    </span>
                    <span className="font-mono text-sm">${Number(todayEarlyTotal || 0).toFixed(2)}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="early-room" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Select Ready Clean Room
                        </label>
                        {cleanRooms.length === 0 ? (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
                                No clean rooms available (turnover required before check-in)
                            </div>
                        ) : (
                            <select
                                id="early-room"
                                value={activeRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            >
                                {cleanRooms.map(r => (
                                    <option key={r.id} value={r.id}>
                                        Room {r.id} ({r.type} • Floor {r.floor}) — Clean &amp; Ready
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Early Fee Tier
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                aria-pressed={fee === 25}
                                onClick={() => setFee(25)}
                                className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-3 text-xs font-black transition active:scale-95 ${
                                    fee === 25
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span>$25.00</span>
                                <span className="mt-0.5 text-[10px] font-normal text-slate-500">Standard (1 PM – 2 PM)</span>
                            </button>
                            <button
                                type="button"
                                aria-pressed={fee === 35}
                                onClick={() => setFee(35)}
                                className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-3 text-xs font-black transition active:scale-95 ${
                                    fee === 35
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span>$35.00</span>
                                <span className="mt-0.5 text-[10px] font-normal text-slate-500">Priority (before 1 PM)</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="early-guest" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Guest Name / Reservation #
                        </label>
                        <input
                            id="early-guest"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. John Smith / #48211"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={cleanRooms.length === 0}
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <i className="fa-solid fa-receipt"></i> <span>Collect ${fee} &amp; Issue Key</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
