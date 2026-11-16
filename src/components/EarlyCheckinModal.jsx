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

    const tierClass = (isActive) => `cursor-pointer p-3 rounded-md border-2 font-black text-xs flex flex-col items-center transition ${
        isActive
            ? 'border-emerald-400/70 bg-emerald-50 text-emerald-700 shadow-[0_0_20px_-8px_rgba(16,185,129,0.6)]'
            : 'border-paper-300 bg-stone-900/[0.03] text-stone-700 hover:border-[#c9bda6] hover:bg-stone-900/[0.055]'
    }`;

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-stone-900/35 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-shell animate-slideUp max-w-md p-6 space-y-4">
                <div className="modal-head">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 text-lg text-emerald-600">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-ink">Early Check-In Monetizer</h3>
                            <p className="text-[11px] font-semibold text-stone-500">Immediate Non-Room Profit Generator</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="icon-close"
                        aria-label="Close early check-in"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="eyebrow mb-1 block">
                            Select Ready Clean Room
                        </label>
                        {cleanRooms.length === 0 ? (
                            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                                No clean rooms available (Turnover required before check-in)
                            </div>
                        ) : (
                            <select 
                                value={selectedRoomId || (cleanRooms[0] ? cleanRooms[0].id : '')} 
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                className="field cursor-pointer font-bold"
                            >
                                {cleanRooms.map(r => (
                                    <option key={r.id} value={r.id} className="bg-white text-stone-900">
                                        Room {r.id} ({r.type} • Floor {r.floor}) - Clean & Ready
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="eyebrow mb-1 block">
                            Early Fee Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button" 
                                onClick={() => setFee(25)} 
                                className={tierClass(fee === 25)}
                            >
                                <span>$25.00</span>
                                <span className="mt-0.5 text-[10px] font-normal text-stone-500">Standard (1 PM - 2 PM)</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFee(35)} 
                                className={tierClass(fee === 35)}
                            >
                                <span>$35.00</span>
                                <span className="mt-0.5 text-[10px] font-normal text-stone-500">Priority (Before 1 PM)</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="eyebrow mb-1 block">
                            Guest Name / Reservation #
                        </label>
                        <input 
                            type="text" 
                            value={guestName} 
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. John Doe / OYO-90631" 
                            className="field" 
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs">
                        <div>
                            <div className="font-bold text-emerald-700">Total Early Fees Collected Today</div>
                            <div className="text-[10px] text-emerald-600/70">Logged directly to front desk audit</div>
                        </div>
                        <div className="font-mono text-xl font-black text-emerald-700">
                            ${todayEarlyTotal.toFixed(2)}
                        </div>
                    </div>

                    <div className="modal-foot">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn-quiet"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={cleanRooms.length === 0}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sm transition hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                        >
                            <i className="fa-solid fa-receipt"></i> <span>Collect Fee & Issue Key</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
