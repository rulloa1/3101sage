import React, { useState } from 'react';
import oyoLogo from '../assets/oyo-logo.png';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';
import hotelFrontDeskParc from '../assets/hotel-front-desk-parc.jpg';

export default function ExecutiveMemoModal({ isOpen, onClose }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const text = `EXECUTIVE MEMORANDUM
TO: Ownership & Management, 3101 Sage Rd, Houston, TX 77056
FROM: Hospitality Operations Team
DATE: November 16, 2026
SUBJECT: Operations Modernization, Brand Consolidation & Revenue Optimization Proposal
LIVE SYSTEM: https://rulloa1.github.io/3101sage/

1. EXECUTIVE SUMMARY
A channel and operations audit of 3101 Sage Rd identifies two key profit leaks:
- Brand Conflict: Physical garage door is labeled "PARC HOTEL", while online channels list "OYO #90631" and "Stellar Stay" (driving 3.7★ reviews & chargebacks).
- Turnover Friction: Manual calls to housekeepers and unmonetized early arrivals.
By deploying RoomSync Pro, ownership recaptures an estimated +$31,663/year in pure margin.

2. FINANCIAL ROI BREAKDOWN
- Early Arrival Monetization ($25 fee x 3 rooms/day): +$27,375/year
- Direct Booking Recapture (8 repeats/mo @ 18% OTA fee): +$2,488/year
- Labor Hours Recovered (12 min/room turn): 1,022 hours/year
- Chargeback Elimination (Signed check-in card disclosure): ~$1,800/year
TOTAL ESTIMATED ANNUAL VALUE: +$31,663/year
Payback Period: Immediate ($0 software or hardware fees).

3. 3-STEP ROADMAP
1. Deploy RoomSync on front desk PC and housekeeper phones.
2. Affix OYO brand plaque adjacent to the "PARC HOTEL" garage check-in door.
3. Unify Google Business Profiles to centralize 3.7★ review authority.`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div 
            role="dialog" 
            aria-modal="true" 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
                {/* Modal Action Header (Screen Only) */}
                <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                            <i className="fa-solid fa-file-contract"></i>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Executive Pitch Memorandum</h3>
                            <p className="text-[10px] text-slate-400">Formal Proposal for 3101 Sage Rd Ownership</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={handleCopy}
                            className="cursor-pointer text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 active:scale-95"
                            title="Copy memo text to clipboard"
                        >
                            <i className={copied ? "fa-solid fa-check text-emerald-400" : "fa-solid fa-copy text-slate-400"}></i>
                            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={handlePrint}
                            className="cursor-pointer text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>Print / PDF</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="cursor-pointer w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* Printable Memorandum Content */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800" id="printableMemoArea">
                    {/* Header Letterhead */}
                    <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                                <img src={oyoLogo} alt="OYO" className="h-6 w-auto object-contain" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">3101 SAGE OPERATIONS SUITE</h2>
                                <p className="text-xs text-slate-500 font-semibold">Parc Hotel &bull; OYO Galleria #90631 &bull; Stellar Stay</p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <div className="font-bold text-slate-900 uppercase tracking-wider">Executive Proposal</div>
                            <div className="text-slate-500">Date: November 16, 2026</div>
                        </div>
                    </div>

                    {/* Memo Metadata Block */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div><strong>TO:</strong> Ownership & Asset Management, 3101 Sage Rd</div>
                        <div><strong>FROM:</strong> Hospitality Operations Team</div>
                        <div className="sm:col-span-2"><strong>SUBJECT:</strong> Operational Turnover Modernization, Brand Consolidation & Revenue Optimization</div>
                        <div className="sm:col-span-2"><strong>LIVE DEPLOYMENT:</strong> <a href="https://rulloa1.github.io/3101sage/" className="text-indigo-600 underline font-bold" target="_blank" rel="noreferrer">https://rulloa1.github.io/3101sage/</a></div>
                    </div>

                    {/* 1. Executive Summary */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-indigo-600 pl-2.5">
                            1. Executive Summary
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600">
                            A channel and operations audit of <strong>3101 Sage Rd</strong> reveals two critical leaks impacting net operating income (NOI):
                            (1) severe brand fragmentation between on-site physical door signage (<strong>"PARC HOTEL"</strong>) and digital OTA listings (<strong>OYO #90631 / Stellar Stay</strong>), depressing guest satisfaction (<strong>3.7★</strong>) and triggering chargebacks; and (2) turnover friction with unmonetized early arrivals. By deploying RoomSync Pro, ownership recaptures an estimated <strong>+$31,663/year</strong> in pure margin.
                        </p>
                    </div>

                    {/* 2. On-Site Physical Reality vs. Digital Channels */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-rose-600 pl-2.5">
                            2. On-Site Physical Evidence: Brand Identity Disconnect
                        </h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5">Channel / Touchpoint</th>
                                        <th className="p-2.5">Current Brand Name</th>
                                        <th className="p-2.5">Identified Impact / Risk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Physical Garage Check-In Door</td>
                                        <td className="p-2.5 font-bold text-rose-600">"PARC HOTEL"</td>
                                        <td className="p-2.5 text-rose-700">Guests think they arrived at wrong hotel; drive-offs</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">OYO Corporate App & Expedia</td>
                                        <td className="p-2.5 font-bold text-indigo-600">OYO Property #90631</td>
                                        <td className="p-2.5">Card statement disputes when bill reads "Stellar Stay"</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Booking.com / Agoda / Google</td>
                                        <td className="p-2.5 font-bold text-slate-700">"Stellar Stay" / "Galleria Garden"</td>
                                        <td className="p-2.5">Splits review volume across 3 pins; suppresses rank</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. Financial ROI Projections */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2.5">
                            3. Projected Financial ROI & Margin Recovery
                        </h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5">Revenue Driver</th>
                                        <th className="p-2.5">Operational Mechanism</th>
                                        <th className="p-2.5 text-right">Annual Impact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Early Arrival Monetization</td>
                                        <td className="p-2.5">3 rooms/day captured at standard $25 early check-in fee</td>
                                        <td className="p-2.5 font-bold text-emerald-700 text-right">+$27,375 / yr</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Direct Booking Recapture</td>
                                        <td className="p-2.5">8 repeat guests/month booking direct via Keycard QR (bypassing 18% OTA fee)</td>
                                        <td className="p-2.5 font-bold text-emerald-700 text-right">+$2,488 / yr</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Housekeeping Labor Efficiency</td>
                                        <td className="p-2.5">12 minutes saved per room turn via 1-tap Spanish/English dashboard</td>
                                        <td className="p-2.5 font-bold text-indigo-700 text-right">1,022 hrs saved</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-slate-800">Chargeback Defense Shield</td>
                                        <td className="p-2.5">Mandatory printed billing disclosure signed on Keycard Sleeve</td>
                                        <td className="p-2.5 font-bold text-slate-700 text-right">~$1,800 saved</td>
                                    </tr>
                                    <tr className="bg-emerald-50 font-black text-slate-900">
                                        <td className="p-2.5 uppercase">Total Net Annual Value</td>
                                        <td className="p-2.5 text-emerald-800 font-bold">Zero software licensing fees &bull; Instant deployment</td>
                                        <td className="p-2.5 text-emerald-800 font-mono text-base text-right">+$31,663 / yr</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. 3-Step Remediation Plan */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-amber-500 pl-2.5">
                            4. Immediate 3-Step Remediation Roadmap
                        </h4>
                        <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
                            <li>
                                <strong>Deploy RoomSync Pro (Day 1):</strong> Load on front desk PC and housekeeper smartphones. Zero hardware required.
                            </li>
                            <li>
                                <strong>Bridge Garage Door Signage (Week 1):</strong> Affix an OYO brand plaque adjacent to the physical <em>"PARC HOTEL"</em> door reading: <em>"Parc Hotel & Suites — an OYO Hotel"</em>.
                            </li>
                            <li>
                                <strong>Consolidate Google Maps (Month 1):</strong> Merge duplicate pins into <em>"Parc Hotel & Suites, an OYO Hotel - Houston Galleria"</em> to centralize all review stars.
                            </li>
                        </ol>
                    </div>

                    {/* Sign-off */}
                    <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                        <div>RoomSync Pro &bull; Houston Galleria Operations</div>
                        <div>Authorized Proposal &bull; 3101 Sage Rd</div>
                    </div>
                </div>

                {/* Bottom Footer Close (Screen Only) */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                    >
                        Close
                    </button>
                    <button 
                        type="button" 
                        onClick={handlePrint}
                        className="cursor-pointer px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5 active:scale-95"
                    >
                        <i className="fa-solid fa-print"></i>
                        <span>Print Proposal</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
