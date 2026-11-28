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

    const fieldLabel = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400';
    const fieldClass = 'w-full rounded-xl border border-white/10 bg-[#171c2b] p-2.5 text-xs font-medium text-white placeholder-stone-500 outline-none transition focus:border-amber-400/50';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="keycard-sleeve-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#141924] p-6 text-white shadow-2xl">
                <div className="screen-only flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-lg text-amber-400">
                            <i className="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                                Direct booking &middot; chargeback defense
                            </p>
                            <h3 id="keycard-sleeve-title" className="mt-1 font-display text-[21px] leading-none text-white">
                                Keycard Sleeve &amp; Wi-Fi Slip
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close keycard sleeve"
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="screen-only grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label htmlFor="keycard-room" className={fieldLabel}>
                            Room Number
                        </label>
                        <select
                            id="keycard-room"
                            value={activeRoomId}
                            onChange={(e) => setSelectedRoomId(parseInt(e.target.value, 10))}
                            className={`${fieldClass} font-semibold`}
                        >
                            {rooms.map(r => (
                                <option key={r.id} value={r.id} className="bg-[#171c2b] text-white">
                                    Room {r.id} ({r.type} • Floor {r.floor})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="keycard-guest" className={fieldLabel}>
                            Guest Name (optional)
                        </label>
                        <input
                            id="keycard-guest"
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Valued Guest"
                            className={fieldClass}
                        />
                    </div>
                </div>

                {/* PRINTABLE CARD SLEEVE PREVIEW */}
                <div
                    id="printableSleeveArea"
                    className="relative space-y-3 overflow-hidden rounded-lg border border-ink-900/15 bg-bone-50 p-5 font-sans text-ink-900"
                >
                    <div
                        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.05]"
                        style={{ backgroundImage: `url(${hotelHeroBg})` }}
                    ></div>
                    <div className="relative flex items-start justify-between gap-3 border-b border-ink-900/15 pb-3">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="inline-flex items-center rounded-sm border border-ink-900/10 bg-white px-1.5 py-0.5">
                                    <img src={OYO_LOGO} alt="OYO" className="h-3.5 w-auto object-contain" />
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-700">
                                    Houston Galleria
                                </span>
                            </div>
                            <h4 className="font-display text-[19px] leading-tight text-ink-900">
                                Parc Hotel &bull; OYO Galleria &bull; Stellar Stay
                            </h4>
                            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-stone-500">
                                3101 Sage Rd, Houston, TX 77056
                            </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Room</div>
                            <div className="font-display text-[32px] leading-none tabular-nums text-ink-900">{activeRoomId}</div>
                            <div
                                className="mt-1 max-w-[120px] truncate text-[10px] font-medium text-stone-500"
                                title={guestName || 'Valued Guest'}
                            >
                                {guestName.trim() || 'Valued Guest'}
                            </div>
                        </div>
                    </div>

                    {/* Wi-Fi & Checkout */}
                    <div className="relative grid grid-cols-2 gap-3 rounded-md border border-ink-900/10 bg-white/70 p-2.5 text-[11px]">
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">High-Speed Wi-Fi</span>
                            <strong className="mt-0.5 block text-[12px] font-semibold text-ink-900">Sage_Guest_Free</strong>
                            <div className="text-[10px] text-stone-500">
                                Pass: <code className="font-mono text-brass-700">galleria3101</code>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Standard Checkout</span>
                            <strong className="mt-0.5 block text-[12px] font-semibold text-ink-900">11:00 AM</strong>
                            <div className="text-[10px] text-stone-500">
                                Desk Dial: <span className="font-semibold text-ink-900">"0"</span>
                            </div>
                        </div>
                    </div>

                    {/* Direct Booking Incentive */}
                    <div className="relative flex items-center justify-between gap-3 rounded-md border border-brass-400/50 bg-brass-500/[0.1] p-2.5">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-700">
                                Book direct &middot; save 10% on next stay
                            </div>
                            <div className="mt-1 text-[10px] text-stone-600">
                                Call Front Desk Directly: <strong className="font-semibold text-ink-900">+1 (844) 266-5696</strong>
                            </div>
                        </div>
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-ink-900/10 bg-white text-base text-ink-900">
                            <i className="fa-solid fa-qrcode text-xl"></i>
                        </div>
                    </div>

                    {/* Chargeback Shield Disclaimer */}
                    <div className="relative border-t border-ink-900/10 pt-2 font-mono text-[10px] leading-snug text-stone-500">
                        *BILLING NOTICE: Credit card charges for your stay at 3101 Sage Rd will appear as <strong className="font-semibold text-ink-900">"PARC HOTEL / STELLAR STAY / OYO 90631"</strong>. Verified by guest signature at check-in.
                    </div>
                </div>

                <div className="screen-only sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-2 rounded-b-2xl border-t border-white/10 bg-[#141924]/95 px-6 pb-4 pt-3 backdrop-blur">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-white/10 bg-[#1b2230] px-4 py-2 text-[11px] font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] px-4 py-2 text-[11px] font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.98]"
                    >
                        <i className="fa-solid fa-print"></i> <span>Print keycard sleeve</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
