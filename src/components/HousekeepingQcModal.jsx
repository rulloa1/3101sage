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
            detail: 'Sheets crisp, taut, hair & stain-free; pillow shams aligned.'
        },
        {
            id: 'bath',
            checked: checkBath,
            onChange: setCheckBath,
            title: '2. Bathroom Sanitized & Restocked',
            detail: 'Mirror streak-free, toilet sanitized, fresh bath and hand towels hung.'
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
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 id="qc-modal-title" className="text-base font-bold text-slate-900 tabular-nums">
                            QC Check &middot; Suite {roomId} {room ? `(${room.type})` : ''}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Three-point review defense checklist
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close QC inspection"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500">
                            Verify all three standards before certifying this suite ready:
                        </p>
                        <span className={`font-mono text-xs font-bold tabular-nums ${allChecked ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {completed}/3
                        </span>
                    </div>

                    {checks.map((check) => (
                        <label
                            key={check.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                                check.checked
                                    ? 'border-emerald-300 bg-emerald-50/70'
                                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={check.checked}
                                onChange={(e) => check.onChange(e.target.checked)}
                                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-emerald-600"
                            />
                            <div>
                                <strong className={check.checked ? 'text-emerald-950' : 'text-slate-900'}>
                                    {check.title}
                                </strong>
                                <p className="mt-0.5 text-[11px] text-slate-500">{check.detail}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCertify}
                        disabled={!allChecked}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Certify Clean &amp; Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
