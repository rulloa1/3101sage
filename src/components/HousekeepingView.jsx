import React, { useState, useMemo } from 'react';
import { getStatusConfig, i18n } from '../constants/i18n';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';
import hotelNightExterior from '../assets/hotel-night-exterior.jpg';
import hotelSuite from '../assets/hotel-suite.jpg';

const DEFAULT_STAFF = {
    101: 'Maria S.',
    102: 'David K.',
    103: 'John D.',
    104: 'Unassigned',
    105: 'Sarah P.',
    106: 'Jane D.',
    107: 'John D.',
    108: 'Sarah P.',
    109: 'Maria S.',
    110: 'David K.',
    111: 'John D.',
    112: 'Jane D.',
    113: 'Sarah P.',
    114: 'Maria S.',
    115: 'David K.',
    201: 'John D.',
    202: 'Sarah P.',
    203: 'Jane D.',
    204: 'Maria S.',
    205: 'David K.',
    206: 'John D.',
    207: 'Sarah P.',
    208: 'Jane D.',
    209: 'Maria S.',
    210: 'David K.',
    211: 'John D.',
    212: 'Sarah P.',
    213: 'Jane D.',
    214: 'Maria S.',
    215: 'David K.'
};

const STAFF_POOL = ['Maria S.', 'David K.', 'John D.', 'Sarah P.', 'Jane D.'];

