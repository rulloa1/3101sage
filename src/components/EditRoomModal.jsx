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
        // Save the maintenance status together with the alert. Leaving it as
        // pending state meant a closed dialog quietly dropped the dispatch, so
        // the room stayed sellable while the handyman was already on the way.
        const nextNotes = /handyman alerted/i.test(notes)
            ? notes
            : `${notes.trim() ? notes.trim() + ' ' : ''}(Handyman Alerted)`.trim();
        onSave(room.id, 'maintenance', nextNotes);
        onClose();

        const messageText = `[URGENT REPAIR] 3101 Sage Rd\nRoom: ${room.id} (${room.type}, Floor ${room.floor})\nIssue: ${issueText}\nPlease report to Front Desk upon arrival.`;
        const encoded = encodeURIComponent(messageText);

        if (channel === 'whatsapp') {
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        } else {
            window.location.href = `sms:?&body=${encoded}`;
        }
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="edit-room-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="max-h-[90vh] w-full max-w-md animate-scaleIn space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#141924] p-6 text-white shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                        <h3 id="edit-room-title" className="font-display text-[21px] leading-tight text-white">
                            Room {room.id} <span className="text-stone-500">&middot;</span> {room.type}
                        </h3>
                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-400">
                            Floor {room.floor} &bull; Current: {room.status.toUpperCase()}
                        </p>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        aria-label="Close room editor"
                        className="cursor-pointer w-8 h-8 rounded-lg text-stone-400 hover:text-white flex items-center justify-center transition"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Status Selection Buttons */}
                <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
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
                                    className={`cursor-pointer p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center space-x-2 transition ${
                                        isActive 
                                            ? `${cfg.bg} text-white border-transparent shadow-lg` 
                                            : 'bg-[#171c2b] text-stone-300 hover:bg-[#1f2638] border-white/10'
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
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                        Room Notes / Issue
                    </label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Extra towels, AC check..."
                        className="w-full text-xs font-medium border border-white/10 rounded-xl p-2.5 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 outline-none bg-[#171c2b] text-white placeholder-stone-500"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => appendNoteChip('Late Checkout 1PM')} className="cursor-pointer text-[11px] font-semibold bg-[#171c2b] text-stone-300 px-2 py-0.5 rounded-lg border border-white/10 hover:bg-white/10 transition">+ Late Checkout</button>
                        <button type="button" onClick={() => appendNoteChip('Extra Towels Needed')} className="cursor-pointer text-[11px] font-semibold bg-[#171c2b] text-stone-300 px-2 py-0.5 rounded-lg border border-white/10 hover:bg-white/10 transition">+ Towels</button>
                        <button type="button" onClick={() => appendNoteChip('Check AC Unit')} className="cursor-pointer text-[11px] font-semibold bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/25 transition">+ AC Issue</button>
                        <button type="button" onClick={() => appendNoteChip('VIP Arrival')} className="cursor-pointer text-[11px] font-semibold bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/25 transition">+ VIP</button>
                        <button type="button" onClick={() => appendNoteChip('DND on Door')} className="cursor-pointer text-[11px] font-semibold bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-500/30 hover:bg-purple-500/25 transition">+ DND</button>
                    </div>
                </div>

                {/* 1-Tap Handyman Maintenance Dispatch */}
                <div className="bg-[#171c2b] p-3.5 rounded-2xl border border-amber-400/20 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5">
                            <i className="fa-solid fa-screwdriver-wrench text-amber-400"></i>
                            <span>Dispatch Handyman</span>
                        </span>
                        <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">Instant Alert</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('whatsapp')} 
                            className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i> <span>WhatsApp Handyman</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('sms')} 
                            className="cursor-pointer text-xs font-bold text-stone-200 bg-[#1b2230] hover:bg-white/10 border border-white/10 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                            <i className="fa-solid fa-comment-sms text-amber-400 text-xs"></i> <span>SMS Dispatch</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="cursor-pointer px-4 py-2 text-xs font-bold text-stone-300 hover:bg-white/10 rounded-xl transition border border-white/10"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="cursor-pointer px-4.5 py-2 text-xs font-bold bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] text-slate-950 rounded-xl shadow-md transition hover:brightness-110 active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
