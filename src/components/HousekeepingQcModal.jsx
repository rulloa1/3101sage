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
            title: '1. Fresh Bedding & Linens',
            detail: 'Sheets crisp, taut, 100% hair & stain-free; pillow shams aligned.'
        },
        {
            id: 'bath',
            checked: checkBath,
            onChange: setCheckBath,
            title: '2. Bathroom Sanitized & Restocked',
            detail: 'Mirror streak-free, toilet sanitized, fresh bath/hand towels hung.'
        },
        {
            id: 'ac',
            checked: checkAc,
            onChange: setCheckAc,
            title: '3. Thermostat & Amenities',
            detail: 'AC tested & set to 70°F, TV remote sanitized on nightstand.'
        }
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qc-modal-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-black text-indigo-600 shadow-xs">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h3 id="qc-modal-title" className="text-base font-bold text-slate-800">
                                QC Check: Room {roomId} {room ? `(${room.type})` : ''}
                            </h3>
                            <p className="text-[11px] font-semibold text-indigo-600">3.7★ Review Defense Checklist</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close QC inspection"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] leading-relaxed text-slate-500">
                            Verify all 3 standards before certifying this room as ready:
                        </p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            allChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {completed}/3 verified
                        </span>
                    </div>

                    {checks.map((check) => (
                        <label
                            key={check.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                                check.checked
                                    ? 'border-emerald-200 bg-emerald-50/70'
                                    : 'border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={check.checked}
                                onChange={(e) => check.onChange(e.target.checked)}
                                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-emerald-600"
                            />
                            <div>
                                <strong className={check.checked ? 'text-emerald-900' : 'text-slate-800'}>{check.title}:</strong>
                                <p className="text-[11px] text-slate-500">{check.detail}</p>
                            </div>
                        </label>
                    ))}

                    {!allChecked && (
                        <p className="text-[11px] font-semibold text-slate-400">
                            All three standards must be verified to certify this room.
                        </p>
                    )}
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
                        type="button"
                        onClick={handleCertify}
                        disabled={!allChecked}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <i className="fa-solid fa-circle-check"></i> <span>Certify Clean &amp; Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
