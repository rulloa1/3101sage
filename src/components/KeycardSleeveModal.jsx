import React, { useState } from 'react';
import { OYO_LOGO } from '../constants/brand';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';

export default function KeycardSleeveModal({
    isOpen,
    onClose,
    rooms,
    defaultRoomId
}) {
    const [selectedRoomId, setSelectedRoomId] = useState(defaultRoomId || 101);
    const [guestName, setGuestName] = useState('');

    if (!isOpen) return null;

    // The modal stays mounted, so an imported room list can remove the room that
    // was selected last time. Fall back to the first real suite instead of a
    // blank select/print slip.
    const activeRoomId = rooms.some(r => String(r.id) === String(selectedRoomId))
        ? selectedRoomId
        : (rooms[0]?.id ?? '');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="keycard-sleeve-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-scaleIn">
                <div className="screen-only flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-black shadow-xs">
                            <i className="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <h3 id="keycard-sleeve-title" className="text-base font-bold text-slate-800">Keycard Sleeve & Wi-Fi Slip</h3>
                            <p className="text-[11px] text-slate-400 font-semibold">Direct Booking Recapture & Chargeback Defense</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close keycard sleeve"
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="screen-only grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <label htmlFor="keycard-room" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Room Number
                        </label>
                        <select
                            id="keycard-room"
                            value={activeRoomId}
                            onChange={(e) => setSelectedRoomId(parseInt(e.target.value, 10))}
                            className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2 bg-slate-50"
                        >
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>
                                    Room {r.id} ({r.type} • Floor {r.floor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="keycard-guest" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Guest Name (Optional)
                        </label>
                        <input
                            id="keycard-guest"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Valued Guest"
                            className="w-full text-xs border border-slate-200 rounded-xl p-2 bg-slate-50"
                        />
                    </div>
                </div>

                {/* PRINTABLE CARD SLEEVE PREVIEW */}
                <div id="printableSleeveArea" className="relative overflow-hidden bg-slate-900 text-white p-5 rounded-2xl border-2 border-amber-500/50 shadow-inner space-y-3 font-sans">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                        style={{ backgroundImage: `url(${hotelHeroBg})` }}
                    ></div>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2.5">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-white px-2 py-0.5 rounded shadow-xs inline-flex items-center">
                                    <img src={OYO_LOGO} alt="OYO" className="h-3.5 w-auto object-contain" />
                                </span>
                                <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wide">
                                    Houston Galleria
                                </span>
                            </div>
                            <h4 className="text-base font-black text-white leading-tight">PARC HOTEL &bull; OYO GALLERIA &bull; STELLAR STAY</h4>
                            <div className="text-[10px] text-slate-400">3101 Sage Rd, Houston, TX 77056</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Room #</div>
                            <div className="text-2xl font-black text-amber-300 font-mono">{activeRoomId}</div>
                            <div className="mt-0.5 max-w-[140px] truncate text-[10px] font-semibold text-slate-300" title={guestName || 'Valued Guest'}>
                                {guestName.trim() || 'Valued Guest'}
                            </div>
                        </div>
                    </div>

                    {/* Wi-Fi & Checkout */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">High-Speed Wi-Fi</span>
                            <strong className="text-white">Sage_Guest_Free</strong>
                            <div className="text-slate-400 text-[10px]">Pass: <code className="text-amber-300 font-mono">galleria3101</code></div>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Standard Checkout</span>
                            <strong className="text-white">11:00 AM</strong>
                            <div className="text-slate-400 text-[10px]">Desk Dial: <span className="text-amber-300">"0"</span></div>
                        </div>
                    </div>

                    {/* Direct Booking Incentive */}
                    <div className="bg-gradient-to-r from-amber-500/20 to-indigo-500/20 p-2.5 rounded-xl border border-amber-400/40 flex items-center justify-between text-xs">
                        <div>
                            <div className="font-extrabold text-amber-300 text-[11px]">BOOK DIRECT &bull; SAVE 10% ON NEXT STAY</div>
                            <div className="text-[10px] text-slate-300">Call Front Desk Directly: <strong>+1 (844) 266-5696</strong></div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 text-slate-900 font-bold text-base">
                            <i className="fa-solid fa-qrcode text-xl"></i>
                        </div>
                    </div>

                    {/* Chargeback Shield Disclaimer */}
                    <div className="text-[9px] text-slate-400 leading-tight border-t border-slate-800/80 pt-2 font-mono">
                        *BILLING NOTICE: Credit card charges for your stay at 3101 Sage Rd will appear as <strong>"PARC HOTEL / STELLAR STAY / OYO 90631"</strong>. Verified by guest signature at check-in.
                    </div>
                </div>

                <div className="screen-only flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="cursor-pointer px-4.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-print"></i> <span>Print Keycard Sleeve Slip</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
