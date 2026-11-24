import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
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
import RoomListModal from './components/RoomListModal';
import ExecutiveMemoModal from './components/ExecutiveMemoModal';
import AddRoomModal from './components/AddRoomModal';
import CheckoutLog from './components/CheckoutLog';
import Toast from './components/Toast';

import { getStatusConfig, i18n } from './constants/i18n';
import {
    INVENTORY_SCHEMA,
    INVENTORY_STORAGE_KEY,
    createModelInventory,
    inventoryMeta,
    isRoomArray,
    readInventory,
    writeInventory
} from './constants/inventory';
import { syncService, myClientId } from './services/syncService';
import { playChime } from './services/soundService';
import { loadCheckoutLog, appendCheckout, saveCheckoutLog } from './services/checkoutService';

const PRIORITY_SORT_ORDER = {
    dirty: 0,
    cleaning: 1,
    maintenance: 2,
    dnd: 3,
    clean: 4,
    occupied: 5
};

function selectTodayFees(history) {
    const todayStr = new Date().toDateString();
    return history.filter(item => new Date(item.timestamp).toDateString() === todayStr);
}

function sumTodayFees(history) {
    return selectTodayFees(history).reduce((sum, item) => sum + (Number(item.fee) || 0), 0);
}

function readEarlyFees() {
    try {
        const history = JSON.parse(localStorage.getItem('sage_early_fees') || '[]');
        return Array.isArray(history) ? history : [];
    } catch (e) {
        return [];
    }
}

