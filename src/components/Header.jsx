import React, { useState, useEffect } from 'react';
import { i18n } from '../constants/i18n';
import { OYO_LOGO, OYO_LISTING_URL } from '../constants/brand';

const actionBase =
    'cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-[11px] font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

function NavTabs({ activeView, onChange, dict, className = '' }) {
    const tabs = [
        { id: 'desk', label: dict.frontDeskTab, icon: 'fa-desktop', active: 'bg-indigo-600 text-white shadow-sm' },
        { id: 'housekeeping', label: dict.housekeepingTab, icon: 'fa-broom', active: 'bg-indigo-600 text-white shadow-sm' },
        { id: 'audit', label: 'Audit', icon: 'fa-triangle-exclamation', active: 'bg-amber-400 text-slate-950 shadow-sm' },
    ];

    return (
        <div
            role="tablist"
            aria-label="Switch operations view"
            className={`flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 shadow-inner ${className}`}
        >
            {tabs.map((tab) => {
                const isActive = activeView === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.id)}
                        className={`cursor-pointer flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                            isActive ? tab.active : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <i className={`fa-solid ${tab.icon} text-[11px] ${
                            tab.id === 'audit' && !isActive ? 'text-amber-400' : ''
                        }`}></i>
                        <span className="truncate">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function ActionButtons({ onOpenEarlyCheckin, onOpenKeycardSleeve, onOpenShiftReport, dict, labeled = false }) {
    const labelClass = labeled ? '' : 'hidden xl:inline';

    return (
        <>
            <button
                type="button"
                onClick={onOpenEarlyCheckin}
                className={`${actionBase} border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 focus-visible:ring-emerald-400`}
                aria-label={dict.earlyCheckin}
                title="Monetize early check-in ($25–$35 fee)"
            >
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className={labelClass}>{dict.earlyCheckin}</span>
            </button>

            <button
                type="button"
                onClick={onOpenKeycardSleeve}
                className={`${actionBase} border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 focus-visible:ring-indigo-400`}
                aria-label="Keycard sleeve"
                title="Print Wi-Fi & keycard sleeve (avoid OTA commission)"
            >
                <i className="fa-solid fa-qrcode"></i>
                <span className={labelClass}>Keycard</span>
            </button>

            <button
                type="button"
                onClick={onOpenShiftReport}
                className={`${actionBase} border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 focus-visible:ring-amber-400`}
                aria-label={dict.shiftReportBtn}
                title="Generate the shift summary report"
            >
                <i className="fa-solid fa-clipboard-list"></i>
                <span className={labelClass}>{dict.shiftReportBtn}</span>
            </button>

            <a
                href={OYO_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionBase} border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 focus-visible:ring-rose-400`}
                aria-label="Open OYO listing 90631"
                title="Open the live OYO listing (#90631)"
            >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                <span className={labelClass}>OYO #90631</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-80"></i>
            </a>

            <a
                href="https://oyo.theroyeffect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionBase} border-slate-500/30 bg-white/5 text-amber-300 hover:bg-white/10 focus-visible:ring-amber-400`}
                aria-label="Open OYO property portal"
                title="Open the OYO property operations portal"
            >
                <i className="fa-solid fa-globe"></i>
                <span className={labelClass}>Portal</span>
            </a>
        </>
    );
}

export default function Header({
    activeView,
    setActiveView,
    currentLang,
    toggleLanguage,
    cloudStatus,
    forceCloudResync,
    onOpenShiftReport,
    onOpenEarlyCheckin,
    onOpenKeycardSleeve,
    inventorySource,
    onOpenRoomList
}) {
    const [liveTime, setLiveTime] = useState('--:--');

    // The clock only shows hours and minutes, so wake up on the minute boundary
    // instead of re-rendering the whole header once a second all shift.
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

    const languageButton = (
        <button
            type="button"
            onClick={toggleLanguage}
            aria-label={currentLang === 'en' ? 'Switch to Spanish' : 'Switch to English'}
            title={currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-slate-100 transition hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
            <i className="fa-solid fa-language text-indigo-400 text-sm"></i>
            <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
        </button>
    );

    return (
        <header className="glass-header sticky top-0 z-40 border-b border-white/10 text-white shadow-2xl shadow-slate-950/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
                    {/* Brand & property identity */}
                    <div className="flex min-w-0 items-center gap-3">
                        <a
                            href={OYO_LISTING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block flex-shrink-0"
                            title="OYO Hotel & Apartments Houston Galleria (#90631)"
                        >
                            <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-400 opacity-70 blur-xs transition duration-300 group-hover:opacity-100"></span>
                            <span className="relative flex items-center justify-center rounded-xl border border-rose-100/90 bg-white px-2.5 py-1.5 shadow-lg shadow-rose-950/40">
                                <img src={OYO_LOGO} alt="OYO" width="175" height="90" className="h-5 w-auto object-contain" />
                            </span>
                        </a>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="flex items-center gap-1.5 text-lg font-black leading-none tracking-tight text-white">
                                    <span>RoomSync</span>
                                    <span className="rounded-full border border-rose-400/40 bg-gradient-to-r from-rose-500/25 to-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-rose-300">
                                        Pro
                                    </span>
                                </h1>

                                {inventorySource === 'model' && (
                                    <button
                                        type="button"
                                        onClick={onOpenRoomList}
                                        title="This inventory is a working model — load the owner's real room list"
                                        className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                    >
                                        <i className="fa-solid fa-triangle-exclamation text-[9px]"></i>
                                        <span>Model data</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={forceCloudResync}
                                    title={cloudStatus.connected ? 'Cloud sync live — click to force a re-sync' : 'Reconnecting — click to retry now'}
                                    className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                                        cloudStatus.connected
                                            ? 'border-emerald-700/60 bg-emerald-950/80 text-emerald-400 focus-visible:ring-emerald-400'
                                            : 'border-amber-700/60 bg-amber-950/80 text-amber-400 focus-visible:ring-amber-400'
                                    }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${cloudStatus.connected ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`}></span>
                                    <span>{cloudStatus.label}</span>
                                </button>
                            </div>

                            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] font-medium text-slate-400">
                                <i className="fa-solid fa-location-dot text-rose-400"></i>
                                <span className="text-slate-300">3101 Sage Rd</span>
                                <span className="text-slate-600">•</span>
                                <span>Houston, TX</span>
                                <span className="text-slate-600">•</span>
                                <span className="font-mono font-semibold text-indigo-200">{liveTime}</span>
                            </p>
                        </div>
                    </div>

                    {/* Desktop controls */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <ActionButtons
                            onOpenEarlyCheckin={onOpenEarlyCheckin}
                            onOpenKeycardSleeve={onOpenKeycardSleeve}
                            onOpenShiftReport={onOpenShiftReport}
                            dict={dict}
                        />
                        <span className="mx-0.5 h-6 w-px bg-white/10"></span>
                        {languageButton}
                        <NavTabs activeView={activeView} onChange={setActiveView} dict={dict} />
                    </div>
                </div>

                {/* Compact controls: tablets & phones */}
                <div className="flex flex-col gap-2 pb-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <NavTabs activeView={activeView} onChange={setActiveView} dict={dict} className="flex-1" />
                        {languageButton}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5">
                        <ActionButtons
                            onOpenEarlyCheckin={onOpenEarlyCheckin}
                            onOpenKeycardSleeve={onOpenKeycardSleeve}
                            onOpenShiftReport={onOpenShiftReport}
                            dict={dict}
                            labeled
                        />
                        <span className="sr-only">Property tools</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
