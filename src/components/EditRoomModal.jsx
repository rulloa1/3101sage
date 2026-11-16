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

    const dispatchHandyman = (channel) => {
        const issueText = notes.trim() || room.notes || "Urgent maintenance issue reported";
        setPendingStatus('maintenance');
        if (!notes.includes('Handyman Alerted')) {
            setNotes((prev) => `${prev ? prev + ' ' : ''}(Handyman Alerted)`.trim());
        }

        const messageText = `[URGENT REPAIR] 3101 Sage Rd\nRoom: ${room.id} (${room.type}, Floor ${room.floor})\nIssue: ${issueText}\nPlease report to Front Desk upon arrival.`;
        const encoded = encodeURIComponent(messageText);

        if (channel === 'whatsapp') {
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        } else {
            window.location.href = `sms:?&body=${encoded}`;
        }
    };

    const chip = "cursor-pointer text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition";

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-shell animate-slideUp max-w-md p-6 space-y-4">
                <div className="modal-head">
                    <div>
                        <h3 className="text-base font-bold text-white">
                            Room {room.id} ({room.type})
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-400">
                            Floor {room.floor} <span className="text-slate-600">•</span> Current: <span className="text-gold-400">{room.status.toUpperCase()}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="icon-close"
                        aria-label="Close room editor"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Status Selection Buttons */}
                <div>
                    <label className="eyebrow mb-2 block">
                        Change Status
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
                                    aria-pressed={isActive}
                                    className={`flex cursor-pointer items-center justify-center space-x-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                                        isActive 
                                            ? `${cfg.bg} border-transparent text-white shadow-lg` 
                                            : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                                    }`}
                                >
                                    <i className={`fa-solid ${cfg.icon}`}></i>
                                    <span>{cfg.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Room Notes Input & Chips */}
                <div>
                    <label className="eyebrow mb-1.5 block">
                        Room Notes / Issue
                    </label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Extra towels, AC check..."
                        className="field"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => appendNoteChip('Late Checkout 1PM')} className={`${chip} border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.10] hover:text-white`}>+ Late Checkout</button>
                        <button type="button" onClick={() => appendNoteChip('Extra Towels Needed')} className={`${chip} border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.10] hover:text-white`}>+ Towels</button>
                        <button type="button" onClick={() => appendNoteChip('Check AC Unit')} className={`${chip} border-rose-500/30 bg-rose-500/[0.10] text-rose-300 hover:bg-rose-500/[0.18]`}>+ AC Issue</button>
                        <button type="button" onClick={() => appendNoteChip('VIP Arrival')} className={`${chip} border-gold-500/30 bg-gold-500/[0.10] text-gold-300 hover:bg-gold-500/[0.18]`}>+ VIP</button>
                        <button type="button" onClick={() => appendNoteChip('DND on Door')} className={`${chip} border-purple-500/30 bg-purple-500/[0.10] text-purple-300 hover:bg-purple-500/[0.18]`}>+ DND</button>
                    </div>
                </div>

                {/* 1-Tap Handyman Maintenance Dispatch */}
                <div className="space-y-2 rounded-2xl border border-gold-500/25 bg-gold-500/[0.07] p-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-gold-300">
                            <i className="fa-solid fa-screwdriver-wrench text-gold-400"></i>
                            <span>Dispatch Handyman</span>
                        </span>
                        <span className="rounded-md bg-gold-500/[0.14] px-2 py-0.5 text-[10px] font-semibold text-gold-300">Instant Alert</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('whatsapp')} 
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-95"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i> <span>WhatsApp Handyman</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('sms')} 
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-2.5 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/[0.12] active:scale-95"
                        >
                            <i className="fa-solid fa-comment-sms text-xs text-brand-400"></i> <span>SMS Dispatch</span>
                        </button>
                    </div>
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
                        onClick={handleSave} 
                        className="btn-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
