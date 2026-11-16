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
            <div className="relative overflow-hidden text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-amber-500/30">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-amber-950/80"></div>
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase font-extrabold tracking-wider bg-black/40 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full shadow-xs">
                            Property Operations & Brand Audit
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
                            3101 Sage Rd — Brand Conflict & Revenue Report
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                            Executive findings on listing fragmentation, OTA commission leakage, and operations turnover ROI for hotel ownership.
                        </p>
                    </div>
                    <div className="bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 text-center shadow-lg">
                        <div className="text-xs font-bold text-amber-300">OTA Commission Rate</div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-400">18% – 22%</div>
                        <div className="text-[10px] text-slate-400">Lost on 3rd party bookings</div>
                    </div>
                </div>
            </div>

            {/* 3-Way Brand Identity Mismatch Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-rose-200/90 shadow-soft space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center justify-between">
                        <span>Physical Signage on Door</span>
                        <i className="fa-solid fa-door-open text-rose-600"></i>
                    </div>
                    <div className="text-lg font-black text-slate-900">"PARC HOTEL"</div>
                    <p className="text-xs text-slate-500">The actual garage check-in entrance door is boldly labeled <strong>"PARC HOTEL"</strong> with drive-up front desk windows.</p>
                    <div className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ OYO & OTA guests pull in and think they have the wrong hotel
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Franchise Network</span>
                        <i className="fa-solid fa-globe text-rose-500"></i>
                    </div>
                    <div className="text-lg font-black text-slate-800">"OYO Hotel Houston Galleria"</div>
                    <p className="text-xs text-slate-500">Listed on OYO corporate app and Expedia network under official Property #90631.</p>
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Credit card chargebacks when bill name doesn't match entrance
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>OTA & Legacy Listings</span>
                        <i className="fa-brands fa-google text-blue-500"></i>
                    </div>
                    <div className="text-lg font-black text-slate-800">"Stellar Stay / Galleria Garden"</div>
                    <p className="text-xs text-slate-500">Listed on Booking.com / Agoda as "Stellar Stay" with legacy Google Maps pins.</p>
                    <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Splits review volume (3.7★) and pays 18%–22% commission
                    </div>
                </div>
            </div>

            {/* LIVE OYO #90631 OTA METADATA CARD */}
            <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 rounded-3xl border border-rose-200 shadow-soft space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-2 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shadow-md shadow-rose-100">
                            <img src={oyoLogo} alt="OYO" className="h-6 w-auto object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-extrabold text-slate-900">Live OTA Channel Data (Property #90631)</h3>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">Verified</span>
                            </div>
                            <p className="text-xs text-slate-500">3101 Sage Rd, Houston, TX 77056 • Galleria</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <a 
                            href="https://www.oyorooms.com/us/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                            title="Browse OYO US National Portal"
                        >
                            <i className="fa-solid fa-globe text-rose-500 text-xs"></i>
                            <span>OYO US Portal</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-slate-400"></i>
                        </a>
                        <a 
                            href="https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-2 rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
                            title="Open direct live listing for Property #90631"
                        >
                            <span>Open Property #90631</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-xs">
                        <div className="text-[10px] uppercase font-bold text-slate-400">OTA Price</div>
                        <div className="text-base font-black text-rose-700 mt-0.5">$132 <span className="text-[11px] font-medium text-slate-400">/ night</span></div>
                        <div className="text-[10px] text-slate-500 mt-0.5">$154 after taxes ($188 base)</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-xs">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Guest Rating</div>
                        <div className="text-base font-black text-amber-600 mt-0.5 flex items-center gap-1">
                            <i className="fa-solid fa-star text-amber-400 text-xs"></i> 3.7 <span className="text-[11px] font-medium text-slate-400">/ 5.0</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">17 verified reviews</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-xs">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Hours Policy</div>
                        <div className="text-xs font-black text-slate-800 mt-1">Check-in: 3:00 PM</div>
                        <div className="text-[11px] font-bold text-slate-600">Checkout: 11:00 AM</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-xs">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Listed Room Categories</div>
                        <ul className="text-[11px] font-bold text-slate-700 mt-1 space-y-0.5 list-disc list-inside">
                            <li>2 Queen Beds</li>
                            <li>Queen Bed</li>
                            <li>Full bed with Twin</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* PROPERTY PHOTO SHOWCASE (ACTUAL 3101 SAGE PHOTOGRAPHY) */}
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                            <i className="fa-solid fa-camera"></i>
                            <span>Verified Property Visual Assets</span>
                        </span>
                        <h3 className="text-base font-extrabold text-slate-800">Actual 3101 Sage Rd Photography (On-Site & OYO #90631)</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>On-Site Field Inspection & Channel Verified</span>
                    </span>
                </div>

                {/* Ground Arrival & Physical Door Signage (The Brand Conflict Proof) */}
                <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Physical Arrival Evidence — Garage Front Desk Signage</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Parc Hotel Check-in Door */}
                        <div className="relative group overflow-hidden rounded-2xl h-60 border-2 border-rose-300 shadow-md">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelFrontDeskParc})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs flex items-center gap-1 w-max">
                                    <i className="fa-solid fa-magnifying-glass"></i> Physical Door Evidence
                                </span>
                                <h4 className="text-sm sm:text-base font-black mt-1.5 text-white">Garage Front Desk Door ("PARC HOTEL")</h4>
                                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                    Physical entrance door is boldly signed <strong>"PARC HOTEL"</strong> alongside drive-up office service windows & red geometric accent wall.
                                </p>
                            </div>
                        </div>

                        {/* Covered Garage Entrance */}
                        <div className="relative group overflow-hidden rounded-2xl h-60 border border-slate-300 shadow-md">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelGarageEntrance})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>
                            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs w-max">
                                    Ground Operations
                                </span>
                                <h4 className="text-sm sm:text-base font-black mt-1.5 text-white">Covered Garage Drive-In Entrance</h4>
                                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                    Driveway entry with speed limit 5 MPH safety lanes leading directly into the covered front desk check-in bay.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building Architecture & Guest Amenities */}
                <div className="pt-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-hotel"></i>
                        <span>Property Facade & Guest Amenities</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Facade Photo */}
                        <div className="relative group overflow-hidden rounded-2xl h-52 border border-slate-200 shadow-sm">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelHeroBg})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                                    Property Facade
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-white">3101 Sage Rd Exterior</h4>
                                <p className="text-[11px] text-slate-300">Porte-cochère entrance & guest parking</p>
                            </div>
                        </div>

                        {/* Suite Photo */}
                        <div className="relative group overflow-hidden rounded-2xl h-52 border border-slate-200 shadow-sm">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelSuite})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                                    Guest Suite
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-white">Actual Room Suite Interior</h4>
                                <p className="text-[11px] text-slate-300">2 Queen & 1 Queen bed layouts with kitchenette</p>
                            </div>
                        </div>

                        {/* Pool Photo */}
                        <div className="relative group overflow-hidden rounded-2xl h-52 border border-slate-200 shadow-sm">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hotelPool})` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                                    Courtyard Pool
                                </span>
                                <h4 className="text-sm font-bold mt-1 text-white">Outdoor Swimming Pool</h4>
                                <p className="text-[11px] text-slate-300">On-site recreation courtyard for guests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Plan to Hand to Owner */}
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-emerald-600"></i> 3-Step Remediation Plan for Ownership
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3.5 bg-slate-50/90 rounded-2xl flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                        <div>
                            <strong className="text-slate-800">Bridge Garage Signage & Consolidate Google Business Profile:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Add an OYO brand plaque alongside the physical <em>"PARC HOTEL"</em> garage door, and unify Google Maps into one verified listing: <em>"Parc Hotel & Suites, an OYO Hotel - Houston Galleria"</em>. This unifies all review stars and ends lost arrivals.</p>
                        </div>
                    </div>
                    <div className="p-3.5 bg-slate-50/90 rounded-2xl flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                        <div>
                            <strong className="text-slate-800">Sync Merchant Billing & OTA Channel Manager:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Align Booking.com, Expedia, and credit card merchant terminal descriptors to <em>"PARC HOTEL / OYO 90631"</em> so guest credit card statements match the physical door, stopping chargebacks before they happen.</p>
                        </div>
                    </div>
                    <div className="p-3.5 bg-slate-50/90 rounded-2xl flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                        <div>
                            <strong className="text-slate-800">Deploy RoomSync for Turnover:</strong>
                            <p className="text-slate-500 text-xs mt-0.5">Give housekeepers 1-tap English/Spanish status buttons to eliminate 20+ daily phone calls to the desk.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE OWNER ROI & BUSINESS VALUE CALCULATOR */}
            <div className="relative overflow-hidden text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-xs"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/95"></div>

                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
                            <i className="fa-solid fa-calculator"></i>
                            <span>Financial Impact Calculator for 3101 Sage</span>
                        </div>
                        <h3 className="text-xl font-black text-white mt-1">Projected Annual Profit & Savings</h3>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full">
                        ROI: Immediate
                    </span>
                </div>

                {/* Calculator Controls */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                        <label className="block text-xs font-bold text-slate-300 mb-1">Early Check-ins Monetized / Day</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="1" 
                                max="8" 
                                value={earlyPerDay} 
                                onChange={(e) => setEarlyPerDay(parseInt(e.target.value, 10))}
                                className="w-full accent-amber-500 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-amber-400 font-mono min-w-[28px] text-right">{earlyPerDay}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">At $25 standard early fee</p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                        <label className="block text-xs font-bold text-slate-300 mb-1">Direct Repeat Bookings / Month</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="2" 
                                max="25" 
                                value={directPerMonth} 
                                onChange={(e) => setDirectPerMonth(parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-400 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-indigo-400 font-mono min-w-[28px] text-right">{directPerMonth}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Bypassing 18% OTA commission</p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                        <label className="block text-xs font-bold text-slate-300 mb-1">Minutes Saved per Room Clean</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                min="5" 
                                max="20" 
                                value={minsSavedPerRoom} 
                                onChange={(e) => setMinsSavedPerRoom(parseInt(e.target.value, 10))}
                                className="w-full accent-emerald-400 cursor-pointer" 
                            />
                            <span className="text-lg font-black text-emerald-400 font-mono min-w-[28px] text-right">{minsSavedPerRoom}m</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Reduced phone tag & checks</p>
                    </div>
                </div>

                {/* Dynamic Results Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2">
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30">
                        <div className="text-[10px] uppercase font-bold text-amber-400/80">Annual Early Check-In Revenue</div>
                        <div className="text-2xl font-black text-amber-300 font-mono mt-1">+${annualEarly.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Pure found profit</div>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30">
                        <div className="text-[10px] uppercase font-bold text-indigo-400/80">Annual OTA Commission Saved</div>
                        <div className="text-2xl font-black text-indigo-300 font-mono mt-1">+${annualOtaSaved.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Kept in property bank</div>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30">
                        <div className="text-[10px] uppercase font-bold text-emerald-400/80">Housekeeping Hours Saved</div>
                        <div className="text-2xl font-black text-emerald-300 font-mono mt-1">{annualHoursSaved.toLocaleString()} hrs</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Faster 3PM check-in readiness</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 p-4 rounded-2xl border border-amber-400/50">
                        <div className="text-[10px] uppercase font-black text-amber-300">Total Net Impact / Year</div>
                        <div className="text-2xl font-black text-white font-mono mt-1">+${annualTotal.toLocaleString()}</div>
                        <div className="text-[10px] text-amber-200 mt-0.5 font-bold">Payback period: Instant</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
