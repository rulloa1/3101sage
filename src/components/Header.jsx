import React, { useState, useEffect } from 'react';
import { i18n } from '../constants/i18n';
import { OYO_LOGO, OYO_LISTING_URL } from '../constants/brand';

export default function Header({
    activeView,
    setActiveView,
    currentLang,
    toggleLanguage,
    cloudStatus,
    forceCloudResync,
    onOpenEarlyCheckin
}) {
    const [liveTime, setLiveTime] = useState('--:--');

    useEffect(() => {
        let timer;
        const updateClock = () => {
            const now = new Date();
            setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        const scheduleNextMinute = () => {
            timer = setTimeout(() => {
                updateClock();
                scheduleNextMinute();
            }, 60000 - (Date.now() % 60000));
        };
        updateClock();
        scheduleNextMinute();
        return () => clearTimeout(timer);
    }, []);

    const dict = i18n[currentLang] || i18n.en;

    const tabs = [
        { id: 'desk', label: dict.frontDeskTab, icon: 'fa-table-cells-large' },
        { id: 'housekeeping', label: dict.housekeepingTab, icon: 'fa-broom' },
        { id: 'audit', label: dict.auditTab, icon: 'fa-chart-line' }
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
                    {/* Left: Brand & Property Identity */}
                    <div className="flex min-w-0 items-center gap-3">
                        <a
                            href={OYO_LISTING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-shrink-0 items-center rounded-lg border border-slate-200 bg-white px-2 py-1 transition hover:border-slate-300"
                            title="OYO Hotel & Apartments Houston Galleria (#90631)"
                        >
                            <img
                                src={OYO_LOGO}
                                alt="OYO"
                                width="175"
                                height="90"
                                className="h-4 w-auto object-contain sm:h-5"
                            />
                        </a>

                        <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                                <h1 className="truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
                                    RoomSync
                                </h1>
                                <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                                    3101 Sage Rd &middot; Houston
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Primary View Navigation (Desktop) */}
                    <nav
                        role="tablist"
                        aria-label="Operations view"
                        className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1 md:flex"
                    >
                        {tabs.map((tab) => {
                            const isActive = activeView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveView(tab.id)}
                                    className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <i className={`fa-solid ${tab.icon} text-[11px] ${isActive ? 'text-slate-900' : 'text-slate-400'}`}></i>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right: Clock, Sync, Language & Primary Action */}
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <span className="hidden font-mono text-xs font-semibold text-slate-500 tabular-nums lg:inline">
                            {liveTime}
                        </span>

                        <button
                            type="button"
                            onClick={forceCloudResync}
                            title={cloudStatus.connected ? 'Synced across devices — click to refresh' : 'Reconnecting — click to retry'}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    cloudStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                aria-hidden="true"
                            ></span>
                            <span className="hidden xl:inline">{cloudStatus.label}</span>
                            <i className="fa-solid fa-rotate text-[10px] text-slate-400 xl:hidden"></i>
                        </button>

                        <button
                            type="button"
                            onClick={toggleLanguage}
                            aria-label={currentLang === 'en' ? 'Switch to Spanish' : 'Switch to English'}
                            title={currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
                            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                        >
                            <i className="fa-solid fa-language text-slate-400"></i>
                            <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={onOpenEarlyCheckin}
                            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                        >
                            <i className="fa-solid fa-key text-[11px] text-emerald-400"></i>
                            <span className="hidden sm:inline">{dict.earlyCheckin}</span>
                            <span className="sm:hidden">Early</span>
                        </button>
                    </div>
                </div>

                {/* Mobile View Navigation (Single compact row) */}
                <div className="flex border-t border-slate-100 py-1.5 md:hidden">
                    <nav role="tablist" aria-label="Operations view" className="grid w-full grid-cols-3 gap-1">
                        {tabs.map((tab) => {
                            const isActive = activeView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveView(tab.id)}
                                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <i className={`fa-solid ${tab.icon} text-[11px]`}></i>
                                    <span className="truncate">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}
