import React, { useEffect, useMemo, useState } from 'react';

const MAX_FLOOR = 60;

// Suites are numbered with the floor leading (101 → 1, 1203 → 12), which is the
// same convention the room-list importer documents.
function floorFromSuite(suite) {
    const text = String(suite);
    if (text.length < 3) return null;
    const derived = Number(text.slice(0, -2));
    return Number.isInteger(derived) && derived >= 1 && derived <= MAX_FLOOR ? derived : null;
}

export default function AddRoomModal({ isOpen, onClose, onAddRoom, existingRoomIds, existingFloors }) {
    const [roomId, setRoomId] = useState('');
    const [type, setType] = useState('2 Queen Beds');
    const [floor, setFloor] = useState('1');
    const [status, setStatus] = useState('clean');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    // A closed dialog must not reopen holding last shift's half-typed room.
    useEffect(() => {
        if (!isOpen) return;
        setRoomId('');
        setType('2 Queen Beds');
        setFloor('1');
        setStatus('clean');
        setNotes('');
        setError('');
    }, [isOpen]);

    // Offer every floor the property actually uses (an imported list can run
    // past floor 4), plus room to grow and the floor the suite number implies.
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
            setError('Enter the suite number as digits only (e.g. 106, 1203).');
            return;
        }
        const numId = Number(roomId);
        if (numId < 1) {
            setError('Suite number must be greater than zero.');
            return;
        }
        if ((existingRoomIds || []).includes(numId)) {
            setError(`Room ${numId} already exists in inventory.`);
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-black shadow-xs">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <div>
                            <h3 id="add-room-title" className="text-base font-bold text-slate-800">Add Room to Inventory</h3>
                            <p className="text-[11px] text-slate-400 font-semibold">3101 Sage Rd Room Catalog</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        aria-label="Close add room dialog"
                        className="cursor-pointer w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    {error && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="add-room-suite" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Room #
                            </label>
                            <input 
                                id="add-room-suite"
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                placeholder="e.g. 106"
                                value={roomId}
                                onChange={handleRoomIdChange}
                                className="w-full text-sm font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="add-room-floor" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Floor
                            </label>
                            <select 
                                id="add-room-floor"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {floorOptions.map((option) => (
                                    <option key={option} value={option}>Floor {option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="add-room-type" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Bed Layout / Room Category
                        </label>
                        <select 
                            id="add-room-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="2 Queen Beds">2 Queen Beds (Kitchenette Suite)</option>
                            <option value="Queen Bed">Queen Bed (Studio Suite)</option>
                            <option value="Full bed with Twin">Full bed with Twin (Family Suite)</option>
                            <option value="King Suite">King Suite (Executive)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="add-room-status" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Initial Turnover Status
                        </label>
                        <select 
                            id="add-room-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="clean">Clean (Ready for Check-In)</option>
                            <option value="dirty">Dirty (Turnover Needed)</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="dnd">DND (Do Not Disturb)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="add-room-notes" className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Notes / Assigned Handyman (Optional)
                        </label>
                        <input 
                            id="add-room-notes"
                            type="text"
                            placeholder="e.g. VIP arrival, Extra pillows, etc."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="cursor-pointer px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add Room</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
