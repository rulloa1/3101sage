import React, { useState } from 'react';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => {
                const cfg = getStatusConfig(room.status, currentLang);
                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;
                const isConfirming = confirmingCheckoutId === room.id;

                return (
                    <div 
                        key={room.id}
                        className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border ${cfg.border} overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between`}
                    >
                        <div>
                            {/* Card Header */}
                            <div className={`p-4 flex items-center justify-between border-b ${cfg.light}`}>
                                <div>
                                    <div className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                                        <span>Room {room.id}</span>
                                        {room.status === 'cleaning' && (
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                                        {room.type} • Floor {room.floor}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} text-white shadow-sm tracking-wide ${room.status === 'cleaning' ? 'pulse-live' : ''}`}>
                                    <i className={`fa-solid ${cfg.icon} mr-1.5 text-[10px]`}></i> {cfg.label}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5 space-y-2">
                                {cleaningMins && (
                                    <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/90 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-solid fa-stopwatch fa-spin text-amber-600"></i> Active Cleaning
                                        </span>
                                        <span className="font-mono">{cleaningMins} min elapsed</span>
                                    </div>
                                )}

                                {room.notes ? (
                                    <div className="text-xs bg-amber-50/90 text-amber-900 border border-amber-200/90 rounded-xl p-2.5 flex items-start gap-2 shadow-xs">
                                        <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 text-xs"></i>
                                        <span className="font-medium leading-relaxed">{room.notes}</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 italic py-1 flex items-center gap-1.5">
                                        <i className="fa-regular fa-comment-dots text-slate-300"></i>
                                        <span>No special notes</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3.5 pt-0">
                            {/* Checkout confirm inline form */}
                            {isConfirming ? (
                                <div className="pt-2 border-t border-slate-100 space-y-2">
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleCheckoutConfirm(room.id); if (e.key === 'Escape') handleCheckoutCancel(); }}
                                        placeholder="Guest name (optional)"
                                        autoFocus
                                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCheckoutConfirm(room.id)}
                                            className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-[11px]"></i>
                                            <span>Confirm Checkout</span>
                                        </button>
                                        <button
                                            onClick={handleCheckoutCancel}
                                            className="cursor-pointer px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 text-xs font-bold py-2 rounded-xl transition border border-slate-200"
                                        >
                                            <i className="fa-solid fa-xmark text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    {room.status === 'dirty' && (
                                        <button 
                                            onClick={() => onChangeStatus(room.id, 'cleaning')}
                                            className="cursor-pointer flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm shadow-amber-200"
                                        >
                                            <i className="fa-solid fa-play text-[11px]"></i> <span>Start Clean</span>
                                        </button>
                                    )}

                                    {room.status === 'cleaning' && (
                                        <button 
                                            onClick={() => onOpenQc(room.id)}
                                            className="cursor-pointer flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
                                            title="Perform 3-Point QC inspection & mark clean"
                                        >
                                            <i className="fa-solid fa-clipboard-check text-xs"></i> <span>QC & Clean</span>
                                        </button>
                                    )}

                                    {room.status === 'occupied' && (
                                        <button 
                                            onClick={() => setConfirmingCheckoutId(room.id)}
                                            className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-200"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-[11px]"></i> <span>Check Out</span>
                                        </button>
                                    )}

                                    {room.status !== 'dirty' && room.status !== 'cleaning' && room.status !== 'occupied' && (
                                        <button 
                                            onClick={() => onChangeStatus(room.id, 'dirty')}
                                            className="cursor-pointer flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-slate-600 text-xs font-bold py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
                                        >
                                            <i className="fa-solid fa-broom text-[11px]"></i> <span>Mark Dirty</span>
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => onOpenEdit(room.id)}
                                        className="cursor-pointer px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center border border-slate-200"
                                        title="Edit room details"
                                    >
                                        <i className="fa-solid fa-sliders text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
