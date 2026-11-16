import React from 'react';

export default function ShiftSummaryModal({
    isOpen,
    onClose,
    rooms,
    onCopy
}) {
    if (!isOpen) return null;

    const clean = rooms.filter(r => r.status === 'clean').length;
    const inProgress = rooms.filter(r => r.status === 'cleaning').length;
    const dirty = rooms.filter(r => r.status === 'dirty').length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const maint = rooms.filter(r => r.status === 'maintenance' || r.status === 'dnd').length;
    const total = rooms.length;
    const readyPct = total > 0 ? Math.round((clean / total) * 100) : 0;
    const flaggedRooms = rooms.filter(r => r.notes && r.notes.trim().length > 0);

    const report = `===========================================
ROOMSYNC PRO OPERATIONAL REPORT | 3101 SAGE RD
Generated: ${new Date().toLocaleString()}
===========================================
Total Rooms:       ${total}
Clean & Ready:     ${clean} (${readyPct}%)
In Progress:       ${inProgress}
Dirty / Vacant:    ${dirty}
Occupied:          ${occupied}
Maintenance / DND: ${maint}
-------------------------------------------
FLAGGED ROOMS & SPECIAL NOTES:
${flaggedRooms.length > 0 ? flaggedRooms.map(r => `• Room ${r.id} (${r.status.toUpperCase()}): ${r.notes}`).join('\n') : '• None reported'}
===========================================`;

    const handleCopy = () => {
        navigator.clipboard.writeText(report).then(() => {
            onCopy("Shift report copied to clipboard!", "fa-copy text-gold-400");
            onClose();
        }).catch(() => {
            onCopy("Unable to copy automatically", "fa-triangle-exclamation text-rose-400");
        });
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
                    <div>
                        <span className="eyebrow text-gold-500">Shift Handover</span>
                        <h3 className="mt-1 text-base font-bold text-white">Operational Shift Summary (3101 Sage)</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="icon-close"
                        aria-label="Close shift summary"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="panel-inset max-h-72 select-all overflow-y-auto whitespace-pre p-4 font-mono text-[11px] leading-relaxed text-slate-300">
                    {report}
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
                        onClick={handleCopy} 
                        className="btn-primary"
                    >
                        <i className="fa-regular fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    );
}
