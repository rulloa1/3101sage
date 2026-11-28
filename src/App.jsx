import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import ReadinessBar from './components/ReadinessBar';
import StatsBar from './components/StatsBar';
import InventoryNotice from './components/InventoryNotice';
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
    // 1. STATE INITIALIZATION
    // One record carries the rooms plus their provenance ('model' | 'imported'),
    // so the UI can never show invented suite numbers as if they were the owner's.
    const [inventory, setInventory] = useState(readInventory);
    const rooms = inventory.rooms;
    const meta = inventoryMeta(inventory);

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
    const [isRoomListOpen, setIsRoomListOpen] = useState(false);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [qcModalRoomId, setQcModalRoomId] = useState(null);
    const [editModalRoomId, setEditModalRoomId] = useState(null);

    // Today's early check-in fees, kept as records (not just a total) so the
    // shift report can itemise the revenue that was actually collected.
    const [earlyFees, setEarlyFees] = useState(readEarlyFees);
    const todayEarlyFees = selectTodayFees(earlyFees);
    const todayEarlyTotal = sumTodayFees(earlyFees);

    // Latest-value refs so the sync listeners never need to be rebuilt
    // (rebuilding them used to reconnect the cloud socket on every room change).
    const inventoryRef = useRef(inventory);
    const roomsRef = useRef(rooms);
    const langRef = useRef(currentLang);
    inventoryRef.current = inventory;
    roomsRef.current = rooms;
    langRef.current = currentLang;
    const dict = i18n[currentLang] || i18n.en;

    // Checkout log
    const [checkoutLog, setCheckoutLog] = useState(() => loadCheckoutLog());

    // 2. TOAST HELPER
    const showToast = useCallback((message, icon = 'fa-circle-check text-emerald-400') => {
        setToast({ visible: true, message, icon });
        clearTimeout(window._reactToastTimer);
        window._reactToastTimer = setTimeout(() => {
            setToast({ visible: false, message: '', icon: '' });
        }, 2500);
    }, []);

    // 3. PERSISTENCE (rooms + provenance written as one record)
    useEffect(() => {
        writeInventory(inventory);
    }, [inventory]);

    // Keep the document language in step with the UI toggle so screen readers
    // and browser translation announce Spanish content as Spanish.
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

    // 4. REAL-TIME SYNC & WEBSOCKET SETUP (mount once)
    useEffect(() => {
        syncService.init();

        const unsubscribeStatus = syncService.subscribeStatus((connected, label) => {
            setCloudStatus({ connected, label });
        });

        const unsubscribeSync = syncService.subscribe((data) => {
            if (!data) return;

            if (data.type === 'SYNC_REQUEST') {
                // Reply with current snapshot without stale-closure risk
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
                showToast("Synced with property network!", "fa-tower-broadcast text-emerald-400");
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
                showToast(`Room ${data.roomId} updated to ${cfg.label}!`, cfg.icon + ' ' + (cfg.text));
                playChime(587.33, 0.2);
                return;
            }

            if (data.type === 'EARLY_FEE' && data.record) {
                addEarlyFee(data.record);
                showToast(`Early check-in logged for Room ${data.record.roomId}`, "fa-hand-holding-dollar text-emerald-400");
            }

            if (data.type === 'CHECKOUT_LOG_SYNC' && Array.isArray(data.log)) {
                setCheckoutLog(data.log);
                saveCheckoutLog(data.log);
            }
        });

        // Cross-window storage listener (the record key carries rooms + provenance)
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

        // Escape key to dismiss any open modal
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsShiftReportOpen(false);
                setIsEarlyCheckinOpen(false);
                setIsKeycardSleeveOpen(false);
                setIsRoomListOpen(false);
                setIsResetConfirmOpen(false);
                setIsMemoModalOpen(false);
                setIsAddRoomOpen(false);
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
        showToast("Syncing with cloud network...", "fa-rotate text-indigo-400");
        // connectCloud triggers a SYNC_REQUEST in its onopen handler; publishing
        // here as well would send the snapshot twice.
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

    // Native window.confirm is blocked in some embedded and kiosk browsers, and
    // it is the one destructive action here, so it gets a real dialog.
    const openResetConfirm = () => setIsResetConfirmOpen(true);

    const handleConfirmResetModel = () => {
        applyInventory(createModelInventory());
        setIsRoomListOpen(false);
        setIsResetConfirmOpen(false);
        showToast(dict.toastModelRestored, 'fa-rotate-left text-amber-400');
    };

    const handleAddRoom = (newRoom) => {
        const updated = [...rooms, newRoom].sort((a, b) => a.id - b.id);
        persistRooms(updated, true);
        playChime(659.25, 0.25);
        showToast(`Room ${newRoom.id} added to inventory!`, 'fa-circle-plus text-amber-500');
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

        // A handyman dispatch is not a plain edit: say what actually happened.
        const dispatched = newStatus === 'maintenance'
            && /handyman alerted/i.test(newNotes)
            && !/handyman alerted/i.test(target.notes || '');
        const cfg = getStatusConfig(newStatus, currentLang);
        if (dispatched) {
            showToast(`Handyman alert sent — Room ${roomId} marked ${cfg.label}`, 'fa-screwdriver-wrench text-amber-400');
        } else {
            showToast(`Room ${roomId} updated!`, 'fa-floppy-disk text-indigo-400');
        }
    };

    const handleConfirmEarlyCheckin = (roomId, fee, guestName) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) {
            showToast("That room is no longer available", "fa-triangle-exclamation text-rose-400");
            return;
        }

        const feeRecord = {
            id: 'EF_' + Date.now() + '_' + roomId,
            roomId: target.id,
            fee,
            guest: guestName || "Early Guest Arrival",
            timestamp: Date.now()
        };

        addEarlyFee(feeRecord);
        syncService.publish({ type: 'EARLY_FEE', record: feeRecord });

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

    const handleCheckout = (roomId, guestName) => {
        const target = rooms.find(r => r.id === roomId);
        if (!target) return;

        // Log the checkout
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

        // Flip room to dirty and clear notes
        const updated = rooms.map(r => {
            if (r.id === roomId) {
                return { ...r, status: 'dirty', notes: '', cleaningStartedAt: null };
            }
            return r;
        });

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
            `Room ${roomId} checked out${guestName ? ` — ${guestName}` : ''}. Queued for housekeeping.`,
            'fa-right-from-bracket text-blue-400'
        );
    };

    const handleClearCheckoutLog = () => {
        saveCheckoutLog([]);
        setCheckoutLog([]);
        syncService.publish({ type: 'CHECKOUT_LOG_SYNC', log: [] });
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
        <div className="app-shell flex min-h-screen bg-[#0a0d14] font-sans antialiased selection:bg-brass-500/25">
            {/* Desktop Left Sidebar */}
            <div className="hidden lg:block lg:flex-shrink-0">
                <div className="sticky top-0 h-screen">
                    <Sidebar
                        activeView={activeView}
                        setActiveView={handleSetViewMode}
                        onOpenShiftReport={() => setIsShiftReportOpen(true)}
                        onOpenKeycardSleeve={() => setIsKeycardSleeveOpen(true)}
                        onOpenRoomList={() => setIsRoomListOpen(true)}
                        onOpenEarlyCheckin={() => setIsEarlyCheckinOpen(true)}
                        cloudStatus={cloudStatus}
                        forceCloudResync={handleForceResync}
                    />
                </div>
            </div>

            {/* Mobile Slide-over Drawer */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 flex bg-black/75 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div
                        className="relative w-64 max-w-[85%] bg-[#0d1017] shadow-2xl h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="absolute right-3 top-3 text-stone-400 hover:text-white z-10"
                            aria-label="Close menu"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                        <Sidebar
                            activeView={activeView}
                            setActiveView={(view) => {
                                handleSetViewMode(view);
                                setIsMobileSidebarOpen(false);
                            }}
                            onOpenShiftReport={() => {
                                setIsShiftReportOpen(true);
                                setIsMobileSidebarOpen(false);
                            }}
                            onOpenKeycardSleeve={() => {
                                setIsKeycardSleeveOpen(true);
                                setIsMobileSidebarOpen(false);
                            }}
                            onOpenRoomList={() => {
                                setIsRoomListOpen(true);
                                setIsMobileSidebarOpen(false);
                            }}
                            onOpenEarlyCheckin={() => {
                                setIsEarlyCheckinOpen(true);
                                setIsMobileSidebarOpen(false);
                            }}
                            cloudStatus={cloudStatus}
                            forceCloudResync={handleForceResync}
                            onClose={() => setIsMobileSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Main Area: TopNav + Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                <TopNav
                    activeView={activeView}
                    setActiveView={handleSetViewMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenEarlyCheckin={() => setIsEarlyCheckinOpen(true)}
                    onOpenShiftReport={() => setIsShiftReportOpen(true)}
                    currentLang={currentLang}
                    toggleLanguage={handleToggleLanguage}
                    onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
                />

                {/* Sub-header Progress & Stats (Desk view only) */}
                {activeView === 'desk' && (
                    <>
                        <ReadinessBar rooms={rooms} currentLang={currentLang} />
                        <StatsBar
                            rooms={rooms}
                            currentStatusFilter={currentStatusFilter}
                            onStatusFilter={handleStatusFilter}
                            currentLang={currentLang}
                        />
                        <InventoryNotice
                            inventory={inventory}
                            onOpenImport={() => setIsRoomListOpen(true)}
                            onResetModel={openResetConfirm}
                        />
                        <FilterControls
                            currentFloor={currentFloor}
                            setFloor={setCurrentFloor}
                            currentStatusFilter={currentStatusFilter}
                            resetFilters={handleResetFilters}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onWalkInMatch={handleWalkInMatch}
                            onOpenAddRoom={() => setIsAddRoomOpen(true)}
                            onResetDemo={openResetConfirm}
                            rooms={rooms}
                        />
                    </>
                )}

                {/* MAIN CONTENT AREA */}
                <main id="main-content" tabIndex={-1} className={`mx-auto w-full flex-1 outline-none ${activeView === 'housekeeping' ? 'max-w-[1550px] p-3 sm:p-5' : 'max-w-7xl px-4 py-6 sm:px-6'}`}>
                    {activeView === 'desk' && (
                        filteredRooms.length > 0 ? (
                            <>
                                <DeskView
                                    rooms={filteredRooms}
                                    currentLang={currentLang}
                                    onChangeStatus={handleChangeStatusDirect}
                                    onOpenQc={(id) => setQcModalRoomId(id)}
                                    onOpenEdit={(id) => setEditModalRoomId(id)}
                                    onCheckout={handleCheckout}
                                />
                                <div className="mt-5">
                                    <CheckoutLog
                                        log={checkoutLog}
                                        onClear={handleClearCheckoutLog}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="my-6 rounded-xl border border-dashed border-white/10 bg-[#141924] px-6 py-16 text-center shadow-soft">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-400">
                                    <i className="fa-solid fa-magnifying-glass text-sm"></i>
                                </div>
                                <h3 className="font-display text-[21px] leading-tight tracking-tight text-white">No suites match this view</h3>
                                <p className="mx-auto mt-1.5 max-w-sm text-[11.5px] leading-relaxed text-stone-400">
                                    Try a different floor, status, or search term.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="mt-4 cursor-pointer rounded-md bg-[#e5c05b] px-4 py-2 text-[11px] font-bold text-slate-950 transition hover:brightness-110 active:scale-[0.98]"
                                >
                                    Show all suites
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
                            onCheckout={handleCheckout}
                            searchFilter={searchQuery}
                        />
                    )}

                    {activeView === 'audit' && (
                        <AuditView onOpenMemo={() => setIsMemoModalOpen(true)} />
                    )}
                </main>

                {/* FOOTER */}
                <footer className="mt-auto border-t border-white/10 bg-[#0d1017] py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-4 sm:flex-row sm:px-6">
                        <span>RoomSync Pro &middot; Operational Suite &middot; 3101 Sage Rd</span>
                        <span className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${cloudStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            {cloudStatus.connected ? 'Multi-tab & cloud synced' : 'Local mode — reconnecting'}
                        </span>
                    </div>
                </footer>
            </div>

            {/* MODALS */}
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
                defaultRoomId={rooms[0]?.id ?? 101}
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
                onResetModel={openResetConfirm}
            />

            <AddRoomModal
                isOpen={isAddRoomOpen}
                onClose={() => setIsAddRoomOpen(false)}
                onAddRoom={handleAddRoom}
                existingRoomIds={rooms.map(r => r.id)}
                existingFloors={rooms.map(r => r.floor)}
            />

            {isResetConfirmOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reset-confirm-title"
                    aria-describedby="reset-confirm-description"
                    className="animate-fadeIn fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsResetConfirmOpen(false); }}
                >
                    <div className="animate-scaleIn w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#141924] text-white shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-6 pb-4 pt-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-lg text-amber-400">
                                    <i className="fa-solid fa-rotate-left"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                                        {dict.resetDialogEyebrow}
                                    </p>
                                    <h3 id="reset-confirm-title" className="mt-1 font-display text-[21px] leading-none text-white">
                                        {dict.resetDialogTitle}
                                    </h3>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsResetConfirmOpen(false)}
                                aria-label={dict.resetDialogClose}
                                className="flex-shrink-0 cursor-pointer rounded-lg p-1.5 text-stone-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <i className="fa-solid fa-xmark text-[13px]"></i>
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <p id="reset-confirm-description" className="text-[12px] leading-relaxed text-stone-300">
                                {inventory.source === 'imported'
                                    ? dict.resetDialogDescImported
                                    : dict.resetDialogDescModel}
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-[#171c2b] px-6 py-3">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setIsResetConfirmOpen(false)}
                                className="cursor-pointer rounded-xl border border-white/10 bg-[#1b2230] px-4 py-2 text-[11px] font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
                            >
                                {dict.resetDialogCancel}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmResetModel}
                                className="cursor-pointer rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] px-4 py-2 text-[11px] font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.99]"
                            >
                                {dict.resetDialogConfirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING TOAST NOTIFICATION */}
            <Toast toast={toast} />
        </div>
    );
}
