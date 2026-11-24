import React, { useState, useEffect } from 'react';
import { OYO_LOGO, PROPERTY } from '../constants/brand';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';

export default function KeycardSleeveModal({
    isOpen,
    onClose,
    rooms,
    defaultRoomId
}) {
    const [selectedRoomId, setSelectedRoomId] = useState(defaultRoomId || 101);
    const [guestName, setGuestName] = useState('');

    useEffect(() => {
        if (isOpen && defaultRoomId) {
            setSelectedRoomId(defaultRoomId);
        }
    }, [isOpen, defaultRoomId]);

    if (!isOpen) return null;

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
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="screen-only flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 id="keycard-sleeve-title" className="text-base font-bold text-slate-900">
                            Keycard Sleeve &amp; Wi-Fi Slip
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Direct Booking Recapture &amp; Chargeback Defense
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close keycard sleeve"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="screen-only grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <label htmlFor="keycard-room" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Suite Number
                        </label>
                        <select
                            id="keycard-room"
                            value={activeRoomId}
                            onChange={(e) => setSelectedRoomId(parseInt(e.target.value, 10))}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                        >
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>
                                    Suite {r.id} ({r.type} · Floor {r.floor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="keycard-guest" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Guest Name (Optional)
                        </label>
                        <input
                            id="keycard-guest"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Valued Guest"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Printable Card Sleeve Preview */}
                <div
                    id="printableSleeveArea"
                    className="relative space-y-3 overflow-hidden rounded-xl border border-amber-500/40 bg-slate-950 p-5 font-sans text-white"
                >
                    <div
                        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: `url(${hotelHeroBg})` }}
                    ></div>
                    <div className="relative flex items-start justify-between border-b border-slate-800 pb-3">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center rounded bg-white px-2 py-0.5">
                                    <img src={OYO_LOGO} alt="OYO" className="h-3.5 w-auto object-contain" />
                                </span>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                    Houston Galleria
                                </span>
                            </div>
                            <h4 className="text-sm font-extrabold leading-tight text-white">
                                PARC HOTEL &middot; OYO GALLERIA &middot; STELLAR STAY
                            </h4>
                            <div className="mt-0.5 text-[10px] text-slate-400">
                                {PROPERTY.address}, {PROPERTY.city}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold uppercase text-slate-400">Suite #</div>
                            <div className="font-mono text-2xl font-extrabold text-amber-300 tabular-nums">
                                {activeRoomId}
                            </div>
                            <div
                                className="mt-0.5 max-w-[140px] truncate text-[10px] font-semibold text-slate-300"
                                title={guestName || 'Valued Guest'}
                            >
                                {guestName.trim() || 'Valued Guest'}
                            </div>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-[11px]">
                        <div>
                            <span className="block text-[9px] font-bold uppercase text-slate-400">High-Speed Wi-Fi</span>
                            <strong className="text-white">{PROPERTY.wifi}</strong>
                            <div className="text-[10px] text-slate-400">
                                Pass: <code className="font-mono text-amber-300">{PROPERTY.wifiPassword}</code>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold uppercase text-slate-400">Standard Checkout</span>
                            <strong className="text-white tabular-nums">{PROPERTY.checkOut}</strong>
                            <div className="text-[10px] text-slate-400">
                                Desk Dial: <span className="text-amber-300">&ldquo;0&rdquo;</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-between rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs">
                        <div>
                            <div className="text-[11px] font-extrabold text-amber-300">
                                BOOK DIRECT &middot; SAVE 10% ON NEXT STAY
                            </div>
                            <div className="text-[10px] text-slate-300">
                                Front Desk Direct: <strong>{PROPERTY.deskPhone}</strong>
                            </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-900">
                            <i className="fa-solid fa-qrcode text-xl"></i>
                        </div>
                    </div>

                    <div className="relative border-t border-slate-800 pt-2 font-mono text-[9px] leading-tight text-slate-400">
                        *BILLING NOTICE: Credit card charges for your stay at {PROPERTY.address} will appear as{' '}
                        <strong>&ldquo;PARC HOTEL / STELLAR STAY / OYO {PROPERTY.oyoId}&rdquo;</strong>. Verified by guest signature at check-in.
                    </div>
                </div>

                <div className="screen-only flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                    >
                        <i className="fa-solid fa-print"></i>
                        <span>Print Keycard Sleeve</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
