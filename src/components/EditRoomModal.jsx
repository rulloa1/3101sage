import React, { useState, useEffect } from 'react';
import { getStatusConfig } from '../constants/i18n';

export default function EditRoomModal({
    isOpen,
    roomId,
    room,
    onClose,
    onSave,
    currentLang
}) {
    const [pendingStatus, setPendingStatus] = useState('dirty');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (room) {
            setPendingStatus(room.status);
            setNotes(room.notes || '');
        }
    }, [room, roomId]);

    if (!isOpen || !room) return null;

    const statuses = ['dirty', 'cleaning', 'clean', 'occupied', 'dnd', 'maintenance'];

    const appendNoteChip = (text) => {
        setNotes((prev) => (prev && prev.trim() ? `${prev.trim()}, ${text}` : text));
    };

    const handleSave = () => {
        onSave(room.id, pendingStatus, notes);
        onClose();
    };

    const issueText = notes.trim() || room.notes || 'Urgent maintenance issue reported';
    const dispatchMessage = `[URGENT REPAIR] 3101 Sage Rd\nSuite: ${room.id} (${room.type}, Floor ${room.floor})\nIssue: ${issueText}\nPlease report to Front Desk upon arrival.`;
    const encodedDispatch = encodeURIComponent(dispatchMessage);

    const handleHandymanClick = () => {
        const nextNotes = /handyman alerted/i.test(notes)
            ? notes
            : `${notes.trim() ? notes.trim() + ' ' : ''}(Handyman Alerted)`.trim();
        onSave(room.id, 'maintenance', nextNotes);
        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-room-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 id="edit-room-title" className="text-base font-bold text-slate-900 tabular-nums">
                            Suite {room.id} &middot; {room.type}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Floor {room.floor}{room.wing ? ` · ${room.wing}` : ''} &middot; Current: {room.status.toUpperCase()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close suite editor"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Status Selection */}
                <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {statuses.map((s) => {
                            const cfg = getStatusConfig(s, currentLang);
                            const isActive = pendingStatus === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setPendingStatus(s)}
                                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold transition ${
                                        isActive
                                            ? `${cfg.bg} border-transparent text-white`
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <i className={`fa-solid ${cfg.icon} text-[11px]`}></i>
                                    <span>{cfg.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notes Input & Quick Tags */}
                <div>
                    <label htmlFor="edit-room-notes" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Notes / Issue
                    </label>
                    <input
                        id="edit-room-notes"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Extra towels, AC check..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {['Late Checkout 1PM', 'Extra Towels Needed', 'Check AC Unit', 'VIP Arrival', 'DND on Door'].map((chip) => (
                            <button
                                key={chip}
                                type="button"
                                onClick={() => appendNoteChip(chip)}
                                className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                + {chip}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Handyman Maintenance Dispatch */}
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-950">
                            <i className="fa-solid fa-screwdriver-wrench text-amber-600"></i>
                            <span>Dispatch Handyman</span>
                        </span>
                        <span className="text-[11px] font-medium text-amber-800">
                            Marks suite Maintenance
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <a
                            href={`https://wa.me/?text=${encodedDispatch}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleHandymanClick}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i>
                            <span>WhatsApp</span>
                        </a>
                        <a
                            href={`sms:?&body=${encodedDispatch}`}
                            onClick={handleHandymanClick}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                        >
                            <i className="fa-solid fa-comment-sms text-slate-600"></i>
                            <span>SMS Dispatch</span>
                        </a>
                    </div>
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
                        onClick={handleSave}
                        className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
