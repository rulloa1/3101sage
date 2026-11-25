import React, { useState, useEffect } from 'react';
import { i18n } from '../constants/i18n';
import { OYO_LOGO, OYO_LISTING_URL } from '../constants/brand';

const ghostAction =
    'group inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-stone-300 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-300/70';

function NavTabs({ activeView, onChange, dict, className = '' }) {
    const tabs = [
        { id: 'desk', label: dict.frontDeskTab, icon: 'fa-desktop' },
        { id: 'housekeeping', label: dict.housekeepingTab, icon: 'fa-broom' },
        { id: 'audit', label: 'Audit', icon: 'fa-triangle-exclamation' },
    ];

    return (
        <div
            role="tablist"
            aria-label="Switch operations view"
            className={`flex items-center gap-0.5 ${className}`}
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
                        className={`relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-300/70 sm:flex-none ${
                            isActive ? 'text-white' : 'text-stone-400 hover:text-stone-100'
                        }`}
                    >
                        <i className={`fa-solid ${tab.icon} text-[10px] ${
                            tab.id === 'audit'
                                ? 'text-amber-400/90'
                                : isActive ? 'text-brass-300' : 'text-stone-500'
                        }`}></i>
                        <span>{tab.label}</span>
                        <span
                            aria-hidden="true"
                            className={`absolute inset-x-2.5 -bottom-[7px] h-[2px] rounded-full transition-colors ${
                                isActive ? 'bg-brass-300' : 'bg-transparent'
                            }`}
                        ></span>
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
                className={ghostAction}
                aria-label={dict.earlyCheckin}
                title="Monetize early check-in ($25–$35 fee)"
            >
                <i className="fa-solid fa-hand-holding-dollar text-[11px] text-emerald-300/80"></i>
                <span className={labelClass}>{dict.earlyCheckin}</span>
            </button>

            <button
                type="button"
                onClick={onOpenKeycardSleeve}
                className={ghostAction}
                aria-label="Keycard sleeve"
                title="Print Wi-Fi & keycard sleeve (avoid OTA commission)"
            >
                <i className="fa-solid fa-qrcode text-[11px] text-sky-300/80"></i>
                <span className={labelClass}>Keycard</span>
            </button>

            <button
                type="button"
                onClick={onOpenShiftReport}
                aria-label={dict.shiftReportBtn}
                title="Generate the shift summary report"
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-[#f3eee2] px-3 py-1.5 text-[11px] font-bold text-ink-900 transition hover:bg-[#fbf7ee] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
                <i className="fa-solid fa-clipboard-list text-[11px] text-brass-600"></i>
                <span className={labelClass}>{dict.shiftReportBtn}</span>
            </button>

            <a
                href={OYO_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostAction}
                aria-label="Open OYO listing 90631"
                title="Open the live OYO listing (#90631)"
            >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400/90"></span>
                <span className={labelClass}>OYO #90631</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-500"></i>
            </a>

            <a
                href="https://oyo.theroyeffect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={ghostAction}
                aria-label="Open OYO property portal"
                title="Open the OYO property operations portal"
            >
                <i className="fa-solid fa-globe text-[11px] text-brass-300/80"></i>
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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300 transition hover:border-white/20 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-300/70"
        >
            <i className="fa-solid fa-language text-[12px] text-brass-300/80"></i>
            <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
        </button>
    );

    return (
        <header className="glass-header sticky top-0 z-40 border-b border-white/[0.07] text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-4 pt-3.5">
                    {/* Brand & property identity */}
                    <div className="flex min-w-0 items-center gap-3.5">
                        <a
                            href={OYO_LISTING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block flex-shrink-0"
                            title="OYO Hotel & Apartments Houston Galleria (#90631)"
                        >
                            <span className="relative flex items-center justify-center rounded-md bg-white px-2 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition duration-300 group-hover:shadow-[0_0_0_1px_rgba(212,188,148,0.7)]">
                                <img src={OYO_LOGO} alt="OYO" width="175" height="90" className="h-4 w-auto object-contain" />
                            </span>
                        </a>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                <h1 className="flex items-baseline gap-2.5">
                                    <span className="font-display text-[26px] leading-none tracking-tight text-white">RoomSync</span>
                                    <span className="border-l border-white/15 pl-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brass-300">
                                        Pro
                                    </span>
                                </h1>

                                {inventorySource === 'model' && (
                                    <button
                                        type="button"
                                        onClick={onOpenRoomList}
                                        title="This inventory is a working model — load the owner's real room list"
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-brass-300/30 bg-brass-300/[0.08] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-200 transition hover:border-brass-300/60 hover:text-brass-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-300/70"
                                    >
                                        <i className="fa-solid fa-triangle-exclamation text-[10px]"></i>
                                        <span>Model data</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={forceCloudResync}
                                    title={cloudStatus.connected ? 'Cloud sync live — click to force a re-sync' : 'Reconnecting — click to retry now'}
                                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-300/70 ${
                                        cloudStatus.connected ? 'text-emerald-300/90' : 'text-amber-300/90'
                                    }`}
                                >
                                    <span className={`h-1 w-1 rounded-full ${cloudStatus.connected ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`}></span>
                                    <span>{cloudStatus.label}</span>
                                </button>
                            </div>

                            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
                                <span className="text-stone-300">3101 Sage Rd</span>
                                <span className="text-stone-600">·</span>
                                <span>Houston, TX</span>
                                <span className="text-stone-600">·</span>
                                <span className="tabular-nums text-brass-200/90">{liveTime}</span>
                            </p>
                        </div>
                    </div>

                    {/* Desktop controls */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <div className="flex items-center gap-0.5">
                            <ActionButtons
                                onOpenEarlyCheckin={onOpenEarlyCheckin}
                                onOpenKeycardSleeve={onOpenKeycardSleeve}
                                onOpenShiftReport={onOpenShiftReport}
                                dict={dict}
                            />
                        </div>
                        <span className="h-5 w-px bg-white/10"></span>
                        <NavTabs activeView={activeView} onChange={setActiveView} dict={dict} />
                        {languageButton}
                    </div>
                </div>

                {/* Compact controls: tablets & phones */}
                <div className="flex flex-col gap-2.5 pb-3 lg:hidden">
                    <div className="flex items-center gap-2 border-t border-white/[0.07] pt-2">
                        <NavTabs activeView={activeView} onChange={setActiveView} dict={dict} className="flex-1" />
                        {languageButton}
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
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
