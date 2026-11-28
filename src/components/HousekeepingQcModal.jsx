import React, { useState, useEffect } from 'react';

export default function HousekeepingQcModal({
    isOpen,
    roomId,
    room,
    onClose,
    onConfirm
}) {
    const [checkBed, setCheckBed] = useState(false);
    const [checkBath, setCheckBath] = useState(false);
    const [checkAc, setCheckAc] = useState(false);

    // Reset the inspection each time the dialog opens for a room.
    useEffect(() => {
        if (isOpen) {
            setCheckBed(false);
            setCheckBath(false);
            setCheckAc(false);
        }
    }, [isOpen, roomId]);

    if (!isOpen || !roomId) return null;

    const completed = [checkBed, checkBath, checkAc].filter(Boolean).length;
    const allChecked = completed === 3;

    const handleCertify = () => {
        if (!allChecked) return;
        onConfirm(roomId);
        onClose();
    };

    const checks = [
        {
            id: 'bed',
            checked: checkBed,
            onChange: setCheckBed,
            title: 'Fresh bedding & linens',
            detail: 'Sheets crisp, taut, 100% hair & stain-free; pillow shams aligned.'
        },
        {
            id: 'bath',
            checked: checkBath,
            onChange: setCheckBath,
            title: 'Bathroom sanitized & restocked',
            detail: 'Mirror streak-free, toilet sanitized, fresh bath/hand towels hung.'
        },
        {
            id: 'ac',
            checked: checkAc,
            onChange: setCheckAc,
            title: 'Thermostat & amenities',
            detail: 'AC tested & set to 70°F, TV remote sanitized on nightstand.'
        }
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qc-modal-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#141924] p-6 text-white shadow-2xl">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/30 text-lg text-amber-400">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                                QC Check &middot; 3.7&#9733; review defense
                            </p>
                            <h3 id="qc-modal-title" className="mt-1 font-display text-[21px] leading-none text-white">
                                Room {roomId}
                                {room && (
                                    <span className="ml-2 font-sans text-[12px] font-medium tracking-normal text-stone-400">
                                        {room.type}
                                    </span>
                                )}
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close QC inspection"
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] leading-relaxed text-stone-400">
                            Verify all three standards before certifying this room as ready.
                        </p>
                        <span className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            allChecked
                                ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                                : 'border-white/10 bg-[#171c2b] text-stone-400'
                        }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${allChecked ? 'bg-emerald-400' : 'bg-stone-500'}`}></span>
                            {completed}/3 verified
                        </span>
                    </div>

                    {checks.map((check, index) => (
                        <label
                            key={check.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                                check.checked
                                    ? 'border-emerald-500/40 bg-emerald-500/10'
                                    : 'border-white/10 bg-[#171c2b] hover:border-amber-400/40 hover:bg-[#1b2234]'
                            }`}
                        >
                            <span className="mt-0.5 font-display text-[13px] leading-none text-amber-400 tabular-nums">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <input
                                type="checkbox"
                                checked={check.checked}
                                onChange={(e) => check.onChange(e.target.checked)}
                                aria-label={check.title}
                                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-amber-400"
                            />
                            <div>
                                <strong className={`text-[12px] font-semibold ${check.checked ? 'text-emerald-300' : 'text-stone-200'}`}>
                                    {check.title}
                                </strong>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-400">{check.detail}</p>
                            </div>
                        </label>
                    ))}

                    {!allChecked && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                            All three standards must be verified to certify this room
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-white/10 bg-[#1b2230] px-4 py-2 text-[11px] font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCertify}
                        disabled={!allChecked}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] px-4 py-2 text-[11px] font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <i className="fa-solid fa-circle-check"></i> <span>Certify Clean &amp; Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
