import React, { useState } from 'react';

const CHECKS = [
    {
        key: 'bed',
        title: 'Fresh Bedding & Linens:',
        detail: 'Sheets crisp, taut, 100% hair & stain-free; pillow shams aligned.'
    },
    {
        key: 'bath',
        title: 'Bathroom Sanitized & Restocked:',
        detail: 'Mirror streak-free, toilet sanitized, fresh bath/hand towels hung.'
    },
    {
        key: 'ac',
        title: 'Thermostat & Amenities:',
        detail: 'AC tested & set to 70°F, TV remote sanitized on nightstand.'
    }
];

export default function HousekeepingQcModal({
    isOpen,
    roomId,
    room,
    onClose,
    onConfirm
}) {
    const [checks, setChecks] = useState({ bed: true, bath: true, ac: true });

    if (!isOpen || !roomId) return null;

    const allChecked = CHECKS.every(c => checks[c.key]);

    const handleCertify = () => {
        if (!allChecked) {
            alert("All 3 standards must be verified to certify this room!");
            return;
        }
        onConfirm(roomId);
        onClose();
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-shell animate-slideUp max-w-md p-6 space-y-4">
                <div className="modal-head">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-500/[0.12] text-lg text-gold-400">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">
                                QC Check: Room {roomId} {room ? `(${room.type})` : ''}
                            </h3>
                            <p className="text-[11px] font-semibold text-gold-400">3.7★ Review Defense Checklist</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="icon-close"
                        aria-label="Close QC checklist"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-2.5 text-xs">
                    <p className="text-[11px] leading-relaxed text-slate-400">
                        Verify all 3 quality standards before certifying this room as ready for incoming guests:
                    </p>

                    {CHECKS.map((check, index) => (
                        <label
                            key={check.key}
                            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 transition hover:border-gold-500/30 hover:bg-white/[0.06]"
                        >
                            <input 
                                type="checkbox" 
                                checked={checks[check.key]} 
                                onChange={(e) => setChecks(prev => ({ ...prev, [check.key]: e.target.checked }))}
                                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-emerald-500" 
                            />
                            <div>
                                <strong className="text-slate-100">{index + 1}. {check.title}</strong>
                                <p className="text-[11px] text-slate-400">{check.detail}</p>
                            </div>
                        </label>
                    ))}
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
                        type="button" 
                        onClick={handleCertify} 
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                    >
                        <i className="fa-solid fa-circle-check"></i> <span>Certify Clean & Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
