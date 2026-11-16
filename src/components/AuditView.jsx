import React, { useState } from 'react';
import oyoLogo from '../assets/oyo-logo.png';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';
import hotelSuite from '../assets/hotel-suite.jpg';
import hotelPool from '../assets/hotel-pool.jpg';
import hotelFrontDeskParc from '../assets/hotel-front-desk-parc.jpg';
import hotelGarageEntrance from '../assets/hotel-garage-entrance.jpg';

export default function AuditView() {
    const [earlyPerDay, setEarlyPerDay] = useState(3);
    const [directPerMonth, setDirectPerMonth] = useState(8);
    const [minsSavedPerRoom, setMinsSavedPerRoom] = useState(12);

    // Dynamic Financial ROI Calculations
    const annualEarly = earlyPerDay * 25 * 365;
    const annualOtaSaved = Math.round(directPerMonth * 12 * 144 * 0.18);
    const annualHoursSaved = Math.round((minsSavedPerRoom * 14 * 365) / 60);
    const annualTotal = annualEarly + annualOtaSaved;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Banner with Real Hotel Architecture Background */}
            <div className="relative overflow-hidden bg-paper-100 text-paper-50 p-6 sm:p-8 rounded-lg shadow-xl border border-gold-600/40">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#1c1a17]/95 to-[#3a2a12]/90"></div>
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase font-extrabold tracking-wider bg-black/40 border border-gold-500/50 text-gold-200 px-3 py-1 rounded-full shadow-xs">
                            Property Operations & Brand Audit
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-paper-50">
                            3101 Sage Rd — Brand Conflict & Revenue Report
                        </h2>
                        <p className="text-xs sm:text-sm text-paper-200/75 mt-1 max-w-xl leading-relaxed">
                            Executive findings on listing fragmentation, OTA commission leakage, and operations turnover ROI for hotel ownership.
                        </p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md p-4 rounded border border-gold-300 text-center shadow-lg">
                        <div className="text-xs font-bold text-gold-200">OTA Commission Rate</div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-600">18% – 22%</div>
                        <div className="text-[10px] text-stone-500">Lost on 3rd party bookings</div>
                    </div>
                </div>
            </div>

            {/* 3-Way Brand Identity Mismatch Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="panel panel-raise space-y-2.5 border-brand-300 p-5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center justify-between">
                        <span>Physical Signage on Door</span>
                        <i className="fa-solid fa-door-open text-rose-600"></i>
                    </div>
                    <div className="text-lg font-black text-ink">"PARC HOTEL"</div>
                    <p className="text-xs text-stone-500">The actual garage check-in entrance door is boldly labeled <strong>"PARC HOTEL"</strong> with drive-up front desk windows.</p>
                    <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ OYO & OTA guests pull in and think they have the wrong hotel
                    </div>
                </div>

                <div className="panel panel-raise space-y-2.5 border-paper-300 p-5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                        <span>Franchise Network</span>
                        <i className="fa-solid fa-globe text-rose-500"></i>
                    </div>
                    <div className="text-lg font-black text-ink">"OYO Hotel Houston Galleria"</div>
                    <p className="text-xs text-stone-500">Listed on OYO corporate app and Expedia network under official Property #90631.</p>
                    <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Credit card chargebacks when bill name doesn't match entrance
                    </div>
                </div>

                <div className="panel panel-raise space-y-2.5 border-paper-300 p-5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                        <span>OTA & Legacy Listings</span>
                        <i className="fa-brands fa-google text-blue-500"></i>
                    </div>
                    <div className="text-lg font-black text-ink">"Stellar Stay / Galleria Garden"</div>
                    <p className="text-xs text-stone-500">Listed on Booking.com / Agoda as "Stellar Stay" with legacy Google Maps pins.</p>
                    <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Splits review volume (3.7★) and pays 18%–22% commission
                    </div>
                </div>
            </div>

            {/* LIVE OYO #90631 OTA METADATA CARD */}
            <div className="panel space-y-4 rounded-lg border-brand-300 bg-gradient-to-br from-brand-600/[0.08] via-transparent to-gold-500/[0.07] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-2 rounded-lg bg-white border border-[#d8cdb9] flex items-center justify-center shadow-lg shadow-sm">
                            <img src={oyoLogo} alt="OYO" className="h-6 w-auto object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-extrabold text-ink">Live OTA Channel Data (Property #90631)</h3>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">Verified</span>
                            </div>
                            <p className="text-xs text-stone-500">3101 Sage Rd, Houston, TX 77056 • Galleria</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <a 
                            href="https://www.oyorooms.com/us/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer text-xs font-semibold text-stone-800 bg-stone-900/[0.045] hover:bg-stone-900/[0.08] border border-paper-300 px-3 py-2 rounded-md transition active:scale-95 flex items-center gap-1.5"
                            title="Browse OYO US National Portal"
                        >
                            <i className="fa-solid fa-globe text-rose-500 text-xs"></i>
                            <span>OYO US Portal</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-stone-500"></i>
                        </a>
                        <a 
                            href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary px-3.5 py-2"
                            title="Open direct live listing for Property #90631"
                        >
                            <span>Open Property #90631</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="panel-inset p-3">
                        <div className="text-[10px] uppercase font-bold text-stone-500">OTA Price</div>
                        <div className="text-base font-black text-brand-400 mt-0.5">$132 <span className="text-[11px] font-medium text-stone-500">/ night</span></div>
                        <div className="text-[10px] text-stone-500 mt-0.5">$154 after taxes ($188 base)</div>
                    </div>
                    <div className="panel-inset p-3">
                        <div className="text-[10px] uppercase font-bold text-stone-500">Guest Rating</div>
                        <div className="text-base font-black text-amber-600 mt-0.5 flex items-center gap-1">
                            <i className="fa-solid fa-star text-amber-600 text-xs"></i> 3.7 <span className="text-[11px] font-medium text-stone-500">/ 5.0</span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">17 verified reviews</div>
                    </div>
                    <div className="panel-inset p-3">
                        <div className="text-[10px] uppercase font-bold text-stone-500">Hours Policy</div>
                        <div className="text-xs font-black text-stone-900 mt-1">Check-in: 3:00 PM</div>
                        <div className="text-[11px] font-bold text-stone-500">Checkout: 11:00 AM</div>
                    </div>
                    <div className="panel-inset p-3">
                        <div className="text-[10px] uppercase font-bold text-stone-500">Listed Room Categories</div>
                        <ul className="text-[11px] font-bold text-stone-700 mt-1 space-y-0.5 list-disc list-inside">
                            <li>2 Queen Beds</li>
                            <li>Queen Bed</li>
                            <li>Full bed with Twin</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* PROPERTY PHOTO SHOWCASE (ACTUAL 3101 SAGE PHOTOGRAPHY) */}
            <div className="panel space-y-5 rounded-lg p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                            <i className="fa-solid fa-camera"></i>
                            <span>Verified Property Visual Assets</span>
                        </span>
                        <h3 className="text-base font-extrabold text-ink">Actual 3101 Sage Rd Photography (On-Site & OYO #90631)</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>On-Site Field Inspection & Channel Verified</span>
                    </span>
                </div>

                {/* Ground Arrival & Physical Door Signage (The Brand Conflict Proof) */}
                <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Physical Arrival Evidence — Garage Front Desk Signage</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Parc Hotel Check-in Door */}
                        <div className="relative group overflow-hidden rounded-lg h-60 border-2 border-brand-500/40 shadow-2xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelFrontDeskParc})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-slate-50">
                                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs flex items-center gap-1 w-max">
                                    <i className="fa-solid fa-magnifying-glass"></i> Physical Door Evidence
                                </span>
                                <h4 className="text-sm sm:text-base font-black mt-1.5 text-slate-50">Garage Front Desk Door ("PARC HOTEL")</h4>
                                <p className="text-[11px] text-stone-800 leading-snug mt-0.5">
                                    Physical entrance door is boldly signed <strong>"PARC HOTEL"</strong> alongside drive-up office service windows & red geometric accent wall.
                                </p>
                            </div>
                        </div>

                        {/* Covered Garage Entrance */}
                        <div className="relative group overflow-hidden rounded-lg h-60 border border-paper-300 shadow-2xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelGarageEntrance})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-slate-50">
                                <span className="bg-white text-gold-700 border border-gold-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-lg w-max">
                                    Ground Operations
                                </span>
                                <h4 className="text-sm sm:text-base font-black mt-1.5 text-slate-50">Covered Garage Drive-In Entrance</h4>
                                <p className="text-[11px] text-stone-800 leading-snug mt-0.5">
                                    Driveway entry with speed limit 5 MPH safety lanes leading directly into the covered front desk check-in bay.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building Architecture & Guest Amenities */}
                <div className="pt-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-hotel"></i>
                        <span>Property Facade & Guest Amenities</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Facade Photo */}
                        <div className="relative group overflow-hidden rounded-lg h-52 border border-paper-300 shadow-xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelHeroBg})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-slate-50">
                                <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                                    Property Facade
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-slate-50">3101 Sage Rd Exterior</h4>
                                <p className="text-[11px] text-stone-800">Porte-cochère entrance & guest parking</p>
                            </div>
                        </div>

                        {/* Suite Photo */}
                        <div className="relative group overflow-hidden rounded-lg h-52 border border-paper-300 shadow-xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelSuite})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-slate-50">
                                <span className="bg-white text-gold-700 border border-gold-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-lg">
                                    Guest Suite
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-slate-50">Actual Room Suite Interior</h4>
                                <p className="text-[11px] text-stone-800">2 Queen & 1 Queen bed layouts with kitchenette</p>
                            </div>
                        </div>

                        {/* Pool Photo */}
                        <div className="relative group overflow-hidden rounded-lg h-52 border border-paper-300 shadow-xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelPool})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-slate-50">
                                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                                    Courtyard Pool
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-slate-50">Outdoor Swimming Pool</h4>
                                <p className="text-[11px] text-stone-800">On-site recreation courtyard for guests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Plan to Hand to Owner */}
            <div className="panel space-y-4 rounded-lg p-6">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-emerald-600"></i> 3-Step Remediation Plan for Ownership
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3.5 bg-stone-900/[0.03] border border-paper-200 rounded-lg flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold-500 text-ink font-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                        <div>
                            <strong className="text-stone-900">Bridge Garage Signage & Consolidate Google Business Profile:</strong>
                            <p className="text-stone-500 text-xs mt-0.5">Add an OYO brand plaque alongside the physical <em>"PARC HOTEL"</em> garage door, and unify Google Maps into one verified listing: <em>"Parc Hotel & Suites, an OYO Hotel - Houston Galleria"</em>. This unifies all review stars and ends lost arrivals.</p>
                        </div>
                    </div>
                    <div className="p-3.5 bg-stone-900/[0.03] border border-paper-200 rounded-lg flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold-500 text-ink font-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                        <div>
                            <strong className="text-stone-900">Sync Merchant Billing & OTA Channel Manager:</strong>
                            <p className="text-stone-500 text-xs mt-0.5">Align Booking.com, Expedia, and credit card merchant terminal descriptors to <em>"PARC HOTEL / OYO 90631"</em> so guest credit card statements match the physical door, stopping chargebacks before they happen.</p>
                        </div>
                    </div>
                    <div className="p-3.5 bg-stone-900/[0.03] border border-paper-200 rounded-lg flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold-500 text-ink font-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                        <div>
                            <strong className="text-stone-900">Deploy RoomSync for Turnover:</strong>
                            <p className="text-stone-500 text-xs mt-0.5">Give housekeepers 1-tap English/Spanish status buttons to eliminate 20+ daily phone calls to the desk.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE OWNER ROI & BUSINESS VALUE CALCULATOR */}
            <div className="relative overflow-hidden text-ink p-6 sm:p-8 rounded-lg border border-slate-800 shadow-2xl space-y-6">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-[2px]"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-600/[0.14]"></div>

                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-600 font-extrabold flex items-center gap-1.5">
                            <i className="fa-solid fa-calculator"></i>
                            <span>Financial Impact Calculator for 3101 Sage</span>
                        </div>
                        <h3 className="text-xl font-black text-ink mt-1">Projected Annual Profit & Savings</h3>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-700 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                        ROI: Immediate
                    </span>
                </div>

                {/* Calculator Controls */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80">
                        <label className="block text-xs font-bold text-stone-700 mb-1">Early Check-ins Monetized / Day</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="1" 
                                max="8" 
                                value={earlyPerDay} 
                                onChange={(e) => setEarlyPerDay(parseInt(e.target.value, 10))}
                                className="w-full accent-amber-500 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-amber-600 font-mono min-w-[28px] text-right">{earlyPerDay}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">At $25 standard early fee</p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80">
                        <label className="block text-xs font-bold text-stone-700 mb-1">Direct Repeat Bookings / Month</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="2" 
                                max="25" 
                                value={directPerMonth} 
                                onChange={(e) => setDirectPerMonth(parseInt(e.target.value, 10))}
                                className="w-full accent-brand-500 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-brand-400 font-mono min-w-[28px] text-right">{directPerMonth}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Bypassing 18% OTA commission</p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80">
                        <label className="block text-xs font-bold text-stone-700 mb-1">Minutes Saved per Room Clean</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="5" 
                                max="20" 
                                value={minsSavedPerRoom} 
                                onChange={(e) => setMinsSavedPerRoom(parseInt(e.target.value, 10))}
                                className="w-full accent-emerald-400 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-emerald-600 font-mono min-w-[28px] text-right">{minsSavedPerRoom}m</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Reduced phone tag & checks</p>
                    </div>
                </div>

                {/* Dynamic Results Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
                    <div className="bg-paper-50 p-4 rounded-lg border border-amber-200">
                        <div className="text-[10px] uppercase font-bold text-amber-600/80">Annual Early Check-In Revenue</div>
                        <div className="text-2xl font-black text-amber-700 font-mono mt-1">+${annualEarly.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">Pure found profit</div>
                    </div>

                    <div className="bg-paper-50 p-4 rounded-lg border border-brand-300">
                        <div className="text-[10px] uppercase font-bold text-brand-400/80">Annual OTA Commission Saved</div>
                        <div className="text-2xl font-black text-brand-300 font-mono mt-1">+${annualOtaSaved.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">Kept in property bank</div>
                    </div>

                    <div className="bg-paper-50 p-4 rounded-lg border border-emerald-200">
                        <div className="text-[10px] uppercase font-bold text-emerald-600/80">Housekeeping Hours Saved</div>
                        <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{annualHoursSaved.toLocaleString()} hrs</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">Faster 3PM check-in readiness</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 p-4 rounded-lg border border-amber-400/50">
                        <div className="text-[10px] uppercase font-black text-amber-700">Total Net Impact / Year</div>
                        <div className="text-2xl font-black text-ink font-mono mt-1">+${annualTotal.toLocaleString()}</div>
                        <div className="text-[10px] text-amber-200 mt-0.5 font-bold">Payback period: Instant</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
