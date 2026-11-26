import React from 'react';
import { OYO_LOGO } from '../constants/brand';

export default function Sidebar({
    activeView,
    setActiveView,
    onOpenShiftReport,
    onOpenKeycardSleeve,
    onOpenRoomList,
    onOpenEarlyCheckin,
    cloudStatus,
    forceCloudResync,
    isOpen = true,
    onClose
}) {
    const navItems = [
        { id: 'desk', label: 'Front Desk', icon: 'fa-bell-concierge' },
        { id: 'housekeeping', label: 'Housekeeping', icon: 'fa-broom' },
        { id: 'audit', label: 'Property Audit', icon: 'fa-clipboard-list' },
        { id: 'guests', label: 'Guests & Bookings', icon: 'fa-users', action: onOpenKeycardSleeve },
        { id: 'reports', label: 'Reports', icon: 'fa-chart-column', action: onOpenShiftReport },
        { id: 'settings', label: 'Settings', icon: 'fa-gear', action: onOpenRoomList },
    ];

    const handleSelect = (item) => {
        if (item.action) {
            item.action();
        } else {
            setActiveView(item.id);
        }
        if (onClose) onClose();
    };

    return (
        <aside className="flex h-full w-56 flex-col justify-between border-r border-white/10 bg-[#0d1017] p-4 text-stone-300">
            {/* Top Brand Identity */}
            <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-auto items-center justify-center rounded-sm bg-white px-1.5 py-0.5">
                        <img src={OYO_LOGO} alt="OYO" className="h-4 w-auto object-contain" />
                    </span>
                    <div>
                        <div className="font-display text-[17px] font-bold leading-none tracking-tight text-white">
                            RoomSync Pro<sup className="text-[10px] font-sans font-normal text-stone-400">™</sup>
                        </div>
                    </div>
                </div>

                {/* Cloud Edition Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#e5c05b]">
                    <i className="fa-solid fa-cloud text-[10px]"></i>
                    <span>&bull; CLOUD EDITION &bull;</span>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5 pt-2" aria-label="Operations Navigation">
                    {navItems.map((item) => {
                        const isActive = activeView === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                                    isActive
                                        ? 'border border-[#d4af37] bg-gradient-to-r from-[#d4af37]/25 via-[#d4af37]/15 to-transparent text-[#e5c05b] shadow-[0_0_15px_rgba(212,175,55,0.18)]'
                                        : 'text-stone-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <i className={`fa-solid ${item.icon} w-4 text-center text-xs ${
                                    isActive ? 'text-[#e5c05b]' : 'text-stone-500'
                                }`}></i>
                                <span className="tracking-wide">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Ornament & Cloud Live Indicator */}
            <div className="space-y-2 pt-4">
                {/* 3D Flowing Gold Waves Ribbon */}
                <svg className="h-14 w-full opacity-75 overflow-visible" viewBox="0 0 180 50" fill="none">
                    <path d="M0 40 C 45 10, 110 50, 180 15" stroke="url(#sidebarGoldGrad)" strokeWidth="1.8" />
                    <path d="M0 45 C 55 20, 125 45, 180 25" stroke="url(#sidebarGoldGrad)" strokeWidth="1.3" opacity="0.65" />
                    <path d="M0 50 C 65 30, 120 40, 180 35" stroke="url(#sidebarGoldGrad)" strokeWidth="0.8" opacity="0.35" />
                    <defs>
                        <linearGradient id="sidebarGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="50%" stopColor="#f7e6a6" />
                            <stop offset="100%" stopColor="#b8861e" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Cloud Live Indicator */}
                <button
                    type="button"
                    onClick={forceCloudResync}
                    title="Click to force cloud synchronization"
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/5 bg-[#141923] px-3 py-2 text-xs font-semibold text-stone-300 transition hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-cloud text-amber-400/90 text-xs"></i>
                        <span className="text-[11px] text-stone-300">Cloud Live</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                </button>
            </div>
        </aside>
    );
}
