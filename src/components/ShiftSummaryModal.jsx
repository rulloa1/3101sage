import React from 'react';
import { todayCheckouts } from '../services/checkoutService';

export default function ShiftSummaryModal({
    isOpen,
    onClose,
    rooms,
    checkoutLog,
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

    const checkouts = todayCheckouts(checkoutLog || []);
    const checkoutLines = checkouts.length > 0
        ? checkouts.map(c => `  • Room ${c.roomId} — ${c.guestName || 'Guest'} @ ${new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')
        : '  • None recorded';

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
CHECKOUTS TODAY (${checkouts.length}):
${checkoutLines}
-------------------------------------------
FLAGGED ROOMS & SPECIAL NOTES:
${flaggedRooms.length > 0 ? flaggedRooms.map(r => `• Room ${r.id} (${r.status.toUpperCase()}): ${r.notes}`).join('\n') : '• None reported'}
===========================================`;

    const handleCopy = () => {
        navigator.clipboard.writeText(report).then(() => {
            onCopy("Shift report copied to clipboard!", "fa-copy text-amber-400");
            onClose();
        }).catch(() => {
            onCopy("Unable to copy automatically", "fa-triangle-exclamation text-rose-400");
        });
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-800">Operational Shift Summary (3101 Sage)</h3>
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2 select-all overflow-y-auto max-h-72 whitespace-pre">
                    {report}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="cursor-pointer px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        Close
                    </button>
                    <button 
                        type="button" 
                        onClick={handleCopy} 
                        className="cursor-pointer px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                    >
                        <i className="fa-regular fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>
    );
}
