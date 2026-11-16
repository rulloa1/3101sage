import React, { useState } from 'react';

export default function EarlyCheckinModal({
    isOpen,
    onClose,
    rooms,
    onConfirm,
    todayEarlyTotal
}) {
    const cleanRooms = rooms.filter(r => r.status === 'clean');
    const [selectedRoomId, setSelectedRoomId] = useState(cleanRooms.length > 0 ? cleanRooms[0].id : '');
    const [fee, setFee] = useState(25);
    const [guestName, setGuestName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const roomIdNum = parseInt(selectedRoomId, 10);
        if (!roomIdNum) return;
        onConfirm(roomIdNum, fee, guestName);
        setGuestName('');
        onClose();
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black shadow-xs">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Early Check-In Monetizer</h3>
                            <p className="text-[11px] text-slate-400 font-semibold">Immediate Non-Room Profit Generator</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Select Ready Clean Room
                        </label>
                        {cleanRooms.length === 0 ? (
                            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold">
                                No clean rooms available (Turnover required before check-in)
                            </div>
                        ) : (
                            <select 
                                value={selectedRoomId || (cleanRooms[0] ? cleanRooms[0].id : '')} 
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {cleanRooms.map(r => (
                                    <option key={r.id} value={r.id}>
                                        Room {r.id} ({r.type} • Floor {r.floor}) - Clean & Ready
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Early Fee Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                onClick={() => setFee(25)} 
                                className={`cursor-pointer p-3 rounded-xl border-2 font-black text-xs flex flex-col items-center transition ${
                                    fee === 25 
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs' 
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span>$25.00</span>
                                <span className="text-[10px] font-normal text-slate-500 mt-0.5">Standard (1 PM - 2 PM)</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFee(35)} 
                                className={`cursor-pointer p-3 rounded-xl border-2 font-black text-xs flex flex-col items-center transition ${
                                    fee === 35 
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs' 
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span>$35.00</span>
                                <span className="text-[10px] font-normal text-slate-500 mt-0.5">Priority (Before 1 PM)</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Guest Name / Reservation #
                        </label>
                        <input 
                            type="text" 
                            value={guestName} 
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. John Doe / OYO-90631" 
                            className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white outline-none" 
                        />
                    </div>

                    <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
                        <div>
                            <div className="font-bold text-emerald-900">Total Early Fees Collected Today</div>
                            <div className="text-[10px] text-emerald-700">Logged directly to front desk audit</div>
                        </div>
                        <div className="text-xl font-black text-emerald-800 font-mono">
                            ${todayEarlyTotal.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={cleanRooms.length === 0}
                            className="cursor-pointer px-4.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-receipt"></i> <span>Collect Fee & Issue Key</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
