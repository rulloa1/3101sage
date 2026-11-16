import React, { useState, useEffect } from 'react';
import { i18n } from '../constants/i18n';
import oyoLogo from '../assets/oyo-logo.png';

export default function Header({
    activeView,
    setActiveView,
    currentLang,
    toggleLanguage,
    cloudStatus,
    forceCloudResync,
    onOpenShiftReport,
    onOpenEarlyCheckin,
    onOpenKeycardSleeve
}) {
    const [liveTime, setLiveTime] = useState('--:--');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const dict = i18n[currentLang];

    return (
        <header className="glass-header sticky top-0 z-50 border-b border-paper-300 text-ink shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                {/* Brand & Property Details */}
                <div className="flex items-center space-x-3.5">
                    {/* Official OYO Brand Badge */}
                    <a 
                        href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative group cursor-pointer flex-shrink-0 block" 
                        title="OYO Hotel & Apartments Houston Galleria (#90631)"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/50 via-brand-400/40 to-gold-400/50 rounded blur-[2px] opacity-60 group-hover:opacity-90 transition duration-300"></div>
                        <div className="relative px-2.5 py-1.5 rounded bg-white border border-paper-300 flex items-center justify-center shadow-sm">
                            <img src={oyoLogo} alt="OYO" className="h-6 w-auto object-contain" />
                        </div>
                    </a>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold tracking-tight leading-tight text-ink flex items-center gap-1.5">
                                <span>RoomSync</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] bg-brand-600/[0.08] text-brand-700 border border-brand-300 px-2 py-0.5 rounded-full font-mono">PRO</span>
                            </h1>
                            
                            {/* Real-time Cloud Connection Badge */}
                            <button 
                                onClick={forceCloudResync} 
                                title="Click to refresh cloud sync"
                                className={`cursor-pointer text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 transition hover:brightness-125 ${
                                    cloudStatus.connected 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                                        : 'bg-amber-50 text-amber-700 border border-amber-300'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${cloudStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                <span>{cloudStatus.label}</span>
                            </button>
                        </div>
                        <p className="text-xs text-stone-700 font-medium flex items-center gap-1.5 mt-0.5">
                            <i className="fa-solid fa-location-dot text-rose-600 text-[11px]"></i>
                            <span>3101 Sage Rd</span>
                            <span className="text-stone-500">•</span>
                            <span className="font-medium text-stone-500">Galleria</span>
                            <span className="text-stone-500">•</span>
                            <span className="font-semibold text-gold-700">{liveTime}</span>
                        </p>
                    </div>
                </div>

                {/* VIEW TOGGLES & ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Early Check-In Monetizer */}
                    <button 
                        onClick={onOpenEarlyCheckin}
                        className="cursor-pointer text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold px-2.5 py-2 rounded transition flex items-center gap-1.5 active:scale-95"
                        title="Monetize Early Check-In ($25-$35)"
                    >
                        <i className="fa-solid fa-hand-holding-dollar text-emerald-600"></i>
                        <span className="hidden lg:inline">Early Check-In ($)</span>
                    </button>

                    {/* Keycard Sleeve & Direct Booking Generator */}
                    <button 
                        onClick={onOpenKeycardSleeve}
                        className="cursor-pointer text-xs bg-gold-50 hover:bg-gold-50 text-gold-700 border border-gold-300 font-bold px-2.5 py-2 rounded-md transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Print Wi-Fi & Keycard Sleeve (Save OTA Commission)"
                    >
                        <i className="fa-solid fa-qrcode text-gold-600"></i>
                        <span className="hidden xl:inline">Keycard Sleeve</span>
                    </button>

                    {/* Live OYO Listing Link */}
                    <a 
                        href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer text-xs bg-brand-600/[0.07] hover:bg-brand-600/[0.12] text-brand-700 border border-brand-300 font-bold px-2.5 py-2 rounded transition flex items-center gap-1.5 active:scale-95"
                        title="Open Live OYO Listing (#90631)"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        <span className="hidden sm:inline">OYO #90631</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>

                    {/* Shift Report Button */}
                    <button 
                        onClick={onOpenShiftReport}
                        className="cursor-pointer text-xs bg-stone-900/[0.045] hover:bg-stone-900/[0.08] text-gold-700 border border-paper-300 font-bold px-3 py-2 rounded-md transition flex items-center gap-1.5 shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none"
                    >
                        <i className="fa-solid fa-clipboard-list text-amber-600"></i>
                        <span className="hidden md:inline">{dict.shiftReportBtn}</span>
                    </button>

                    {/* English / Spanish Switcher */}
                    <button 
                        onClick={toggleLanguage}
                        className="cursor-pointer text-xs bg-stone-900/[0.045] hover:bg-stone-900/[0.08] px-3 py-2 rounded-md border border-paper-300 font-bold transition flex items-center gap-1.5 shadow-sm text-stone-900 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none"
                    >
                        <i className="fa-solid fa-language text-brand-400 text-sm"></i>
                        <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
                    </button>

                    {/* Navigation Tabs */}
                    <div className="bg-paper-100 p-1 rounded-md border border-paper-300 flex text-xs font-bold shadow-inner backdrop-blur">
                        <button 
                            onClick={() => setActiveView('desk')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none ${
                                activeView === 'desk' 
                                    ? 'bg-brand-600 text-white shadow-brand-glow' 
                                    : 'text-stone-700 hover:bg-stone-900/[0.045] hover:text-ink'
                            }`}
                        >
                            <i className="fa-solid fa-desktop text-xs"></i>
                            <span>{dict.frontDeskTab}</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('housekeeping')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none ${
                                activeView === 'housekeeping' 
                                    ? 'bg-brand-600 text-white shadow-brand-glow' 
                                    : 'text-stone-700 hover:bg-stone-900/[0.045] hover:text-ink'
                            }`}
                        >
                            <i className="fa-solid fa-broom text-xs"></i>
                            <span>{dict.housekeepingTab}</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('audit')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                                activeView === 'audit' 
                                    ? 'bg-gold-500 text-ink font-black' 
                                    : 'text-gold-700 hover:text-gold-600'
                            }`}
                        >
                            <i className="fa-solid fa-triangle-exclamation text-xs"></i>
                            <span>Audit</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
