import React, { useState } from 'react';

export default function HousekeepingQcModal({
    isOpen,
    roomId,
    room,
    onClose,
    onConfirm
}) {
    const [checkBed, setCheckBed] = useState(true);
    const [checkBath, setCheckBath] = useState(true);
    const [checkAc, setCheckAc] = useState(true);

    if (!isOpen || !roomId) return null;

    const handleCertify = () => {
        if (!checkBed || !checkBath || !checkAc) {
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
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-black shadow-xs">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                QC Check: Room {roomId} {room ? `(${room.type})` : ''}
                            </h3>
                            <p className="text-[11px] text-indigo-600 font-semibold">3.7★ Review Defense Checklist</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                        Verify all 3 quality standards before certifying this room as ready for incoming guests:
                    </p>

                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition">
                        <input 
                            type="checkbox" 
                            checked={checkBed} 
                            onChange={(e) => setCheckBed(e.target.checked)} 
                            className="mt-0.5 w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer" 
                        />
                        <div>
                            <strong className="text-slate-800">1. Fresh Bedding & Linens:</strong>
                            <p className="text-[11px] text-slate-500">Sheets crisp, taut, 100% hair & stain-free; pillow shams aligned.</p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition">
                        <input 
                            type="checkbox" 
                            checked={checkBath} 
                            onChange={(e) => setCheckBath(e.target.checked)} 
                            className="mt-0.5 w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer" 
                        />
                        <div>
                            <strong className="text-slate-800">2. Bathroom Sanitized & Restocked:</strong>
                            <p className="text-[11px] text-slate-500">Mirror streak-free, toilet sanitized, fresh bath/hand towels hung.</p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition">
                        <input 
                            type="checkbox" 
                            checked={checkAc} 
                            onChange={(e) => setCheckAc(e.target.checked)} 
                            className="mt-0.5 w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer" 
                        />
                        <div>
                            <strong className="text-slate-800">3. Thermostat & Amenities:</strong>
                            <p className="text-[11px] text-slate-500">AC tested & set to 70°F, TV remote sanitized on nightstand.</p>
                        </div>
                    </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleCertify} 
                        className="cursor-pointer px-4.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-circle-check"></i> <span>Certify Clean & Ready</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
