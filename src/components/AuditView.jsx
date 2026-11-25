import React, { useState } from 'react';
import { OYO_LOGO } from '../constants/brand';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';
import hotelSuite from '../assets/hotel-suite.jpg';
import hotelPool from '../assets/hotel-pool.jpg';
import hotelFrontDeskParc from '../assets/hotel-front-desk-parc.jpg';
import hotelGarageEntrance from '../assets/hotel-garage-entrance.jpg';

export default function AuditView({ onOpenMemo }) {
    const [earlyPerDay, setEarlyPerDay] = useState(3);
    const [directPerMonth, setDirectPerMonth] = useState(8);
    const [minsSavedPerRoom, setMinsSavedPerRoom] = useState(12);

    // Dynamic Financial ROI Calculations
    const annualEarly = earlyPerDay * 25 * 365;
    const annualOtaSaved = Math.round(directPerMonth * 12 * 144 * 0.18);
    const annualHoursSaved = Math.round((minsSavedPerRoom * 30 * 365) / 60);
    const annualTotal = annualEarly + annualOtaSaved;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Banner with Real Hotel Architecture Background */}
            <div className="relative overflow-hidden rounded-xl border border-ink-900/20 p-6 text-white shadow-panel sm:p-8">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-900/60"></div>
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-xl">
                        <span className="rounded-sm border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-200 backdrop-blur-sm">
                            Property Operations & Brand Audit
                        </span>
                        <h2 className="mt-3 font-display text-[30px] leading-tight tracking-tight text-white sm:text-[36px]">
                            3101 Sage Rd — Brand Conflict & Revenue Report
                        </h2>
                        <p className="mt-2 text-[12px] leading-relaxed text-stone-300 sm:text-[13px]">
                            Executive findings on listing fragmentation, OTA commission leakage, and operations turnover ROI for hotel ownership.
                        </p>
                        
                        {/* Executive Memo Launcher Button */}
                        {onOpenMemo && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={onOpenMemo}
                                    className="flex cursor-pointer items-center gap-2 rounded-md bg-[#f3eee2] px-4 py-2.5 text-[11px] font-semibold text-ink-900 shadow-sm transition hover:bg-[#fbf7ee] active:scale-[0.98]"
                                >
                                    <i className="fa-solid fa-file-contract text-sm"></i>
                                    <span>Open Executive Pitch Proposal (Print / PDF)</span>
                                    <i className="fa-solid fa-arrow-right text-[10px] ml-1"></i>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg border border-white/15 bg-ink-950/60 p-4 text-center backdrop-blur-md">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-200">OTA Commission Rate</div>
                        <div className="mt-1.5 font-display text-[28px] leading-none text-rose-300">18% – 22%</div>
                        <div className="mt-1 text-[10px] text-stone-400">Lost on 3rd party bookings</div>
                    </div>
                </div>
            </div>

            {/* 3-Way Brand Identity Mismatch Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="space-y-2.5 rounded-xl border border-ink-900/[0.08] bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-700">
                        <span>Physical Signage on Door</span>
                        <i className="fa-solid fa-door-open text-rose-600"></i>
                    </div>
                    <div className="font-display text-[21px] leading-tight text-ink-900">"PARC HOTEL"</div>
                    <p className="text-xs text-slate-500">The actual garage check-in entrance door is boldly labeled <strong>"PARC HOTEL"</strong> with drive-up front desk windows.</p>
                    <div className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ OYO & OTA guests pull in and think they have the wrong hotel
                    </div>
                </div>

                <div className="space-y-2.5 rounded-xl border border-ink-900/[0.08] bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                        <span>Franchise Network</span>
                        <i className="fa-solid fa-globe text-rose-500"></i>
                    </div>
                    <div className="font-display text-[21px] leading-tight text-ink-900">"OYO Hotel Houston Galleria"</div>
                    <p className="text-xs text-slate-500">Listed on OYO corporate app and Expedia network under official Property #90631.</p>
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Credit card chargebacks when bill name doesn't match entrance
                    </div>
                </div>

                <div className="space-y-2.5 rounded-xl border border-ink-900/[0.08] bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                        <span>OTA & Legacy Listings</span>
                        <i className="fa-brands fa-google text-blue-500"></i>
                    </div>
                    <div className="font-display text-[21px] leading-tight text-ink-900">"Stellar Stay / Galleria Garden"</div>
                    <p className="text-xs text-slate-500">Listed on Booking.com / Agoda as "Stellar Stay" with legacy Google Maps pins.</p>
                    <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Splits review volume (3.7★) and pays 18%–22% commission
                    </div>
                </div>
            </div>

            {/* LIVE OYO #90631 OTA METADATA CARD */}
            <div className="space-y-4 rounded-xl border border-ink-900/[0.08] bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-md border border-ink-900/[0.08] bg-white px-3 py-2 shadow-xs">
                            <img src={OYO_LOGO} alt="OYO" className="h-6 w-auto object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-display text-[22px] leading-tight text-ink-900">Live OTA Channel Data (Property #90631)</h3>
                                <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800">Verified</span>
                            </div>
                            <p className="text-[11px] text-stone-500">3101 Sage Rd, Houston, TX 77056 • Galleria • 30 suites • 2 floors</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <a 
                            href="https://www.oyorooms.com/us/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-ink-900/[0.12] bg-white px-3 py-2 text-[11px] font-semibold text-ink-900 transition hover:bg-bone-50 active:scale-[0.98]"
                            title="Browse OYO US National Portal"
                        >
                            <i className="fa-solid fa-globe text-rose-500 text-xs"></i>
                            <span>OYO US Portal</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-500"></i>
                        </a>
                        <a 
                            href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ink-900 px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-ink-950 active:scale-[0.98]"
                            title="Open direct live listing for Property #90631"
                        >
                            <span>Open Property #90631</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg border border-ink-900/[0.06] bg-bone-50/60 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">OTA Price</div>
                        <div className="text-base font-black text-rose-700 mt-0.5">$132 <span className="text-[11px] font-medium text-stone-500">/ night</span></div>
                        <div className="text-[10px] text-slate-500 mt-0.5">$154 after taxes ($188 base)</div>
                    </div>
                    <div className="rounded-lg border border-ink-900/[0.06] bg-bone-50/60 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Guest Rating</div>
                        <div className="text-base font-black text-amber-600 mt-0.5 flex items-center gap-1">
                            <i className="fa-solid fa-star text-amber-400 text-xs"></i> 3.7 <span className="text-[11px] font-medium text-stone-500">/ 5.0</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">17 verified reviews</div>
                    </div>
                    <div className="rounded-lg border border-ink-900/[0.06] bg-bone-50/60 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Hours Policy</div>
                        <div className="text-xs font-black text-slate-800 mt-1">Check-in: 3:00 PM</div>
                        <div className="text-[11px] font-bold text-slate-600">Checkout: 11:00 AM</div>
                    </div>
                    <div className="rounded-lg border border-ink-900/[0.06] bg-bone-50/60 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Suite Mix</div>
                        <ul className="text-[11px] font-bold text-slate-700 mt-1 space-y-0.5 list-disc list-inside">
                            <li>1BR Queen Suite</li>
                            <li>2-Queen Suite</li>
                            <li>2BR 2-Queen Suite</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* PROPERTY PHOTO SHOWCASE (ACTUAL 3101 SAGE PHOTOGRAPHY) */}
            <div className="space-y-5 rounded-xl border border-ink-900/[0.08] bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brass-600">
                            <i className="fa-solid fa-camera"></i>
                            <span>Verified Property Visual Assets</span>
                        </span>
                        <h3 className="font-display text-[22px] leading-tight text-ink-900">Actual 3101 Sage Rd Photography (On-Site & OYO #90631)</h3>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-800">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>On-Site Field Inspection & Channel Verified</span>
                    </span>
                </div>

                {/* Ground Arrival & Physical Door Signage (The Brand Conflict Proof) */}
                <div>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-700">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Physical Arrival Evidence — Garage Front Desk Signage</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Parc Hotel Check-in Door */}
                        <div className="group relative h-60 overflow-hidden rounded-lg border border-rose-300/70 shadow-soft">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelFrontDeskParc})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                <span className="flex w-max items-center gap-1 rounded-sm bg-rose-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    <i className="fa-solid fa-magnifying-glass"></i> Physical Door Evidence
                                </span>
                                <h4 className="mt-1.5 font-display text-[18px] leading-snug text-white">Garage Front Desk Door ("PARC HOTEL")</h4>
                                <p className="mt-0.5 text-[10.5px] leading-snug text-stone-300">
                                    Physical entrance door is boldly signed <strong>"PARC HOTEL"</strong> alongside drive-up office service windows & red geometric accent wall.
                                </p>
                            </div>
                        </div>

                        {/* Covered Garage Entrance */}
                        <div className="group relative h-60 overflow-hidden rounded-lg border border-ink-900/[0.1] shadow-soft">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelGarageEntrance})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                <span className="w-max rounded-sm bg-ink-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    Ground Operations
                                </span>
                                <h4 className="mt-1.5 font-display text-[18px] leading-snug text-white">Covered Garage Drive-In Entrance</h4>
                                <p className="mt-0.5 text-[10.5px] leading-snug text-stone-300">
                                    Driveway entry with speed limit 5 MPH safety lanes leading directly into the covered front desk check-in bay.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building Architecture & Guest Amenities */}
                <div className="pt-2">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                        <i className="fa-solid fa-hotel"></i>
                        <span>Property Facade & Guest Amenities</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Facade Photo */}
                        <div className="group relative h-52 overflow-hidden rounded-lg border border-ink-900/[0.08] shadow-xs">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelHeroBg})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="rounded-sm bg-brass-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    Property Facade
                                </span>
                                <h4 className="mt-1 font-display text-[16px] leading-snug text-white">3101 Sage Rd Exterior</h4>
                                <p className="text-[11px] text-slate-300">Porte-cochère entrance & guest parking</p>
                            </div>
                        </div>

                        {/* Suite Photo */}
                        <div className="group relative h-52 overflow-hidden rounded-lg border border-ink-900/[0.08] shadow-xs">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelSuite})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="rounded-sm bg-ink-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    Guest Suite
                                </span>
                                <h4 className="mt-1 font-display text-[16px] leading-snug text-white">Actual Room Suite Interior</h4>
                                <p className="text-[11px] text-slate-300">2 Queen & 1 Queen bed layouts with kitchenette</p>
                            </div>
                        </div>

                        {/* Pool Photo */}
                        <div className="group relative h-52 overflow-hidden rounded-lg border border-ink-900/[0.08] shadow-xs">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelPool})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="rounded-sm bg-emerald-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    Courtyard Pool
                                </span>
                                <h4 className="mt-1 font-display text-[16px] leading-snug text-white">Outdoor Swimming Pool</h4>
                                <p className="text-[11px] text-slate-300">On-site recreation courtyard for guests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Plan to Hand to Owner */}
            <div className="space-y-4 rounded-xl border border-ink-900/[0.08] bg-white p-6 shadow-soft">
                <h3 className="flex items-center gap-2 font-display text-[22px] leading-tight text-ink-900">
                    <i className="fa-solid fa-list-check text-[16px] text-emerald-600"></i> 3-Step Remediation Plan for Ownership
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-3 rounded-lg bg-bone-50 p-3.5">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-white">1</span>
                        <div>
                            <strong className="text-ink-900">Bridge Garage Signage & Consolidate Google Business Profile:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Add an OYO brand plaque alongside the physical <em>"PARC HOTEL"</em> garage door, and unify Google Maps into one verified listing: <em>"Parc Hotel & Suites, an OYO Hotel - Houston Galleria"</em>. This unifies all review stars and ends lost arrivals.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-bone-50 p-3.5">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-white">2</span>
                        <div>
                            <strong className="text-ink-900">Sync Merchant Billing & OTA Channel Manager:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Align Booking.com, Expedia, and credit card merchant terminal descriptors to <em>"PARC HOTEL / OYO 90631"</em> so guest credit card statements match the physical door, stopping chargebacks before they happen.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-bone-50 p-3.5">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-white">3</span>
                        <div>
                            <strong className="text-ink-900">Deploy RoomSync for Turnover:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Give housekeepers 1-tap English/Spanish status buttons to eliminate 20+ daily phone calls to the desk.</p>
                        </div>
                    </div>
                </div>

                {/* Printable Memorandum Action Banner */}
                {onOpenMemo && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-900/[0.06] bg-bone-100/70 p-4">
                        <div>
                            <h4 className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-900">
                                <i className="fa-solid fa-file-pdf text-brass-600"></i>
                                <span>Presenting to Hotel Ownership?</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Generate a formal, print-ready 1-page proposal memo with financial ROI tables and photo evidence.</p>
                        </div>
                        <button
                            type="button"
                            onClick={onOpenMemo}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ink-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-ink-950 active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>View & Print Proposal Memo</span>
                        </button>
                    </div>
                )}
            </div>

            {/* INTERACTIVE OWNER ROI & BUSINESS VALUE CALCULATOR */}
            <div className="relative space-y-6 overflow-hidden rounded-xl border border-ink-900/30 bg-ink-950 p-6 text-white shadow-panel sm:p-8">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-xs"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/95 to-ink-900/90"></div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brass-300">
                            <i className="fa-solid fa-calculator"></i>
                            <span>Financial Impact Calculator for 3101 Sage</span>
                        </div>
                        <h3 className="mt-1 font-display text-[24px] leading-tight text-white">Projected Annual Profit & Savings</h3>
                    </div>
                    <span className="rounded-sm border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                        ROI: Immediate
                    </span>
                </div>

                {/* Calculator Controls */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">Early Check-ins Monetized / Day</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="1" 
                                max="8" 
                                value={earlyPerDay} 
                                onChange={(e) => setEarlyPerDay(parseInt(e.target.value, 10))}
                                className="w-full accent-amber-500 cursor-pointer" 
                            />
                            <span className="min-w-[28px] text-right font-display text-[20px] leading-none text-brass-300">{earlyPerDay}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-stone-400">At $25 standard early fee</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">Direct Repeat Bookings / Month</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="2" 
                                max="25" 
                                value={directPerMonth} 
                                onChange={(e) => setDirectPerMonth(parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-400 cursor-pointer" 
                            />
                            <span className="min-w-[28px] text-right font-display text-[20px] leading-none text-sky-300">{directPerMonth}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-stone-400">Bypassing 18% OTA commission</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">Minutes Saved per Room Clean</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="5" 
                                max="20" 
                                value={minsSavedPerRoom} 
                                onChange={(e) => setMinsSavedPerRoom(parseInt(e.target.value, 10))}
                                className="w-full accent-emerald-400 cursor-pointer" 
                            />
                            <span className="min-w-[28px] text-right font-display text-[20px] leading-none text-emerald-300">{minsSavedPerRoom}m</span>
                        </div>
                        <p className="mt-1 text-[10px] text-stone-400">Reduced phone tag & checks</p>
                    </div>
                </div>

                {/* Dynamic Results Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brass-300/90">Annual Early Check-In Revenue</div>
                        <div className="mt-1 font-display text-[26px] leading-none text-brass-200">+${annualEarly.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Pure found profit</div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300/90">Annual OTA Commission Saved</div>
                        <div className="mt-1 font-display text-[26px] leading-none text-sky-200">+${annualOtaSaved.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Kept in property bank</div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300/90">Housekeeping Hours Saved</div>
                        <div className="mt-1 font-display text-[26px] leading-none text-emerald-200">{annualHoursSaved.toLocaleString()} hrs</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Faster 3PM check-in readiness</div>
                    </div>

                    <div className="rounded-lg border border-brass-400/40 bg-brass-400/[0.08] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brass-200">Total Net Impact / Year</div>
                        <div className="mt-1 font-display text-[26px] leading-none text-white">+${annualTotal.toLocaleString()}</div>
                        <div className="mt-0.5 text-[10px] font-medium text-brass-200/90">Payback period: Instant</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
