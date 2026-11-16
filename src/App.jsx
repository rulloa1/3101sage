import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import ReadinessBar from './components/ReadinessBar';
import StatsBar from './components/StatsBar';
import FilterControls from './components/FilterControls';
import DeskView from './components/DeskView';
import HousekeepingView from './components/HousekeepingView';
import AuditView from './components/AuditView';
import ShiftSummaryModal from './components/ShiftSummaryModal';
import EarlyCheckinModal from './components/EarlyCheckinModal';
import HousekeepingQcModal from './components/HousekeepingQcModal';
import KeycardSleeveModal from './components/KeycardSleeveModal';
import EditRoomModal from './components/EditRoomModal';
import Toast from './components/Toast';

import { initialRooms } from './constants/initialRooms';
import { getStatusConfig, i18n } from './constants/i18n';
import { syncService, myClientId } from './services/syncService';
import { playChime } from './services/soundService';

export default function App() {
    // 1. STATE INITIALIZATION
    const [rooms, setRooms] = useState(() => {
        try {
            const saved = localStorage.getItem('sage_rooms');
            return saved ? JSON.parse(saved) : initialRooms;
        } catch (e) {
            return initialRooms;
        }
    });

    const [currentFloor, setCurrentFloor] = useState('ALL');
    const [currentStatusFilter, setCurrentStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState('desk');
    const [currentLang, setCurrentLang] = useState('en');

    const [cloudStatus, setCloudStatus] = useState({ connected: false, label: 'Connecting...' });
    const [toast, setToast] = useState({ visible: false, message: '', icon: '' });

    // Modals
    const [isShiftReportOpen, setIsShiftReportOpen] = useState(false);
    const [isEarlyCheckinOpen, setIsEarlyCheckinOpen] = useState(false);
    const [isKeycardSleeveOpen, setIsKeycardSleeveOpen] = useState(false);
    const [qcModalRoomId, setQcModalRoomId] = useState(null);
    const [editModalRoomId, setEditModalRoomId] = useState(null);

    // Today Early Fees
    const [todayEarlyTotal, setTodayEarlyTotal] = useState(() => {
        try {
            const feesHistory = JSON.parse(localStorage.getItem('sage_early_fees') || '[]');
            const todayStr = new Date().toDateString();
            return feesHistory
                .filter(item => new Date(item.timestamp).toDateString() === todayStr)
                .reduce((sum, item) => sum + (item.fee || 0), 0);
        } catch (e) {
            return 0;
        }
    });

    // 2. TOAST HELPER
    const showToast = useCallback((message, icon = 'fa-circle-check text-emerald-400') => {
        setToast({ visible: true, message, icon });
        clearTimeout(window._reactToastTimer);
        window._reactToastTimer = setTimeout(() => {
            setToast({ visible: false, message: '', icon: '' });
        }, 2500);
    }, []);

    // 3. SAVE AND BROADCAST
    const persistRooms = useCallback((newRooms, publish = true) => {
        setRooms(newRooms);
        try {
            localStorage.setItem('sage_rooms', JSON.stringify(newRooms));
        } catch (e) {}

        if (publish) {
            syncService.publish({
                type: 'FULL_SYNC',
                rooms: newRooms
            });
        }
    }, []);

    // 4. REAL-TIME SYNC & WEBSOCKET SETUP
    useEffect(() => {
        syncService.init();

        const unsubscribeStatus = syncService.subscribeStatus((connected, label) => {
            setCloudStatus({ connected, label });
        });

        const unsubscribeSync = syncService.subscribe((data) => {
            if (!data) return;

            if (data.type === 'SYNC_REQUEST') {
                syncService.publish({ type: 'FULL_SYNC', rooms });
                return;
            }

            if (data.type === 'FULL_SYNC' && Array.isArray(data.rooms)) {
                setRooms(data.rooms);
                try {
                    localStorage.setItem('sage_rooms', JSON.stringify(data.rooms));
                } catch (e) {}
                showToast("Synced with property network!", "fa-tower-broadcast text-emerald-400");
                playChime(659.25, 0.25);
                return;
            }

            if (data.type === 'ROOM_UPDATE' && data.roomId) {
                setRooms((prevRooms) => {
                    const updated = prevRooms.map(r => {
                        if (r.id === data.roomId) {
                            return {
                                ...r,
                                status: data.status,
                                notes: data.notes !== undefined ? data.notes : r.notes,
                                cleaningStartedAt: data.cleaningStartedAt !== undefined ? data.cleaningStartedAt : r.cleaningStartedAt
                            };
                        }
                        return r;
                    });
                    try {
                        localStorage.setItem('sage_rooms', JSON.stringify(updated));
                    } catch (e) {}
                    return updated;
                });

                const cfg = getStatusConfig(data.status, currentLang);
                showToast(`Room ${data.roomId} updated to ${cfg.label}!`, cfg.icon + ' ' + (cfg.text));
                playChime(587.33, 0.2);
            }
        });

        // Cross-window storage listener
        const handleStorage = (e) => {
            if (e.key === 'sage_rooms' && e.newValue) {
                try {
                    setRooms(JSON.parse(e.newValue));
                } catch (err) {}
            }
            if (e.key === 'sage_early_fees') {
                try {
                    const feesHistory = JSON.parse(e.newValue || '[]');
                    const todayStr = new Date().toDateString();
                    const sum = feesHistory
                        .filter(item => new Date(item.timestamp).toDateString() === todayStr)
                        .reduce((total, item) => total + (item.fee || 0), 0);
                    setTodayEarlyTotal(sum);
                } catch (err) {}
            }
        };
        window.addEventListener('storage', handleStorage);

        // Escape key to dismiss modals
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsShiftReportOpen(false);
                setIsEarlyCheckinOpen(false);
                setIsKeycardSleeveOpen(false);
                setQcModalRoomId(null);
                setEditModalRoomId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            unsubscribeStatus();
            unsubscribeSync();
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentLang, rooms, showToast]);

    // Re-render cleaning timers periodically
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // 5. ACTIONS
    const handleForceResync = () => {
        showToast("Syncing with cloud network...", "fa-rotate text-brand-400");
        syncService.connectCloud();
        syncService.publish({ type: 'FULL_SYNC', rooms, senderId: myClientId });
    };

    const handleToggleLanguage = () => {
        setCurrentLang(prev => (prev === 'en' ? 'es' : 'en'));
    };

    const handleSetViewMode = (mode) => {
        setActiveView(mode);
        if (mode === 'housekeeping') {
            setCurrentFloor('ALL');
            setCurrentStatusFilter('ALL');
            setSearchQuery('');
        }
    };

    const handleStatusFilter = (status) => {
        setCurrentStatusFilter(prev => (prev === status ? 'ALL' : status));
    };

    const handleWalkInMatch = () => {
        setCurrentStatusFilter('clean');
        showToast("Showing all rooms ready for immediate check-in!", "fa-key text-emerald-400");
    };

    const handleResetFilters = () => {
        setCurrentFloor('ALL');
        setCurrentStatusFilter('ALL');
        setSearchQuery('');
    };

    const handleResetDemo = () => {
        if (window.confirm("Reset rooms to demo layout across all screens?")) {
            persistRooms(JSON.parse(JSON.stringify(initialRooms)), true);
            showToast("Demo layout reset and synced to cloud", "fa-rotate-left text-brand-400");
        }
    };

    const handleChangeStatusDirect = (roomId, newStatus) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        let cleaningStartedAt = target.cleaningStartedAt;
        if (newStatus === 'cleaning') cleaningStartedAt = Date.now();
        if (newStatus === 'clean') {
            cleaningStartedAt = null;
            playChime(523.25, 0.2);
        }

        const updated = rooms.map(r => {
            if (r.id === roomId) {
                return { ...r, status: newStatus, cleaningStartedAt };
            }
            return r;
        });

        persistRooms(updated, false);

        syncService.publish({
            type: 'ROOM_UPDATE',
            roomId: target.id,
            status: newStatus,
            notes: target.notes,
            cleaningStartedAt
        });

        const cfg = getStatusConfig(newStatus, currentLang);
        showToast(`Room ${roomId} marked ${cfg.label}`);
    };

    // Modal Actions
    const handleSaveEdit = (roomId, newStatus, newNotes) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        let cleaningStartedAt = target.cleaningStartedAt;
        if (newStatus === 'cleaning' && target.status !== 'cleaning') cleaningStartedAt = Date.now();
        if (newStatus === 'clean') cleaningStartedAt = null;

        const updated = rooms.map(r => {
            if (r.id === roomId) {
                return { ...r, status: newStatus, notes: newNotes, cleaningStartedAt };
            }
            return r;
        });

        persistRooms(updated, false);

        syncService.publish({
            type: 'ROOM_UPDATE',
            roomId,
            status: newStatus,
            notes: newNotes,
            cleaningStartedAt
        });

        showToast(`Room ${roomId} updated!`, 'fa-floppy-disk text-brand-400');
    };

    const handleConfirmEarlyCheckin = (roomId, fee, guestName) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        const feeRecord = {
            id: 'EF_' + Date.now(),
            roomId: target.id,
            fee,
            guest: guestName || "Early Guest Arrival",
            timestamp: Date.now()
        };

        try {
            const feesHistory = JSON.parse(localStorage.getItem('sage_early_fees') || '[]');
            feesHistory.push(feeRecord);
            localStorage.setItem('sage_early_fees', JSON.stringify(feesHistory));

            const todayStr = new Date().toDateString();
            const sum = feesHistory
                .filter(item => new Date(item.timestamp).toDateString() === todayStr)
                .reduce((total, item) => total + (item.fee || 0), 0);
            setTodayEarlyTotal(sum);
        } catch (e) {}

        const updated = rooms.map(r => {
            if (r.id === roomId) {
                return {
                    ...r,
                    status: 'occupied',
                    notes: `Early Check-in ($${fee}) - ${guestName || "Early Arrival"}`,
                    cleaningStartedAt: null
                };
            }
            return r;
        });

        persistRooms(updated, true);
        playChime(659.25, 0.3);
        showToast(`Collected $${fee} early fee! Room ${roomId} occupied.`, "fa-hand-holding-dollar text-emerald-400");
    };

    const handleConfirmQc = (roomId) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedNotes = target.notes ? `${target.notes} | QC Passed (${timeStr})` : `QC Passed (${timeStr})`;

        const updated = rooms.map(r => {
            if (r.id === roomId) {
                return {
                    ...r,
                    status: 'clean',
                    notes: updatedNotes,
                    cleaningStartedAt: null
                };
            }
            return r;
        });

        persistRooms(updated, true);
        playChime(659.25, 0.25);
        showToast(`Room ${roomId} certified Clean & Ready (3.7★ QC Passed)`, "fa-circle-check text-emerald-400");
    };

    // 6. FILTER LOGIC
    const filteredRooms = useMemo(() => {
        return rooms.filter(r => {
            const matchFloor = currentFloor === 'ALL' || String(r.floor) === String(currentFloor);
            const matchStatus = currentStatusFilter === 'ALL' || 
                (currentStatusFilter === 'maintenance' ? (r.status === 'maintenance' || r.status === 'dnd') : r.status === currentStatusFilter);
            const query = searchQuery.trim().toLowerCase();
            const matchSearch = !query || 
                String(r.id).includes(query) || 
                (r.notes && r.notes.toLowerCase().includes(query)) ||
                r.type.toLowerCase().includes(query);

            return matchFloor && matchStatus && matchSearch;
        });
    }, [rooms, currentFloor, currentStatusFilter, searchQuery]);

    const activeQcRoom = useMemo(() => rooms.find(r => r.id === qcModalRoomId), [rooms, qcModalRoomId]);
    const activeEditRoom = useMemo(() => rooms.find(r => r.id === editModalRoomId), [rooms, editModalRoomId]);

    return (
        <div className="text-slate-100 font-sans min-h-screen flex flex-col antialiased selection:bg-brand-600 selection:text-white">
            {/* Header */}
            <Header 
                activeView={activeView}
                setActiveView={handleSetViewMode}
                currentLang={currentLang}
                toggleLanguage={handleToggleLanguage}
                cloudStatus={cloudStatus}
                forceCloudResync={handleForceResync}
                onOpenShiftReport={() => setIsShiftReportOpen(true)}
                onOpenEarlyCheckin={() => setIsEarlyCheckinOpen(true)}
                onOpenKeycardSleeve={() => setIsKeycardSleeveOpen(true)}
            />

            {/* Sub-header Progress & Stats (Desk & Housekeeping views) */}
            {activeView !== 'audit' && (
                <>
                    <ReadinessBar rooms={rooms} currentLang={currentLang} />
                    <StatsBar 
                        rooms={rooms} 
                        currentStatusFilter={currentStatusFilter} 
                        onStatusFilter={handleStatusFilter}
                        currentLang={currentLang}
                    />
                </>
            )}

            {/* Filter Controls Bar (Desk view only) */}
            {activeView === 'desk' && (
                <FilterControls 
                    currentFloor={currentFloor}
                    setFloor={setCurrentFloor}
                    currentStatusFilter={currentStatusFilter}
                    resetFilters={handleResetFilters}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onWalkInMatch={handleWalkInMatch}
                    onResetDemo={handleResetDemo}
                />
            )}

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex-1 w-full">
                {activeView === 'desk' && (
                    filteredRooms.length > 0 ? (
                        <DeskView 
                            rooms={filteredRooms}
                            currentLang={currentLang}
                            onChangeStatus={handleChangeStatusDirect}
                            onOpenQc={(id) => setQcModalRoomId(id)}
                            onOpenEdit={(id) => setEditModalRoomId(id)}
                        />
                    ) : (
                        <div className="panel my-4 rounded-2xl border-dashed border-white/15 px-4 py-16 text-center">
                            <h3 className="text-base font-bold text-slate-200">No rooms match this criteria</h3>
                            <button 
                                onClick={handleResetFilters}
                                className="btn-primary mt-4"
                            >
                                Show All Rooms
                            </button>
                        </div>
                    )
                )}

                {activeView === 'housekeeping' && (
                    <HousekeepingView 
                        rooms={rooms}
                        currentLang={currentLang}
                        onChangeStatus={handleChangeStatusDirect}
                        onOpenQc={(id) => setQcModalRoomId(id)}
                        onOpenEdit={(id) => setEditModalRoomId(id)}
                    />
                )}

                {activeView === 'audit' && (
                    <AuditView />
                )}
            </main>

            {/* FOOTER */}
            <footer className="mt-auto border-t border-white/[0.07] bg-ink-950/60 py-3.5 text-center text-xs font-medium text-slate-500 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span>RoomSync Pro Operational Suite <span className="text-slate-600">&bull;</span> 3101 Sage Rd</span>
                    <span className="text-slate-500">Multi-tab &amp; Cloud Real-time Synced</span>
                </div>
            </footer>

            {/* MODALS */}
            <ShiftSummaryModal 
                isOpen={isShiftReportOpen}
                onClose={() => setIsShiftReportOpen(false)}
                rooms={rooms}
                onCopy={showToast}
            />

            <EarlyCheckinModal 
                isOpen={isEarlyCheckinOpen}
                onClose={() => setIsEarlyCheckinOpen(false)}
                rooms={rooms}
                onConfirm={handleConfirmEarlyCheckin}
                todayEarlyTotal={todayEarlyTotal}
            />

            <HousekeepingQcModal 
                isOpen={Boolean(qcModalRoomId)}
                roomId={qcModalRoomId}
                room={activeQcRoom}
                onClose={() => setQcModalRoomId(null)}
                onConfirm={handleConfirmQc}
            />

            <KeycardSleeveModal 
                isOpen={isKeycardSleeveOpen}
                onClose={() => setIsKeycardSleeveOpen(false)}
                rooms={rooms}
                defaultRoomId={101}
            />

            <EditRoomModal 
                isOpen={Boolean(editModalRoomId)}
                roomId={editModalRoomId}
                room={activeEditRoom}
                onClose={() => setEditModalRoomId(null)}
                onSave={handleSaveEdit}
                currentLang={currentLang}
            />

            {/* FLOATING TOAST NOTIFICATION */}
            <Toast toast={toast} />
        </div>
    );
}