export default function App() {
    const [inventory, setInventory] = useState(readInventory);
    const rooms = inventory.rooms;

    const [currentFloor, setCurrentFloor] = useState('ALL');
    const [currentWing, setCurrentWing] = useState('ALL');
    const [currentStatusFilter, setCurrentStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('room');
    const [viewLayout, setViewLayout] = useState('cards');
    const [activeView, setActiveView] = useState('desk');
    const [currentLang, setCurrentLang] = useState('en');

    const [cloudStatus, setCloudStatus] = useState({ connected: false, label: 'Connecting...' });
    const [toast, setToast] = useState({ visible: false, message: '', icon: '' });

    // Modals
    const [isShiftReportOpen, setIsShiftReportOpen] = useState(false);
    const [isEarlyCheckinOpen, setIsEarlyCheckinOpen] = useState(false);
    const [isKeycardSleeveOpen, setIsKeycardSleeveOpen] = useState(false);
    const [keycardRoomId, setKeycardRoomId] = useState(null);
    const [isRoomListOpen, setIsRoomListOpen] = useState(false);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [qcModalRoomId, setQcModalRoomId] = useState(null);
    const [editModalRoomId, setEditModalRoomId] = useState(null);

    const [earlyFees, setEarlyFees] = useState(readEarlyFees);
    const todayEarlyFees = selectTodayFees(earlyFees);
    const todayEarlyTotal = sumTodayFees(earlyFees);

    const inventoryRef = useRef(inventory);
    const roomsRef = useRef(rooms);
    const langRef = useRef(currentLang);
    inventoryRef.current = inventory;
    roomsRef.current = rooms;
    langRef.current = currentLang;

    const [checkoutLog, setCheckoutLog] = useState(() => loadCheckoutLog());

    const showToast = useCallback((message, icon = 'fa-circle-check text-emerald-400') => {
        setToast({ visible: true, message, icon });
        clearTimeout(window._reactToastTimer);
        window._reactToastTimer = setTimeout(() => {
            setToast({ visible: false, message: '', icon: '' });
        }, 2500);
    }, []);

    useEffect(() => {
        writeInventory(inventory);
    }, [inventory]);

    useEffect(() => {
        document.documentElement.lang = currentLang;
    }, [currentLang]);

    const persistRooms = useCallback((newRooms, publish = true) => {
        setInventory(prev => ({ ...prev, rooms: newRooms }));

        if (publish) {
            syncService.publish({
                type: 'FULL_SYNC',
                rooms: newRooms,
                meta: inventoryMeta(inventoryRef.current)
            });
        }
    }, []);

    const addEarlyFee = useCallback((record) => {
        if (!record || !record.id) return;
        const history = readEarlyFees();
        if (history.some(item => item.id === record.id)) {
            setEarlyFees(history);
            return;
        }
        history.push(record);
        try {
            localStorage.setItem('sage_early_fees', JSON.stringify(history));
        } catch (e) {}
        setEarlyFees(history);
    }, []);

    useEffect(() => {
        syncService.init();

        const unsubscribeStatus = syncService.subscribeStatus((connected, label) => {
            setCloudStatus({ connected, label });
        });

        const unsubscribeSync = syncService.subscribe((data) => {
            if (!data) return;

            if (data.type === 'SYNC_REQUEST') {
                syncService.publish({
                    type: 'FULL_SYNC',
                    rooms: roomsRef.current,
                    meta: inventoryMeta(inventoryRef.current)
                });
                return;
            }

            if (data.type === 'FULL_SYNC' && isRoomArray(data.rooms)) {
                setInventory(prev => {
                    const next = { ...prev, rooms: data.rooms };
                    if (data.meta && typeof data.meta === 'object') {
                        next.source = data.meta.source === 'imported' ? 'imported' : 'model';
                        next.importedAt = Number.isFinite(Number(data.meta.importedAt)) ? Number(data.meta.importedAt) : null;
                        next.fileName = typeof data.meta.fileName === 'string' ? data.meta.fileName.slice(0, 120) : null;
                    }
                    return next;
                });
                showToast('Synced with property network', 'fa-tower-broadcast text-emerald-400');
                playChime(659.25, 0.25);
                return;
            }

            if (data.type === 'ROOM_UPDATE' && data.roomId) {
                setInventory(prev => ({
                    ...prev,
                    rooms: prev.rooms.map(r => {
                        if (r.id === data.roomId) {
                            return {
                                ...r,
                                status: data.status,
                                notes: data.notes !== undefined ? data.notes : r.notes,
                                cleaningStartedAt: data.cleaningStartedAt !== undefined ? data.cleaningStartedAt : r.cleaningStartedAt
                            };
                        }
                        return r;
                    })
                }));

                const cfg = getStatusConfig(data.status, langRef.current);
                showToast(`Suite ${data.roomId} updated to ${cfg.label}`, `${cfg.icon} ${cfg.text}`);
                playChime(587.33, 0.2);
                return;
            }

            if (data.type === 'EARLY_FEE' && data.record) {
                addEarlyFee(data.record);
                showToast(`Early check-in logged for Suite ${data.record.roomId}`, 'fa-hand-holding-dollar text-emerald-400');
            }

            if (data.type === 'CHECKOUT_LOG_SYNC' && Array.isArray(data.log)) {
                setCheckoutLog(data.log);
                saveCheckoutLog(data.log);
            }
        });

        const handleStorage = (e) => {
            if (e.key === INVENTORY_STORAGE_KEY && e.newValue) {
                setInventory(readInventory());
            }
            if (e.key === 'sage_early_fees') {
                try {
                    const feesHistory = JSON.parse(e.newValue || '[]');
                    if (Array.isArray(feesHistory)) setEarlyFees(feesHistory);
                } catch (err) {}
            }
            if (e.key === 'sage_checkout_log' && e.newValue) {
                try {
                    setCheckoutLog(JSON.parse(e.newValue));
                } catch (err) {}
            }
        };
        window.addEventListener('storage', handleStorage);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsShiftReportOpen(false);
                setIsEarlyCheckinOpen(false);
                setIsKeycardSleeveOpen(false);
                setIsRoomListOpen(false);
                setIsMemoModalOpen(false);
                setIsAddRoomOpen(false);
                setIsResetConfirmOpen(false);
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
    }, [showToast, addEarlyFee]);

    // Periodic refresh for live cleaning timers
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleForceResync = () => {
        showToast('Syncing with cloud network...', 'fa-rotate text-slate-300');
        if (syncService.isConnected) {
            syncService.publish({
                type: 'FULL_SYNC',
                rooms: roomsRef.current,
                meta: inventoryMeta(inventoryRef.current),
                senderId: myClientId
            });
        } else {
            syncService.connectCloud();
        }
    };

    const handleToggleLanguage = () => {
        setCurrentLang(prev => (prev === 'en' ? 'es' : 'en'));
    };

    const handleSetViewMode = (mode) => {
        setActiveView(mode);
        if (mode === 'housekeeping') {
            setCurrentFloor('ALL');
            setCurrentWing('ALL');
            setCurrentStatusFilter('ALL');
            setSearchQuery('');
        }
    };

    const handleStatusFilter = (status) => {
        if (status === 'ALL') {
            setCurrentStatusFilter('ALL');
            return;
        }
        setCurrentStatusFilter(prev => (prev === status ? 'ALL' : status));
    };

    const handleWalkInMatch = () => {
        setCurrentStatusFilter(prev => (prev === 'clean' ? 'ALL' : 'clean'));
        if (currentStatusFilter !== 'clean') {
            showToast('Showing suites ready for immediate check-in', 'fa-key text-emerald-400');
        }
    };

    const handleResetFilters = () => {
        setCurrentFloor('ALL');
        setCurrentWing('ALL');
        setCurrentStatusFilter('ALL');
        setSearchQuery('');
    };

    const applyInventory = (record) => {
        setInventory(record);
        syncService.publish({
            type: 'FULL_SYNC',
            rooms: record.rooms,
            meta: inventoryMeta(record)
        });
        setQcModalRoomId(null);
        setEditModalRoomId(null);
        setCurrentFloor('ALL');
        setCurrentWing('ALL');
        setCurrentStatusFilter('ALL');
        setSearchQuery('');
    };

    const handleImportRoomList = (importedRooms, sourceName) => {
        const record = {
            schema: INVENTORY_SCHEMA,
            source: 'imported',
            importedAt: Date.now(),
            fileName: sourceName,
            rooms: importedRooms
        };
        applyInventory(record);
        setIsRoomListOpen(false);
        playChime(659.25, 0.25);
        showToast(`Loaded ${importedRooms.length} suites from ${sourceName}`, 'fa-file-import text-emerald-400');
    };

    const handleConfirmResetModel = () => {
        applyInventory(createModelInventory());
        setIsRoomListOpen(false);
        setIsResetConfirmOpen(false);
        showToast('Working-model inventory restored', 'fa-rotate-left text-amber-400');
    };

    const handleAddRoom = (newRoom) => {
        const updated = [...rooms, newRoom].sort((a, b) => a.id - b.id);
        persistRooms(updated, true);
        playChime(659.25, 0.25);
        showToast(`Suite ${newRoom.id} added to inventory`, 'fa-circle-plus text-emerald-400');
    };

    const handleChangeStatusDirect = (roomId, newStatus) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        let cleaningStartedAt = target.cleaningStartedAt;
        if (newStatus === 'cleaning') cleaningStartedAt = Date.now();
        if (newStatus === 'clean' || newStatus === 'occupied' || newStatus === 'dirty') {
            cleaningStartedAt = null;
        }
        if (newStatus === 'clean') {
            playChime(523.25, 0.2);
        }

        const updated = rooms.map(r => (
            r.id === roomId ? { ...r, status: newStatus, cleaningStartedAt } : r
        ));

        persistRooms(updated, false);

        syncService.publish({
            type: 'ROOM_UPDATE',
            roomId: target.id,
            status: newStatus,
            notes: target.notes,
            cleaningStartedAt
        });

        const cfg = getStatusConfig(newStatus, currentLang);
        showToast(`Suite ${roomId} marked ${cfg.label}`);
    };

    const handleSaveEdit = (roomId, newStatus, newNotes) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        let cleaningStartedAt = target.cleaningStartedAt;
        if (newStatus === 'cleaning' && target.status !== 'cleaning') cleaningStartedAt = Date.now();
        if (newStatus === 'clean') cleaningStartedAt = null;

        const updated = rooms.map(r => (
            r.id === roomId ? { ...r, status: newStatus, notes: newNotes, cleaningStartedAt } : r
        ));

        persistRooms(updated, false);

        syncService.publish({
            type: 'ROOM_UPDATE',
            roomId,
            status: newStatus,
            notes: newNotes,
            cleaningStartedAt
        });

        const dispatched = newStatus === 'maintenance'
            && /handyman alerted/i.test(newNotes)
            && !/handyman alerted/i.test(target.notes || '');
        const cfg = getStatusConfig(newStatus, currentLang);
        if (dispatched) {
            showToast(`Handyman alert logged — Suite ${roomId} marked ${cfg.label}`, 'fa-screwdriver-wrench text-amber-400');
        } else {
            showToast(`Suite ${roomId} updated`, 'fa-floppy-disk text-emerald-400');
        }
    };

    const handleConfirmEarlyCheckin = (roomId, fee, guestName) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) {
            showToast('That suite is no longer available', 'fa-triangle-exclamation text-rose-400');
            return;
        }

        const feeRecord = {
            id: 'EF_' + Date.now() + '_' + roomId,
            roomId: target.id,
            fee,
            guest: guestName || 'Early Guest Arrival',
            timestamp: Date.now()
        };

        addEarlyFee(feeRecord);
        syncService.publish({ type: 'EARLY_FEE', record: feeRecord });

        const updated = rooms.map(r => (
            r.id === roomId
                ? {
                    ...r,
                    status: 'occupied',
                    notes: `Early Check-in ($${fee}) - ${guestName || 'Early Arrival'}`,
                    cleaningStartedAt: null
                }
                : r
        ));

        persistRooms(updated, true);
        playChime(659.25, 0.3);
        showToast(`Collected $${fee} early fee — Suite ${roomId} occupied`, 'fa-hand-holding-dollar text-emerald-400');
    };

    const handleConfirmQc = (roomId) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedNotes = target.notes ? `${target.notes} | QC Passed (${timeStr})` : `QC Passed (${timeStr})`;

        const updated = rooms.map(r => (
            r.id === roomId
                ? { ...r, status: 'clean', notes: updatedNotes, cleaningStartedAt: null }
                : r
        ));

        persistRooms(updated, true);
        playChime(659.25, 0.25);
        showToast(`Suite ${roomId} certified Clean & Ready`, 'fa-circle-check text-emerald-400');
    };

    const handleCheckout = (roomId, guestName) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        const entry = {
            id: 'CO_' + Date.now(),
            roomId: target.id,
            roomType: target.type,
            floor: target.floor,
            guestName: guestName || '',
            timestamp: Date.now()
        };
        const updatedLog = appendCheckout(entry);
        setCheckoutLog([...updatedLog]);

        const updated = rooms.map(r => (
            r.id === roomId ? { ...r, status: 'dirty', notes: '', cleaningStartedAt: null } : r
        ));

        persistRooms(updated, false);

        syncService.publish({
            type: 'ROOM_UPDATE',
            roomId: target.id,
            status: 'dirty',
            notes: '',
            cleaningStartedAt: null
        });
        syncService.publish({
            type: 'CHECKOUT_LOG_SYNC',
            log: updatedLog
        });

        playChime(523.25, 0.2);
        showToast(
            `Suite ${roomId} checked out${guestName ? ` — ${guestName}` : ''}. Queued for turnover.`,
            'fa-right-from-bracket text-blue-400'
        );
    };

    const handleClearCheckoutLog = () => {
        saveCheckoutLog([]);
        setCheckoutLog([]);
        syncService.publish({ type: 'CHECKOUT_LOG_SYNC', log: [] });
    };

    const handleOpenKeycardForRoom = (roomId = null) => {
        setKeycardRoomId(roomId);
        setIsKeycardSleeveOpen(true);
    };

    const filteredRooms = useMemo(() => {
        const list = rooms.filter(r => {
            const matchFloor = currentFloor === 'ALL' || String(r.floor) === String(currentFloor);
            const matchWing = currentWing === 'ALL' || (r.wing || '').trim() === currentWing;
            const matchStatus = currentStatusFilter === 'ALL' ||
                (currentStatusFilter === 'maintenance'
                    ? (r.status === 'maintenance' || r.status === 'dnd')
                    : r.status === currentStatusFilter);
            const query = searchQuery.trim().toLowerCase();
            const matchSearch = !query ||
                String(r.id).includes(query) ||
                (r.notes && r.notes.toLowerCase().includes(query)) ||
                (r.wing && r.wing.toLowerCase().includes(query)) ||
                r.type.toLowerCase().includes(query);

            return matchFloor && matchWing && matchStatus && matchSearch;
        });

        return [...list].sort((a, b) => {
            if (sortBy === 'priority') {
                const rankDiff = (PRIORITY_SORT_ORDER[a.status] ?? 9) - (PRIORITY_SORT_ORDER[b.status] ?? 9);
                return rankDiff !== 0 ? rankDiff : a.id - b.id;
            }
            if (sortBy === 'floor') {
                const floorDiff = Number(a.floor) - Number(b.floor);
                return floorDiff !== 0 ? floorDiff : a.id - b.id;
            }
            return a.id - b.id;
        });
    }, [rooms, currentFloor, currentWing, currentStatusFilter, searchQuery, sortBy]);

    const activeQcRoom = useMemo(() => rooms.find(r => r.id === qcModalRoomId), [rooms, qcModalRoomId]);
    const activeEditRoom = useMemo(() => rooms.find(r => r.id === editModalRoomId), [rooms, editModalRoomId]);
    const dict = i18n[currentLang] || i18n.en;

    return (
        <div className="flex min-h-screen flex-col font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
                Skip to suites
            </a>

            <Header
                activeView={activeView}
                setActiveView={handleSetViewMode}
                currentLang={currentLang}
                toggleLanguage={handleToggleLanguage}
                cloudStatus={cloudStatus}
                forceCloudResync={handleForceResync}
                onOpenEarlyCheckin={() => setIsEarlyCheckinOpen(true)}
            />

            <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-4 py-5 outline-none sm:px-6">
                {activeView !== 'audit' && (
                    <StatsBar
                        rooms={rooms}
                        inventory={inventory}
                        currentStatusFilter={currentStatusFilter}
                        onStatusFilter={handleStatusFilter}
                        currentLang={currentLang}
                        activeView={activeView}
                        todayEarlyTotal={todayEarlyTotal}
                        onOpenImport={() => setIsRoomListOpen(true)}
                        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
                        onOpenKeycardSleeve={() => handleOpenKeycardForRoom(null)}
                        onOpenShiftReport={() => setIsShiftReportOpen(true)}
                        onOpenAddRoom={() => setIsAddRoomOpen(true)}
                    />
                )}

                {activeView === 'desk' && (
                    <>
                        <FilterControls
                            currentFloor={currentFloor}
                            setFloor={setCurrentFloor}
                            currentWing={currentWing}
                            setWing={setCurrentWing}
                            currentStatusFilter={currentStatusFilter}
                            resetFilters={handleResetFilters}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            viewLayout={viewLayout}
                            setViewLayout={setViewLayout}
                            onWalkInMatch={handleWalkInMatch}
                            rooms={rooms}
                            filteredCount={filteredRooms.length}
                            currentLang={currentLang}
                        />

                        {filteredRooms.length > 0 ? (
                            <>
                                <DeskView
                                    rooms={filteredRooms}
                                    currentLang={currentLang}
                                    viewLayout={viewLayout}
                                    onChangeStatus={handleChangeStatusDirect}
                                    onOpenQc={(id) => setQcModalRoomId(id)}
                                    onOpenEdit={(id) => setEditModalRoomId(id)}
                                    onOpenKeycard={(id) => handleOpenKeycardForRoom(id)}
                                    onCheckout={handleCheckout}
                                />
                                <CheckoutLog
                                    log={checkoutLog}
                                    onClear={handleClearCheckoutLog}
                                    currentLang={currentLang}
                                />
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                    <i className="fa-solid fa-magnifying-glass text-sm"></i>
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">{dict.noMatchesTitle}</h3>
                                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                                    {dict.noMatchesDesc}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="mt-4 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                    {dict.showAllSuites}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeView === 'housekeeping' && (
                    <HousekeepingView
                        rooms={rooms}
                        currentLang={currentLang}
                        onChangeStatus={handleChangeStatusDirect}
                        onOpenQc={(id) => setQcModalRoomId(id)}
                        onOpenEdit={(id) => setEditModalRoomId(id)}
                        onCheckout={handleCheckout}
                    />
                )}

                {activeView === 'audit' && (
                    <AuditView onOpenMemo={() => setIsMemoModalOpen(true)} />
                )}
            </main>

            <footer className="mt-auto border-t border-slate-200 bg-white py-3 text-xs text-slate-500">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-4 sm:flex-row sm:px-6">
                    <span>RoomSync Pro &middot; 3101 Sage Rd, Houston, TX</span>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            OYO #90631
                        </a>
                        <a
                            href="https://oyo.theroyeffect.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            Property Portal
                        </a>
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                            <span className={`h-1.5 w-1.5 rounded-full ${cloudStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {cloudStatus.connected ? 'Synced' : 'Local'}
                        </span>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <ShiftSummaryModal
                isOpen={isShiftReportOpen}
                onClose={() => setIsShiftReportOpen(false)}
                rooms={rooms}
                inventory={inventory}
                checkoutLog={checkoutLog}
                todayEarlyFees={todayEarlyFees}
                onCopy={showToast}
            />

            <ExecutiveMemoModal
                isOpen={isMemoModalOpen}
                onClose={() => setIsMemoModalOpen(false)}
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
                defaultRoomId={keycardRoomId ?? rooms[0]?.id ?? 101}
            />

            <EditRoomModal
                isOpen={Boolean(editModalRoomId)}
                roomId={editModalRoomId}
                room={activeEditRoom}
                onClose={() => setEditModalRoomId(null)}
                onSave={handleSaveEdit}
                currentLang={currentLang}
            />

            <RoomListModal
                isOpen={isRoomListOpen}
                onClose={() => setIsRoomListOpen(false)}
                inventory={inventory}
                onImport={handleImportRoomList}
                onResetModel={() => setIsResetConfirmOpen(true)}
            />

            <AddRoomModal
                isOpen={isAddRoomOpen}
                onClose={() => setIsAddRoomOpen(false)}
                onAddRoom={handleAddRoom}
                existingRoomIds={rooms.map(r => r.id)}
                existingFloors={rooms.map(r => r.floor)}
            />

            {/* Inline Reset Confirmation Modal (replaces native window.confirm) */}
            {isResetConfirmOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reset-confirm-title"
                    className="animate-fadeIn fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsResetConfirmOpen(false); }}
                >
                    <div className="animate-scaleIn w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div>
                            <h3 id="reset-confirm-title" className="text-base font-bold text-slate-900">
                                Restore Working Model?
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                {inventory.source === 'imported'
                                    ? 'This replaces your imported suite list with the 30-suite working model across every synced device.'
                                    : 'This resets all suite statuses and notes back to the default 30-suite working model across every synced device.'}
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsResetConfirmOpen(false)}
                                className="cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmResetModel}
                                className="cursor-pointer rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                            >
                                Restore Model
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast toast={toast} />
        </div>
    );
}