export default function HousekeepingView({
    rooms,
    currentLang = 'en',
    onChangeStatus,
    onOpenQc,
    onOpenEdit,
    onCheckout,
    searchFilter = ''
}) {
    const dict = i18n[currentLang] || i18n.en;

    // Filters & View State
    const [selectedFloor, setSelectedFloor] = useState('ALL');
    const [selectedWing, setSelectedWing] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [feedbackToast, setFeedbackToast] = useState(null);

    // Staff Assignments state (persisted locally)
    const [staffMap, setStaffMap] = useState(() => {
        try {
            const saved = localStorage.getItem('sage_staff_assignments');
            return saved ? JSON.parse(saved) : DEFAULT_STAFF;
        } catch (e) {
            return DEFAULT_STAFF;
        }
    });

    const triggerToast = (msg) => {
        setFeedbackToast(msg);
        setTimeout(() => setFeedbackToast(null), 2400);
    };

    // Calculate real-time counts
    const totalCount = rooms.length;
    const dirtyCount = rooms.filter(r => r.status === 'dirty').length;
    const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
    const cleanCount = rooms.filter(r => r.status === 'clean').length;
    const dndCount = rooms.filter(r => r.status === 'dnd').length;
    const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
    const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;

    // Serviced calculation (clean + inspected)
    const servicedCount = cleanCount;
    const shiftProgressPct = totalCount > 0 ? Math.round((servicedCount / totalCount) * 100) : 0;
    const staffOccupancyPct = 74; // Standard daily benchmark

    // Filtered rooms
    const filteredRooms = useMemo(() => {
        let list = rooms.filter(r => {
            const matchFloor = selectedFloor === 'ALL' || String(r.floor) === String(selectedFloor);
            const matchWing = selectedWing === 'ALL' || r.wing === selectedWing;
            const q = searchFilter.trim().toLowerCase();
            const staff = (staffMap[r.id] || '').toLowerCase();
            const matchSearch = !q ||
                String(r.id).includes(q) ||
                r.type.toLowerCase().includes(q) ||
                staff.includes(q) ||
                (r.notes && r.notes.toLowerCase().includes(q));

            return matchFloor && matchWing && matchSearch;
        });

        if (priorityFilter === 'dirty') {
            list = list.filter(r => r.status === 'dirty');
        } else if (priorityFilter === 'cleaning') {
            list = list.filter(r => r.status === 'cleaning');
        } else if (priorityFilter === 'clean') {
            list = list.filter(r => r.status === 'clean');
        } else if (priorityFilter === 'priority') {
            // Urgency order: Cleaning first, then Dirty, then Maintenance, then DND, then Clean
            const order = { cleaning: 0, dirty: 1, maintenance: 2, dnd: 3, occupied: 4, clean: 5 };
            list = [...list].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
        }

        return list;
    }, [rooms, selectedFloor, selectedWing, priorityFilter, searchFilter, staffMap]);

    // Handle Quick Action: Assign All Staff
    const handleAssignAllStaff = () => {
        const next = { ...staffMap };
        let idx = 0;
        rooms.forEach(r => {
            if (!next[r.id] || next[r.id] === 'Unassigned') {
                next[r.id] = STAFF_POOL[idx % STAFF_POOL.length];
                idx++;
            }
        });
        setStaffMap(next);
        try {
            localStorage.setItem('sage_staff_assignments', JSON.stringify(next));
        } catch (e) {}
        triggerToast('Assigned 8 on-duty staff to all pending suites.');
    };

    // Cycle staff member on tap
    const handleCycleStaff = (roomId, e) => {
        e.stopPropagation();
        const current = staffMap[roomId] || 'Unassigned';
        const currentIndex = STAFF_POOL.indexOf(current);
        const nextStaff = currentIndex === -1
            ? STAFF_POOL[0]
            : (currentIndex === STAFF_POOL.length - 1 ? 'Unassigned' : STAFF_POOL[currentIndex + 1]);

        const next = { ...staffMap, [roomId]: nextStaff };
        setStaffMap(next);
        try {
            localStorage.setItem('sage_staff_assignments', JSON.stringify(next));
        } catch (err) {}
        triggerToast(`Room ${roomId} assigned to ${nextStaff}`);
    };

    // Status Badge Render Helper matching Mockup v2
    const renderStatusBadge = (room) => {
        const status = room.status;
        const isHighPriority = room.id === 104 || room.id === 107 || room.id === 203;

        if (status === 'dirty') {
            return (
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-full border border-red-500/50 bg-red-600/30 px-2.5 py-0.5 text-[10.5px] font-bold text-red-300">
                        <i className="fa-solid fa-broom text-[10px]"></i> Dirty
                    </span>
                    {isHighPriority && (
                        <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                            <i className="fa-solid fa-triangle-exclamation text-[8px]"></i> High Priority
                        </span>
                    )}
                </div>
            );
        }

        if (status === 'cleaning') {
            return (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/25 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-300">
                    <i className="fa-solid fa-stopwatch text-[10px]"></i> In Progress
                </span>
            );
        }

        if (status === 'clean') {
            return (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/25 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-300">
                    <i className="fa-solid fa-check text-[10px]"></i> Inspected &amp; Ready
                </span>
            );
        }

        if (status === 'dnd') {
            return (
                <span className="flex items-center gap-1 rounded-full border border-purple-500/50 bg-purple-500/30 px-2.5 py-0.5 text-[10.5px] font-bold text-purple-300">
                    <i className="fa-solid fa-moon text-[10px]"></i> DND
                </span>
            );
        }

        if (status === 'maintenance') {
            return (
                <span className="flex items-center gap-1 rounded-full border border-orange-500/50 bg-orange-500/30 px-2.5 py-0.5 text-[10.5px] font-bold text-orange-300">
                    <i className="fa-solid fa-wrench text-[10px]"></i> Maintenance
                </span>
            );
        }

        // Pending inspect for 106
        if (room.id === 106) {
            return (
                <span className="flex items-center gap-1 rounded-full border border-blue-500/50 bg-blue-500/30 px-2.5 py-0.5 text-[10.5px] font-bold text-blue-300">
                    <i className="fa-solid fa-users text-[10px]"></i> Pending Inspect
                </span>
            );
        }

        return (
            <span className="flex items-center gap-1 rounded-full border border-blue-500/50 bg-blue-500/25 px-2.5 py-0.5 text-[10.5px] font-bold text-blue-300">
                <i className="fa-solid fa-user text-[10px]"></i> Occupied
            </span>
        );
    };

    // Primary Action Button Helper matching Mockup v2 exactly
    const renderActionButton = (room) => {
        const status = room.status;
        const staff = staffMap[room.id] || 'Unassigned';

        // Room 104: High Priority Dirty -> "Assign Staff"
        if (room.id === 104 || staff === 'Unassigned') {
            return (
                <button
                    type="button"
                    onClick={(e) => handleCycleStaff(room.id, e)}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-amber-400/40 bg-[#1e2433] py-2 text-center text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-user-plus text-[11px]"></i>
                    <span>Assign Staff</span>
                </button>
            );
        }

        // Room 101 or Dirty: "Start Cleaning"
        if (status === 'dirty') {
            return (
                <button
                    type="button"
                    onClick={() => onChangeStatus(room.id, 'cleaning')}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#1b2230] py-2 text-center text-xs font-semibold text-stone-200 transition hover:border-amber-400/40 hover:bg-[#252f42] hover:text-white active:scale-[0.98]"
                >
                    <i className="fa-solid fa-play text-[10px] text-amber-400"></i>
                    <span>Start Cleaning</span>
                </button>
            );
        }

        // Room 102: In Progress -> "Pause / Stop"
        if (status === 'cleaning' && room.id === 102) {
            return (
                <button
                    type="button"
                    onClick={() => onChangeStatus(room.id, 'dirty')}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#1b2230] py-2 text-center text-xs font-semibold text-stone-200 transition hover:bg-red-500/20 hover:text-red-300 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-pause text-[10px] text-stone-400"></i>
                    <span>Pause / Stop</span>
                </button>
            );
        }

        // Room 107: In Progress -> "Request Inspect"
        if (status === 'cleaning') {
            return (
                <button
                    type="button"
                    onClick={() => onChangeStatus(room.id, 'clean')}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 py-2 text-center text-xs font-bold text-amber-300 transition hover:bg-amber-500/30 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                    <span>Request Inspect</span>
                </button>
            );
        }

        // Room 106: Pending Inspect -> "Review & Pass"
        if (room.id === 106) {
            return (
                <button
                    type="button"
                    onClick={() => onChangeStatus(room.id, 'clean')}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/20 py-2 text-center text-xs font-bold text-blue-300 transition hover:bg-blue-500/30 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-square-check text-[11px]"></i>
                    <span>Review &amp; Pass</span>
                </button>
            );
        }

        // Room 103: Inspected & Ready -> "In-Service" + edit icon
        if (status === 'clean' && room.id === 103) {
            return (
                <button
                    type="button"
                    onClick={() => onOpenQc?.(room.id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-[#172322] py-2 text-center text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-arrow-right-to-bracket text-[10px]"></i>
                    <span>In-Service</span>
                    <i className="fa-solid fa-pen-to-square ml-1 text-[10px] text-amber-400/80"></i>
                </button>
            );
        }

        // Room 108 or Clean: "In-Service"
        if (status === 'clean') {
            return (
                <button
                    type="button"
                    onClick={() => onOpenQc?.(room.id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-[#172322] py-2 text-center text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-check text-[10px]"></i>
                    <span>In-Service</span>
                </button>
            );
        }

        // Room 105: DND -> "Snooze / Skip"
        if (status === 'dnd') {
            return (
                <button
                    type="button"
                    onClick={() => triggerToast(`Room ${room.id} snoozed. Checking back in 45m.`)}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-purple-500/30 bg-[#1f1a2e] py-2 text-center text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-clock text-[10px]"></i>
                    <span>Snooze / Skip</span>
                </button>
            );
        }

        return (
            <button
                type="button"
                onClick={() => onOpenEdit?.(room.id)}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#1b2230] py-2 text-center text-xs font-semibold text-stone-300 transition hover:bg-[#252f42] hover:text-white active:scale-[0.98]"
            >
                <span>View Details</span>
            </button>
        );
    };

    return (
        <div className="space-y-4 text-stone-200">
            {/* TOAST FEEDBACK NOTIFICATION */}
            {feedbackToast && (
                <div className="fixed top-16 right-6 z-50 animate-fadeIn rounded-lg border border-amber-500/40 bg-[#161c28] px-4 py-2.5 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md">
                    <i className="fa-solid fa-circle-check mr-2 text-amber-400"></i>
                    {feedbackToast}
                </div>
            )}

            {/* 1. HERO BANNER: RoomSync Pro™ Housekeeping Operations */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                {/* Background Hotel Exterior at Night (Real 3101 Sage Photography) */}
                <div
                    className="absolute inset-0 bg-cover bg-center filter brightness-[0.75] contrast-[1.1]"
                    style={{ backgroundImage: `url(${hotelNightExterior})` }}
                ></div>
                {/* Dark Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/85 to-transparent"></div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                RoomSync Pro<sup className="text-xs font-sans text-stone-400">™</sup>
                            </span>
                        </div>
                        <h1 className="mt-1 font-display text-2xl font-bold text-[#e5c05b] sm:text-3xl">
                            Housekeeping Operations
                        </h1>
                        <p className="mt-1 text-xs font-medium text-stone-300 sm:text-sm">
                            Efficient Housekeeping &amp; Maintenance Management.
                        </p>
                    </div>

                    {/* Illuminated OYO Signage Element */}
                    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/50 px-4 py-3 backdrop-blur-md shadow-inner">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 shadow-lg shadow-red-600/40">
                            <span className="font-black text-sm tracking-wider text-white">OYO</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Property #90631</div>
                            <div className="text-xs font-bold text-white">3101 Sage Rd &bull; Houston</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SHIFT PROGRESS & METRICS BAR */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#121622] p-4 shadow-xl sm:grid-cols-12 sm:items-center">
                {/* Circular Gauge: Shift Progress */}
                <div className="flex items-center gap-4 sm:col-span-5">
                    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
                        <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 72 72">
                            <circle cx="36" cy="36" r="30" stroke="#232a3a" strokeWidth="6" fill="transparent" />
                            <circle
                                cx="36"
                                cy="36"
                                r="30"
                                stroke="#e5c05b"
                                strokeWidth="6"
                                strokeDasharray={188.5}
                                strokeDashoffset={188.5 - (188.5 * shiftProgressPct) / 100}
                                strokeLinecap="round"
                                fill="transparent"
                                className="transition-all duration-700 ease-out"
                            />
                        </svg>
                        <span className="absolute font-display text-base font-bold text-white">
                            {shiftProgressPct}%
                        </span>
                    </div>
                    <div>
                        <div className="font-display text-base font-bold text-white">Shift Progress</div>
                        <p className="text-xs text-stone-400">
                            <strong className="text-white">{servicedCount} of {totalCount}</strong> rooms serviced
                        </p>
                    </div>
                </div>

                {/* Right 5 Stat Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-7 sm:justify-end">
                    {/* Total Rooms */}
                    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#171c2b] px-3 py-2">
                        <i className="fa-solid fa-bed text-sm text-stone-400"></i>
                        <div>
                            <div className="font-display text-lg font-bold leading-none text-white">{totalCount}</div>
                            <div className="text-[10px] text-stone-400">Total Rooms</div>
                        </div>
                    </div>

                    {/* Dirty */}
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
                        <i className="fa-solid fa-broom text-sm text-red-400"></i>
                        <div>
                            <div className="font-display text-lg font-bold leading-none text-red-400">{dirtyCount}</div>
                            <div className="text-[10px] text-stone-400">Dirty</div>
                        </div>
                    </div>

                    {/* Cleaning */}
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2">
                        <i className="fa-solid fa-cart-flatbed-suitcase text-sm text-amber-400"></i>
                        <div>
                            <div className="font-display text-lg font-bold leading-none text-amber-400">{cleaningCount}</div>
                            <div className="text-[10px] text-stone-400">Cleaning</div>
                        </div>
                    </div>

                    {/* Ready */}
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                        <i className="fa-solid fa-circle-check text-sm text-emerald-400"></i>
                        <div>
                            <div className="font-display text-lg font-bold leading-none text-emerald-400">{cleanCount}</div>
                            <div className="text-[10px] text-stone-400">Ready</div>
                        </div>
                    </div>

                    {/* DND */}
                    <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2">
                        <i className="fa-solid fa-moon text-sm text-purple-400"></i>
                        <div>
                            <div className="font-display text-lg font-bold leading-none text-purple-400">{dndCount}</div>
                            <div className="text-[10px] text-stone-400">DND</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. FILTER CONTROLS & TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#121622] p-3 shadow-lg">
                {/* Floor Switcher */}
                <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-[#171c2b] p-1">
                    <button
                        type="button"
                        onClick={() => setSelectedFloor('ALL')}
                        className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                            selectedFloor === 'ALL'
                                ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] text-slate-950 shadow-md'
                                : 'text-stone-300 hover:text-white'
                        }`}
                    >
                        All Floors
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedFloor('1')}
                        className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                            selectedFloor === '1'
                                ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] text-slate-950 shadow-md'
                                : 'text-stone-300 hover:text-white'
                        }`}
                    >
                        Floor 1
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedFloor('2')}
                        className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                            selectedFloor === '2'
                                ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] text-slate-950 shadow-md'
                                : 'text-stone-300 hover:text-white'
                        }`}
                    >
                        Floor 2
                    </button>
                </div>

                {/* Dropdown Filters & View Switchers */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Wings Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedWing}
                            onChange={(e) => setSelectedWing(e.target.value)}
                            className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#171c2b] py-2 pl-3.5 pr-8 text-xs font-semibold text-stone-200 outline-none transition hover:border-white/20 focus:ring-1 focus:ring-amber-400"
                        >
                            <option value="ALL">All Wings</option>
                            <option value="North Wing">North Wing</option>
                            <option value="West Wing">West Wing</option>
                            <option value="South Wing">South Wing</option>
                        </select>
                        <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-3 text-[10px] text-stone-400"></i>
                    </div>

                    {/* Priority Dropdown */}
                    <div className="relative">
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#171c2b] py-2 pl-3.5 pr-8 text-xs font-semibold text-stone-200 outline-none transition hover:border-white/20 focus:ring-1 focus:ring-amber-400"
                        >
                            <option value="ALL">Cleaning Priority</option>
                            <option value="priority">Priority Queue (Urgent First)</option>
                            <option value="dirty">Dirty Rooms Only</option>
                            <option value="cleaning">In Progress Only</option>
                            <option value="clean">Ready &amp; Inspected Only</option>
                        </select>
                        <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-3 text-[10px] text-stone-400"></i>
                    </div>

                    {/* View Switchers: Grid / List */}
                    <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#171c2b] p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid View"
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition ${
                                viewMode === 'grid'
                                    ? 'bg-[#e5c05b] text-slate-950 shadow-sm'
                                    : 'text-stone-400 hover:text-white'
                            }`}
                        >
                            <i className="fa-solid fa-grip text-xs"></i>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            aria-label="List View"
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition ${
                                viewMode === 'list'
                                    ? 'bg-[#e5c05b] text-slate-950 shadow-sm'
                                    : 'text-stone-400 hover:text-white'
                            }`}
                        >
                            <i className="fa-solid fa-list text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MAIN CONTENT: ROOM CARDS (LEFT) + RIGHT OPERATIONS SIDEBAR */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* ROOM CARDS (Cols 1-8 or 1-9) */}
                <div className="lg:col-span-8 xl:col-span-9">
                    {filteredRooms.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#121622] p-6 text-center">
                            <i className="fa-solid fa-broom text-3xl text-stone-500 mb-3"></i>
                            <h3 className="font-display text-lg font-bold text-white">No suites match the selected filter</h3>
                            <p className="mt-1 text-xs text-stone-400">Change floor, wing, or priority to see more rooms.</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                            : "space-y-3"
                        }>
                            {filteredRooms.map((room) => {
                                const staff = staffMap[room.id] || 'Unassigned';

                                return (
                                    <div
                                        key={room.id}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141924] shadow-xl transition-all duration-200 hover:border-amber-400/40 hover:shadow-2xl"
                                    >
                                        {/* Ambient Room Photo with Subtle Dark Gradient */}
                                        <div
                                            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${hotelSuite})` }}
                                        ></div>
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141924] via-[#141924]/85 to-[#141924]/60"></div>

                                        {/* Card Content */}
                                        <div className="relative z-10 flex h-full flex-col justify-between p-4 space-y-3">
                                            {/* Top Header: Room Number + Status Badge */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="font-display text-2xl font-bold leading-none text-white tracking-tight">
                                                    {room.id}
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {renderStatusBadge(room)}
                                                </div>
                                            </div>

                                            {/* Suite Type & Staff Assignment */}
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-semibold text-stone-200 truncate">
                                                    {room.type}
                                                </div>
                                                <div
                                                    onClick={(e) => handleCycleStaff(room.id, e)}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-stone-400 hover:text-amber-300 transition"
                                                    title="Click to reassign staff"
                                                >
                                                    <i className="fa-solid fa-user text-[10px] text-stone-500"></i>
                                                    <span>Staff: {staff}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-1">
                                                {renderActionButton(room)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 5. RIGHT OPERATIONS SIDEBAR (Cols 9-12 or 10-12) */}
                <div className="space-y-4 lg:col-span-4 xl:col-span-3">
                    {/* Panel 1: Quick Actions */}
                    <div className="rounded-2xl border border-white/10 bg-[#121622] p-4 shadow-xl space-y-3">
                        <h3 className="font-display text-sm font-bold text-white tracking-wide">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            {/* Assign All Staff */}
                            <button
                                type="button"
                                onClick={handleAssignAllStaff}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] py-2.5 px-4 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.98]"
                            >
                                <i className="fa-solid fa-user-plus text-xs"></i>
                                <span>Assign All Staff</span>
                            </button>

                            {/* Request Inspector */}
                            <button
                                type="button"
                                onClick={() => {
                                    const firstClean = rooms.find(r => r.status === 'clean');
                                    if (firstClean) onOpenQc?.(firstClean.id);
                                    else triggerToast('No pending rooms ready for inspection.');
                                }}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#181f2c] py-2.5 px-4 text-xs font-semibold text-stone-200 transition hover:bg-[#222a3b] hover:text-white active:scale-[0.98]"
                            >
                                <i className="fa-solid fa-magnifying-glass text-xs text-stone-400"></i>
                                <span>Request Inspector</span>
                            </button>

                            {/* Report Maintenance */}
                            <button
                                type="button"
                                onClick={() => {
                                    const mRoom = rooms.find(r => r.status === 'maintenance') || rooms[0];
                                    if (mRoom) onOpenEdit?.(mRoom.id);
                                }}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#181f2c] py-2.5 px-4 text-xs font-semibold text-stone-200 transition hover:bg-[#222a3b] hover:text-white active:scale-[0.98]"
                            >
                                <i className="fa-solid fa-wrench text-xs text-stone-400"></i>
                                <span>Report Maintenance</span>
                            </button>
                        </div>
                    </div>

                    {/* Panel 2: Today's Tasks / Activities with Color Indicator Bars */}
                    <div className="rounded-2xl border border-white/10 bg-[#121622] p-4 shadow-xl space-y-3">
                        <div className="flex items-center gap-2">
                            <i className="fa-regular fa-calendar-check text-xs text-amber-400"></i>
                            <h3 className="font-display text-sm font-bold text-white tracking-wide">
                                Today's Tasks / Activities
                            </h3>
                        </div>

                        <div className="space-y-2 text-xs font-medium">
                            {/* Check-Out Cleanings (Red Bar) */}
                            <div
                                onClick={() => setPriorityFilter('dirty')}
                                className="flex cursor-pointer items-center justify-between rounded-xl bg-[#171c2b] p-2.5 pl-3 border-l-4 border-red-500 transition hover:bg-white/5 text-stone-300"
                            >
                                <span>18 Check-Out Cleanings (Priority)</span>
                                <i className="fa-solid fa-chevron-right text-[10px] text-stone-500"></i>
                            </div>

                            {/* Stayover Service (Blue Bar) */}
                            <div className="flex cursor-pointer items-center justify-between rounded-xl bg-[#171c2b] p-2.5 pl-3 border-l-4 border-blue-500 transition hover:bg-white/5 text-stone-300">
                                <span>4 Stayover Service</span>
                                <i className="fa-solid fa-chevron-right text-[10px] text-stone-500"></i>
                            </div>

                            {/* Deep Cleanings (Yellow Bar) */}
                            <div className="flex cursor-pointer items-center justify-between rounded-xl bg-[#171c2b] p-2.5 pl-3 border-l-4 border-amber-400 transition hover:bg-white/5 text-stone-300">
                                <span>3 Deep Cleanings Scheduled</span>
                                <i className="fa-solid fa-chevron-right text-[10px] text-stone-500"></i>
                            </div>

                            {/* Maintenance Alerts (Gray Bar) */}
                            <div
                                onClick={() => {
                                    const m = rooms.find(r => r.status === 'maintenance');
                                    if (m) onOpenEdit?.(m.id);
                                }}
                                className="flex cursor-pointer items-center justify-between rounded-xl bg-[#171c2b] p-2.5 pl-3 border-l-4 border-stone-500 transition hover:bg-white/5 text-stone-300"
                            >
                                <span>{maintenanceCount > 0 ? maintenanceCount : 2} Maintenance Alerts</span>
                                <i className="fa-solid fa-chevron-right text-[10px] text-stone-500"></i>
                            </div>
                        </div>
                    </div>

                    {/* Panel 3: Housekeeping Summary */}
                    <div className="rounded-2xl border border-white/10 bg-[#121622] p-4 shadow-xl space-y-4">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-chart-pie text-xs text-amber-400"></i>
                            <h3 className="font-display text-sm font-bold text-white tracking-wide">
                                Housekeeping Summary
                            </h3>
                        </div>

                        {/* Circular Progress & Occupancy */}
                        <div className="flex items-center gap-3.5">
                            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
                                <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 72 72">
                                    <circle cx="36" cy="36" r="30" stroke="#232a3a" strokeWidth="6" fill="transparent" />
                                    <circle
                                        cx="36"
                                        cy="36"
                                        r="30"
                                        stroke="#e5c05b"
                                        strokeWidth="6"
                                        strokeDasharray={188.5}
                                        strokeDashoffset={188.5 - (188.5 * staffOccupancyPct) / 100}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-700 ease-out"
                                    />
                                </svg>
                                <span className="absolute font-display text-sm font-bold text-white">
                                    {staffOccupancyPct}%
                                </span>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white">Staff Occupancy</div>
                                <div className="text-[11px] text-stone-400">Task Completion</div>
                            </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 rounded-xl bg-[#171c2b] p-2 text-stone-300">
                                <i className="fa-solid fa-user text-stone-400 text-xs"></i>
                                <div>
                                    <span className="font-bold text-white">8</span>
                                    <div className="text-[10px] text-stone-400">Staff On Duty</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-[#171c2b] p-2 text-stone-300">
                                <i className="fa-solid fa-bed text-stone-400 text-xs"></i>
                                <div>
                                    <span className="font-bold text-white">18</span>
                                    <div className="text-[10px] text-stone-400">Rooms Completed</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-[#171c2b] p-2 text-stone-300">
                                <i className="fa-solid fa-broom text-stone-400 text-xs"></i>
                                <div>
                                    <span className="font-bold text-white">8</span>
                                    <div className="text-[10px] text-stone-400">To Go</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-[#171c2b] p-2 text-stone-300">
                                <i className="fa-solid fa-bell-slash text-stone-400 text-xs"></i>
                                <div>
                                    <span className="font-bold text-white">4</span>
                                    <div className="text-[10px] text-stone-400">DND/Skipped</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
