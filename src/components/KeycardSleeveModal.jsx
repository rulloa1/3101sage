import React, { useState } from 'react';
import oyoLogo from '../assets/oyo-logo.png';
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-shell animate-slideUp max-w-lg p-6 space-y-4">
                <div className="modal-head">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-500/[0.12] text-lg text-gold-400">
                            <i className="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Keycard Sleeve & Wi-Fi Slip</h3>
                            <p className="text-[11px] font-semibold text-slate-400">Direct Booking Recapture & Chargeback Defense</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="icon-close"
                        aria-label="Close keycard sleeve"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <label className="eyebrow mb-1 block">
                            Room Number
                        </label>
                        <select 
                            value={selectedRoomId} 
                            onChange={(e) => setSelectedRoomId(parseInt(e.target.value, 10))}
                            className="field cursor-pointer font-bold"
                        >
                            {rooms.map(r => (
                                <option key={r.id} value={r.id} className="bg-ink-800 text-slate-100">
                                    Room {r.id} ({r.type} • Floor {r.floor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="eyebrow mb-1 block">
                            Guest Name (Optional)
                        </label>
                        <input 
                            type="text" 
                            value={guestName} 
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Valued Guest" 
                            className="field" 
                        />
                    </div>
                </div>

                {/* PRINTABLE CARD SLEEVE PREVIEW */}
                <div id="printableSleeveArea" className="relative space-y-3 overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-ink-900 p-5 font-sans text-white shadow-inner">
                    <div 
                        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: `url(${hotelHeroBg})` }}
                    ></div>
                    <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center rounded bg-white px-2 py-0.5 shadow-xs">
                                    <img src={oyoLogo} alt="OYO" className="h-3.5 w-auto object-contain" />
                                </span>
                                <span className="font-mono text-[10px] font-extrabold uppercase tracking-wide text-gold-400">
                                    Houston Galleria
                                </span>
                            </div>
                            <h4 className="text-base font-black leading-tight text-white">PARC HOTEL &bull; OYO GALLERIA &bull; STELLAR STAY</h4>
                            <div className="text-[10px] text-slate-400">3101 Sage Rd, Houston, TX 77056</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold uppercase text-slate-400">Room #</div>
                            <div className="font-mono text-2xl font-black text-gold-300">{selectedRoomId}</div>
                        </div>
                    </div>

                    {/* Wi-Fi & Checkout */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-ink-950 p-2.5 text-[11px]">
                        <div>
                            <span className="block text-[9px] font-bold uppercase text-slate-400">High-Speed Wi-Fi</span>
                            <strong className="text-white">Sage_Guest_Free</strong>
                            <div className="text-[10px] text-slate-400">Pass: <code className="font-mono text-gold-300">galleria3101</code></div>
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold uppercase text-slate-400">Standard Checkout</span>
                            <strong className="text-white">11:00 AM</strong>
                            <div className="text-[10px] text-slate-400">Desk Dial: <span className="text-gold-300">"0"</span></div>
                        </div>
                    </div>

                    {/* Direct Booking Incentive */}
                    <div className="flex items-center justify-between rounded-xl border border-gold-500/30 bg-gradient-to-r from-gold-500/[0.18] to-brand-600/[0.12] p-2.5 text-xs">
                        <div>
                            <div className="text-[11px] font-extrabold text-gold-300">BOOK DIRECT &bull; SAVE 10% ON NEXT STAY</div>
                            <div className="text-[10px] text-slate-300">Call Front Desk Directly: <strong>+1 (844) 266-5696</strong></div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 text-base font-bold text-slate-900">
                            <i className="fa-solid fa-qrcode text-xl"></i>
                        </div>
                    </div>

                    {/* Chargeback Shield Disclaimer */}
                    <div className="border-t border-white/10 pt-2 font-mono text-[9px] leading-tight text-slate-400">
                        *BILLING NOTICE: Credit card charges for your stay at 3101 Sage Rd will appear as <strong className="text-slate-200">"PARC HOTEL / STELLAR STAY / OYO 90631"</strong>. Verified by guest signature at check-in.
                    </div>
                </div>

                <div className="modal-foot">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn-quiet"
                    >
                        Close
                    </button>
                    <button 
                        type="button" 
                        onClick={handlePrint} 
                        className="btn-primary"
                    >
                        <i className="fa-solid fa-print"></i> <span>Print Keycard Sleeve Slip</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
