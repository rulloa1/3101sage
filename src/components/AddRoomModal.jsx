import React, { useEffect, useMemo, useState } from 'react';

const MAX_FLOOR = 60;

function floorFromSuite(suite) {
    const text = String(suite);
    if (text.length < 3) return null;
    const derived = Number(text.slice(0, -2));
    return Number.isInteger(derived) && derived >= 1 && derived <= MAX_FLOOR ? derived : null;
}

export default function AddRoomModal({ isOpen, onClose, onAddRoom, existingRoomIds, existingFloors }) {
    const [roomId, setRoomId] = useState('');
    const [type, setType] = useState('1BR Queen Suite');
    const [floor, setFloor] = useState('1');
    const [wing, setWing] = useState('North Wing');
    const [status, setStatus] = useState('clean');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setRoomId('');
        setType('1BR Queen Suite');
        setFloor('1');
        setWing('North Wing');
        setStatus('clean');
        setNotes('');
        setError('');
    }, [isOpen]);

    const floorOptions = useMemo(() => {
        const floors = new Set([1, 2, 3, 4]);
        (existingFloors || []).forEach((value) => {
            const parsed = Number(value);
            if (Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_FLOOR) floors.add(parsed);
        });
        const implied = floorFromSuite(roomId);
        if (implied) floors.add(implied);
        const current = Number(floor);
        if (Number.isInteger(current) && current >= 1 && current <= MAX_FLOOR) floors.add(current);
        return [...floors].sort((a, b) => a - b);
    }, [existingFloors, roomId, floor]);

    if (!isOpen) return null;

    const handleRoomIdChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setRoomId(val);
        setError('');
        const implied = floorFromSuite(val);
        if (implied) setFloor(String(implied));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!/^\d{1,5}$/.test(roomId)) {
            setError('Enter the suite number as digits only (e.g. 116, 216).');
            return;
        }
        const numId = Number(roomId);
        if (numId < 1) {
            setError('Suite number must be greater than zero.');
            return;
        }
        if ((existingRoomIds || []).includes(numId)) {
            setError(`Suite ${numId} already exists in inventory.`);
            return;
        }

        const numFloor = Number(floor);
        if (!Number.isInteger(numFloor) || numFloor < 1 || numFloor > MAX_FLOOR) {
            setError(`Floor must be a whole number between 1 and ${MAX_FLOOR}.`);
            return;
        }

        onAddRoom({
            id: numId,
            floor: numFloor,
            wing: wing.trim(),
            type,
            status,
            notes: notes.trim(),
            cleaningStartedAt: null
        });

        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-room-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 id="add-room-title" className="text-base font-bold text-slate-900">
                            Add Suite to Inventory
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">3101 Sage Rd Suite Catalog</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close add suite dialog"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="add-room-suite" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Suite #
                            </label>
                            <input
                                id="add-room-suite"
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                placeholder="e.g. 116"
                                value={roomId}
                                onChange={handleRoomIdChange}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="add-room-floor" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Floor
                            </label>
                            <select
                                id="add-room-floor"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                            >
                                {floorOptions.map((option) => (
                                    <option key={option} value={option}>Floor {option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="add-room-wing" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Wing (Optional)
                            </label>
                            <input
                                id="add-room-wing"
                                type="text"
                                list="wing-suggestions"
                                value={wing}
                                onChange={(e) => setWing(e.target.value)}
                                placeholder="North Wing"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                            />
                            <datalist id="wing-suggestions">
                                <option value="North Wing" />
                                <option value="West Wing" />
                                <option value="South Wing" />
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="add-room-status" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Initial Status
                            </label>
                            <select
                                id="add-room-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                            >
                                <option value="clean">Clean / Ready</option>
                                <option value="dirty">Dirty / Vacant</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="dnd">Do Not Disturb</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="add-room-type" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Suite Category
                        </label>
                        <select
                            id="add-room-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                        >
                            <option value="1BR Queen Suite">1BR Queen Suite (Full Kitchen)</option>
                            <option value="2-Queen Suite">2-Queen Suite (Kitchenette)</option>
                            <option value="2BR 2-Queen Suite">2BR 2-Queen Suite (Family)</option>
                            <option value="Studio Queen Suite">Studio Queen Suite</option>
                            <option value="Accessible Queen Suite">Accessible Queen Suite</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="add-room-notes" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Notes (Optional)
                        </label>
                        <input
                            id="add-room-notes"
                            type="text"
                            placeholder="e.g. VIP arrival, extra towels..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
                        />
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
                            type="submit"
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-plus text-[11px]"></i>
                            <span>Add Suite</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
