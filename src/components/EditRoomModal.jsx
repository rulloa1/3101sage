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

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-scaleIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">
                            Room {room.id} ({room.type})
                        </h3>
                        <p className="text-[11px] text-slate-400 font-semibold">
                            Floor {room.floor} • Current: {room.status.toUpperCase()}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Status Selection Buttons */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                                            ? `${cfg.bg} text-white border-transparent shadow` 
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
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
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Room Notes / Issue
                    </label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Extra towels, AC check..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => appendNoteChip('Late Checkout 1PM')} className="cursor-pointer text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border hover:bg-slate-200 transition">+ Late Checkout</button>
                        <button type="button" onClick={() => appendNoteChip('Extra Towels Needed')} className="cursor-pointer text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border hover:bg-slate-200 transition">+ Towels</button>
                        <button type="button" onClick={() => appendNoteChip('Check AC Unit')} className="cursor-pointer text-[11px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition">+ AC Issue</button>
                        <button type="button" onClick={() => appendNoteChip('VIP Arrival')} className="cursor-pointer text-[11px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition">+ VIP</button>
                        <button type="button" onClick={() => appendNoteChip('DND on Door')} className="cursor-pointer text-[11px] font-semibold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition">+ DND</button>
                    </div>
                </div>

                {/* 1-Tap Handyman Maintenance Dispatch */}
                <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/90 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                            <i className="fa-solid fa-screwdriver-wrench text-amber-600"></i>
                            <span>Dispatch Handyman</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-md">Instant Alert</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('whatsapp')} 
                            className="cursor-pointer text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i> <span>WhatsApp Handyman</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => dispatchHandyman('sms')} 
                            className="cursor-pointer text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                        >
                            <i className="fa-solid fa-comment-sms text-indigo-600 text-xs"></i> <span>SMS Dispatch</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="cursor-pointer px-4.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
