import React from 'react';
import { todayCheckouts } from '../services/checkoutService';

export default function ShiftSummaryModal({
    isOpen,
    onClose,
    rooms,
    inventory,
    checkoutLog,
    todayEarlyFees,
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

    const inventoryLine = inventory?.source === 'imported'
        ? `Imported list: ${inventory.fileName || 'pasted list'} (${inventory.importedAt ? new Date(inventory.importedAt).toLocaleString() : 'unknown time'})`
        : 'WORKING MODEL — suite numbers, wing split and bed mix are placeholders';

    const checkouts = todayCheckouts(checkoutLog || []);
    const checkoutLines = checkouts.length > 0
        ? checkouts.map(c => `  • Room ${c.roomId} — ${c.guestName || 'Guest'} @ ${new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')
        : '  • None recorded';

    // Early check-in fees are tracked in the app all shift; the handoff report
    // has to show the money collected, not just the room states.
    const earlyFees = todayEarlyFees || [];
    const earlyTotal = earlyFees.reduce((sum, fee) => sum + (Number(fee.fee) || 0), 0);
    const earlyFeeLines = earlyFees.length > 0
        ? earlyFees.map(f => `  • Room ${f.roomId} — $${(Number(f.fee) || 0).toFixed(2)} — ${f.guest || 'Guest'} @ ${new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join('\n')
        : '  • None collected';

    const report = `===========================================
ROOMSYNC PRO OPERATIONAL REPORT | 3101 SAGE RD
Generated: ${new Date().toLocaleString()}
===========================================
INVENTORY SOURCE:
${inventoryLine}
-------------------------------------------
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
EARLY CHECK-IN REVENUE (${earlyFees.length}):
${earlyFeeLines}
  TOTAL COLLECTED: $${earlyTotal.toFixed(2)}
-------------------------------------------
FLAGGED ROOMS & SPECIAL NOTES:
${flaggedRooms.length > 0 ? flaggedRooms.map(r => `• Room ${r.id} (${r.status.toUpperCase()}): ${r.notes}`).join('\n') : '• None reported'}
===========================================
${inventory?.source === 'imported' ? 'Inventory: owner room list' : 'NOTE: demo inventory — not the owner\'s key list.'}`;

    const handleCopy = () => {
        const succeeded = () => {
            onCopy("Shift report copied to clipboard!", "fa-copy text-amber-400");
            onClose();
        };
        const failed = () => {
            onCopy("Unable to copy automatically — select the text to copy", "fa-triangle-exclamation text-rose-400");
        };

        // navigator.clipboard is unavailable on plain http origins, so keep a
        // textarea fallback for older browsers and non-secure contexts.
        const fallbackCopy = () => {
            try {
                const area = document.createElement('textarea');
                area.value = report;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.top = '-1000px';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(area);
                ok ? succeeded() : failed();
            } catch (e) {
                failed();
            }
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(report).then(succeeded).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="shift-summary-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn w-full max-w-lg space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 id="shift-summary-title" className="text-base font-bold text-slate-800">Operational Shift Summary (3101 Sage)</h3>
                    <button 
                        type="button"
                        onClick={onClose} 
                        aria-label="Close shift report"
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2 select-all overflow-y-auto max-h-72 whitespace-pre-wrap break-words">
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
