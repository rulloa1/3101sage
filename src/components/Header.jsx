import React, { useState, useEffect } from 'react';
import { i18n } from '../constants/i18n';

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
        <header className="glass-header text-white shadow-xl sticky top-0 z-50 border-b border-slate-800/80">
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
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative px-2.5 py-1.5 rounded-xl bg-white border border-rose-200/90 flex items-center justify-center shadow-lg shadow-rose-950/40">
                            <img src="assets/oyo-logo.png" alt="OYO" className="h-6 w-auto object-contain" />
                        </div>
                    </a>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black tracking-tight leading-tight text-white flex items-center gap-1.5">
                                <span>RoomSync</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-500/25 to-amber-400/10 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded-full font-mono shadow-xs">PRO</span>
                            </h1>
                            
                            {/* Real-time Cloud Connection Badge */}
                            <button 
                                onClick={forceCloudResync} 
                                title="Click to refresh cloud sync"
                                className={`cursor-pointer text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1.5 transition hover:brightness-125 ${
                                    cloudStatus.connected 
                                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60' 
                                        : 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${cloudStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                                <span>{cloudStatus.label}</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                            <i className="fa-solid fa-location-dot text-rose-400 text-[11px]"></i>
                            <span>3101 Sage Rd</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 font-medium">Galleria</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-indigo-200 font-semibold">{liveTime}</span>
                        </p>
                    </div>
                </div>

                {/* VIEW TOGGLES & ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Early Check-In Monetizer */}
                    <button 
                        onClick={onOpenEarlyCheckin}
                        className="cursor-pointer text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-bold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Monetize Early Check-In ($25-$35)"
                    >
                        <i className="fa-solid fa-hand-holding-dollar text-emerald-400"></i>
                        <span className="hidden lg:inline">Early Check-In ($)</span>
                    </button>

                    {/* Keycard Sleeve & Direct Booking Generator */}
                    <button 
                        onClick={onOpenKeycardSleeve}
                        className="cursor-pointer text-xs bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 font-bold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Print Wi-Fi & Keycard Sleeve (Save OTA Commission)"
                    >
                        <i className="fa-solid fa-qrcode text-indigo-400"></i>
                        <span className="hidden xl:inline">Keycard Sleeve</span>
                    </button>

                    {/* Live OYO Listing Link */}
                    <a 
                        href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 font-bold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Open Live OYO Listing (#90631)"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span className="hidden sm:inline">OYO #90631</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>

                    {/* Shift Report Button */}
                    <button 
                        onClick={onOpenShiftReport}
                        className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                    >
                        <i className="fa-solid fa-clipboard-list text-amber-400"></i>
                        <span className="hidden md:inline">{dict.shiftReportBtn}</span>
                    </button>

                    {/* English / Spanish Switcher */}
                    <button 
                        onClick={toggleLanguage}
                        className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 font-bold transition flex items-center gap-1.5 shadow-sm text-slate-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                    >
                        <i className="fa-solid fa-language text-indigo-400 text-sm"></i>
                        <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
                    </button>

                    {/* Navigation Tabs */}
                    <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex text-xs font-bold shadow-inner">
                        <button 
                            onClick={() => setActiveView('desk')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                                activeView === 'desk' 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <i className="fa-solid fa-desktop text-xs"></i>
                            <span>{dict.frontDeskTab}</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('housekeeping')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                                activeView === 'housekeeping' 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <i className="fa-solid fa-broom text-xs"></i>
                            <span>{dict.housekeepingTab}</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('audit')}
                            className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                                activeView === 'audit' 
                                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                                    : 'text-amber-400 hover:text-amber-200'
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
