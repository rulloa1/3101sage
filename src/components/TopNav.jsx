import React, { useState } from 'react';
import { OYO_LISTING_URL } from '../constants/brand';

export default function TopNav({
    searchQuery,
    setSearchQuery,
    onOpenEarlyCheckin,
    onOpenShiftReport,
    currentLang,
    toggleLanguage,
    onToggleSidebar
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#0d1017]/95 px-4 backdrop-blur-md sm:px-6">
            {/* Left: Mobile Sidebar Toggle + Location Pill */}
            <div className="flex items-center gap-3">
                {onToggleSidebar && (
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-white/5 hover:text-white lg:hidden"
                        aria-label="Toggle Navigation Sidebar"
                    >
                        <i className="fa-solid fa-bars text-sm"></i>
                    </button>
                )}

                <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#141923] px-3 py-1.5 text-xs font-semibold text-stone-200">
                    <i className="fa-solid fa-location-dot text-amber-400 text-xs"></i>
                    <span>3101 Sage Rd &bull; Houston, TX</span>
                    <i className="fa-solid fa-chevron-down text-[10px] text-stone-500 ml-1"></i>
                </div>
            </div>

            {/* Center: Search Box */}
            <div className="mx-4 hidden max-w-md flex-1 md:block">
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-2.5 text-xs text-stone-500"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search room, staff, or task..."
                        className="w-full rounded-xl border border-white/10 bg-[#141923] py-2 pl-9 pr-4 text-xs font-medium text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-400/50 focus:bg-[#1a2130] focus:ring-1 focus:ring-amber-400/30"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-2 text-xs text-stone-400 hover:text-white"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Notifications, Help, Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Language Switch */}
                <button
                    type="button"
                    onClick={toggleLanguage}
                    title="Toggle Language (EN/ES)"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-[#141923] text-[11px] font-bold text-stone-300 hover:bg-white/10 hover:text-white"
                >
                    {currentLang === 'en' ? 'ES' : 'EN'}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsAlertOpen(!isAlertOpen)}
                        className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/5 bg-[#141923] text-stone-300 transition hover:bg-white/10 hover:text-white"
                        aria-label="Notifications"
                    >
                        <i className="fa-regular fa-bell text-xs"></i>
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white shadow-sm">
                            2
                        </span>
                    </button>

                    {isAlertOpen && (
                        <div className="absolute right-0 top-10 z-50 w-64 animate-fadeIn rounded-xl border border-white/10 bg-[#161c28] p-3 text-xs shadow-2xl">
                            <div className="mb-2 font-display font-bold text-white">Active Alerts</div>
                            <div className="space-y-1.5 text-stone-300">
                                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2">
                                    <div className="font-bold text-red-400">Room 104 • High Priority</div>
                                    <div className="text-[11px] text-stone-400">VIP check-in at 3:00 PM</div>
                                </div>
                                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2">
                                    <div className="font-bold text-orange-400">Room 115 • AC Leak</div>
                                    <div className="text-[11px] text-stone-400">Maintenance dispatched</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Icon */}
                <button
                    type="button"
                    onClick={onOpenShiftReport}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/5 bg-[#141923] text-stone-300 transition hover:bg-white/10 hover:text-white"
                    title="Shift Report & Help"
                    aria-label="Help"
                >
                    <i className="fa-regular fa-circle-question text-xs"></i>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/5 bg-[#141923] py-1.5 pl-2 pr-3 text-xs font-semibold text-stone-200 transition hover:bg-white/10"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-slate-950">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <span className="hidden sm:inline">Property Manager</span>
                        <i className="fa-solid fa-chevron-down text-[9px] text-stone-500"></i>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-11 z-50 w-52 animate-fadeIn rounded-xl border border-white/10 bg-[#161c28] p-2 text-xs shadow-2xl space-y-1">
                            <div className="px-3 py-2 border-b border-white/5 text-[11px] text-stone-400">
                                <div className="font-bold text-white">3101 Sage Rd</div>
                                <div>OYO Property #90631</div>
                            </div>
                            <a
                                href={OYO_LISTING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-stone-300 hover:bg-white/5 hover:text-white"
                            >
                                <span>OYO Listing #90631</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                            <a
                                href="https://oyo.theroyeffect.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-stone-300 hover:bg-white/5 hover:text-white"
                            >
                                <span>Direct Operations Portal</span>
                                <i className="fa-solid fa-globe text-[10px]"></i>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
