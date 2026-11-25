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
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-xl border border-ink-900/[0.08] bg-white p-6 shadow-panel">
                <div className="flex items-start justify-between gap-3 border-b border-ink-900/[0.07] pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bone-100 text-lg text-brass-600">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                                QC Check &middot; 3.7&#9733; review defense
                            </p>
                            <h3 id="qc-modal-title" className="mt-1 font-display text-[21px] leading-none text-ink-900">
                                Room {roomId}
                                {room && (
                                    <span className="ml-2 font-sans text-[12px] font-medium tracking-normal text-stone-500">
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
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-md text-stone-500 transition hover:bg-bone-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] leading-relaxed text-stone-500">
                            Verify all three standards before certifying this room as ready.
                        </p>
                        <span className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            allChecked
                                ? 'border-emerald-200/80 bg-emerald-50/70 text-emerald-800'
                                : 'border-ink-900/[0.08] bg-bone-50 text-stone-500'
                        }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${allChecked ? 'bg-emerald-500' : 'bg-stone-300'}`}></span>
                            {completed}/3 verified
                        </span>
                    </div>

                    {checks.map((check, index) => (
                        <label
                            key={check.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                                check.checked
                                    ? 'border-emerald-200/80 bg-emerald-50/50'
                                    : 'border-ink-900/[0.08] bg-bone-50/60 hover:border-brass-400/50 hover:bg-bone-50'
                            }`}
                        >
                            <span className="mt-0.5 font-display text-[13px] leading-none text-brass-600 tabular-nums">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <input
                                type="checkbox"
                                checked={check.checked}
                                onChange={(e) => check.onChange(e.target.checked)}
                                aria-label={check.title}
                                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/30"
                            />
                            <div>
                                <strong className={`text-[12px] font-semibold ${check.checked ? 'text-emerald-900' : 'text-ink-900'}`}>
                                    {check.title}
                                </strong>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500">{check.detail}</p>
                            </div>
                        </label>
                    ))}

                    {!allChecked && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                            All three standards must be verified to certify this room
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-ink-900/[0.07] pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-md px-3.5 py-2 text-[11px] font-semibold text-stone-500 transition hover:bg-bone-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCertify}
                        disabled={!allChecked}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ink-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-ink-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <i className="fa-solid fa-circle-check"></i> <span>Certify Clean &amp; Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
