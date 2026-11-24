import React, { useState } from 'react';
import { OYO_LOGO } from '../constants/brand';

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
OPERATIONS APP: https://rulloa1.github.io/3101sage/app.html
PROPERTY PORTAL: https://oyo.theroyeffect.com/

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

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => {});
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exec-memo-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Modal Action Header (Screen Only) */}
                <div className="screen-only flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3.5 text-white">
                    <div>
                        <h3 id="exec-memo-title" className="text-sm font-bold text-white">
                            Executive Pitch Memorandum
                        </h3>
                        <p className="text-[11px] text-slate-400">
                            Formal Proposal for 3101 Sage Rd Ownership
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                            title="Copy memo text to clipboard"
                        >
                            <i className={copied ? 'fa-solid fa-check text-emerald-400' : 'fa-solid fa-copy text-slate-400'}></i>
                            <span>{copied ? 'Copied' : 'Copy Text'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 transition hover:bg-slate-100"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>Print / PDF</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close proposal memo"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* Printable Memorandum Content */}
                <div className="space-y-5 overflow-y-auto p-6 text-slate-800 sm:p-8" id="printableMemoArea">
                    {/* Letterhead */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-900 pb-3.5">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                                <img src={OYO_LOGO} alt="OYO" className="h-5 w-auto object-contain" />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                                    3101 SAGE OPERATIONS SUITE
                                </h2>
                                <p className="text-xs font-medium text-slate-500">
                                    Parc Hotel &middot; OYO Galleria #90631 &middot; Stellar Stay
                                </p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <div className="font-bold uppercase tracking-wider text-slate-900">Executive Proposal</div>
                            <div className="text-slate-500">November 16, 2026</div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:grid-cols-2">
                        <div><strong>TO:</strong> Ownership &amp; Asset Management, 3101 Sage Rd</div>
                        <div><strong>FROM:</strong> Hospitality Operations Team</div>
                        <div className="sm:col-span-2">
                            <strong>SUBJECT:</strong> Operational Turnover Modernization, Brand Consolidation &amp; Revenue Optimization
                        </div>
                        <div className="sm:col-span-2">
                            <strong>OPERATIONS APP:</strong>{' '}
                            <a href="https://rulloa1.github.io/3101sage/app.html" className="font-semibold text-slate-900 underline" target="_blank" rel="noopener noreferrer">
                                https://rulloa1.github.io/3101sage/app.html
                            </a>
                            <span className="mx-2 text-slate-400">&middot;</span>
                            <strong>PORTAL:</strong>{' '}
                            <a href="https://oyo.theroyeffect.com/" className="font-semibold text-slate-900 underline" target="_blank" rel="noopener noreferrer">
                                https://oyo.theroyeffect.com/
                            </a>
                        </div>
                    </div>

                    {/* 1. Executive Summary */}
                    <section className="space-y-2">
                        <h4 className="border-b border-slate-200 pb-1 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                            1. Executive Summary
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600">
                            A channel and operations audit of <strong>3101 Sage Rd</strong> reveals two critical leaks impacting net operating income (NOI):
                            (1) brand fragmentation between physical door signage (<strong>&ldquo;PARC HOTEL&rdquo;</strong>) and digital OTA listings (<strong>OYO #90631 / Stellar Stay</strong>), depressing guest ratings (<strong>3.7★</strong>) and triggering billing disputes; and (2) manual turnover friction with unmonetized early arrivals. Deploying RoomSync Pro recovers an estimated <strong>+$31,663/year</strong> in net margin.
                        </p>
                    </section>

                    {/* 2. Brand Disconnect Table */}
                    <section className="space-y-2">
                        <h4 className="border-b border-slate-200 pb-1 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                            2. On-Site Physical Evidence: Brand Identity Disconnect
                        </h4>
                        <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
                            <table className="w-full border-collapse text-left">
                                <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                                    <tr>
                                        <th className="p-2.5">Channel / Touchpoint</th>
                                        <th className="p-2.5">Current Brand Name</th>
                                        <th className="p-2.5">Identified Impact / Risk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Physical Garage Check-In Door</td>
                                        <td className="p-2.5 font-bold text-rose-700">&ldquo;PARC HOTEL&rdquo;</td>
                                        <td className="p-2.5 text-rose-700">Guests assume wrong hotel; drive-offs</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">OYO Corporate App &amp; Expedia</td>
                                        <td className="p-2.5 font-semibold text-slate-900">OYO Property #90631</td>
                                        <td className="p-2.5">Card statement disputes when descriptor reads &ldquo;Stellar Stay&rdquo;</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Booking.com / Agoda / Google</td>
                                        <td className="p-2.5 font-semibold text-slate-700">&ldquo;Stellar Stay&rdquo; / &ldquo;Galleria Garden&rdquo;</td>
                                        <td className="p-2.5">Splits review volume across 3 pins; suppresses search rank</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 3. Financial ROI Table */}
                    <section className="space-y-2">
                        <h4 className="border-b border-slate-200 pb-1 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                            3. Projected Financial ROI &amp; Margin Recovery
                        </h4>
                        <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
                            <table className="w-full border-collapse text-left">
                                <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                                    <tr>
                                        <th className="p-2.5">Revenue Driver</th>
                                        <th className="p-2.5">Operational Mechanism</th>
                                        <th className="p-2.5 text-right">Annual Impact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Early Arrival Monetization</td>
                                        <td className="p-2.5">3 rooms/day captured at standard $25 early check-in fee</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums">+$27,375 / yr</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Direct Booking Recapture</td>
                                        <td className="p-2.5">8 repeat guests/month booking direct via Keycard QR (18% OTA saved)</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums">+$2,488 / yr</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Housekeeping Labor Efficiency</td>
                                        <td className="p-2.5">12 minutes saved per suite turn via 1-tap EN/ES dashboard</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 tabular-nums">1,022 hrs saved</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-semibold text-slate-900">Chargeback Defense Shield</td>
                                        <td className="p-2.5">Printed billing disclosure signed on Keycard Sleeve at check-in</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-slate-700 tabular-nums">~$1,800 saved</td>
                                    </tr>
                                    <tr className="bg-emerald-50 font-bold text-slate-900">
                                        <td className="p-2.5 uppercase">Total Net Annual Value</td>
                                        <td className="p-2.5 text-emerald-800">Zero software licensing fees &middot; Immediate deployment</td>
                                        <td className="p-2.5 text-right font-mono text-sm font-extrabold text-emerald-800 tabular-nums">+$31,663 / yr</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. Roadmap */}
                    <section className="space-y-2">
                        <h4 className="border-b border-slate-200 pb-1 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                            4. Immediate Three-Step Remediation Roadmap
                        </h4>
                        <ol className="list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-slate-600">
                            <li>
                                <strong>Deploy RoomSync Pro (Day 1):</strong> Run on front desk PC and housekeeper smartphones with zero hardware cost.
                            </li>
                            <li>
                                <strong>Bridge Garage Door Signage (Week 1):</strong> Affix an OYO brand plaque beside the physical <em>PARC HOTEL</em> door reading <em>&ldquo;Parc Hotel &amp; Suites &mdash; an OYO Hotel&rdquo;</em>.
                            </li>
                            <li>
                                <strong>Consolidate Google Maps (Month 1):</strong> Merge duplicate pins into <em>Parc Hotel &amp; Suites, an OYO Hotel &mdash; Houston Galleria</em> to unify review authority.
                            </li>
                        </ol>
                    </section>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
                        <div>RoomSync Pro &middot; Houston Galleria Operations</div>
                        <div>Authorized Proposal &middot; 3101 Sage Rd</div>
                    </div>
                </div>

                {/* Screen Footer */}
                <div className="screen-only flex flex-shrink-0 justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                        <i className="fa-solid fa-print"></i>
                        <span>Print Proposal</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
