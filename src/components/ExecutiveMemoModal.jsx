import React, { useState } from 'react';
import oyoLogo from '../assets/oyo-logo.png';

const EYEBROW = 'text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500';

function SectionTitle({ index, title, palette = 'text-brass-600' }) {
    return (
        <h4 className="flex items-baseline gap-2.5 border-b border-ink-900/[0.1] pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-900">
            <span className={`font-display text-[13px] font-normal tracking-normal tabular-nums ${palette}`}>{index}</span>
            {title}
        </h4>
    );
}

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

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="memo-print-root fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-ink-950/75 p-3 backdrop-blur-md sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="memo-print-panel flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-ink-900/[0.08] bg-white shadow-panel">
                {/* Modal Action Header (Screen Only) */}
                <div className="screen-only flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-ink-950 px-5 py-3.5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass-300/25 bg-brass-300/10 text-[13px] text-brass-200">
                            <i className="fa-regular fa-file-lines"></i>
                        </div>
                        <div>
                            <h3 className="font-display text-[17px] leading-none text-bone-50">Executive Pitch Memorandum</h3>
                            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                                Formal proposal for 3101 Sage Rd ownership
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-bone-100 transition hover:border-white/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-300/40"
                            title="Copy memo text to clipboard"
                        >
                            <i className={`fa-regular ${copied ? 'fa-circle-check text-emerald-400' : 'fa-copy text-stone-400'}`}></i>
                            <span>{copied ? 'Copied' : 'Copy text'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-bone-50 px-3.5 py-1.5 text-[11px] font-semibold text-ink-900 transition hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-300/50"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>Print / PDF</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close executive memorandum"
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-stone-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-300/40"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* Printable Memorandum Content */}
                <div className="overflow-y-auto p-6 text-ink-800 sm:p-9" id="printableMemoArea">
                    <div className="space-y-5">
                        {/* Header Letterhead */}
                        <div className="memo-section flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink-900 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center rounded-md border border-ink-900/[0.1] bg-white px-2.5 py-1.5 shadow-xs">
                                    <img src={oyoLogo} alt="OYO" className="h-6 w-auto object-contain" />
                                </div>
                                <div>
                                    <h2 className="font-display text-[24px] leading-none text-ink-900">3101 Sage Operations Suite</h2>
                                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                                        Parc Hotel &bull; OYO Galleria #90631 &bull; Stellar Stay
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={EYEBROW}>Executive Proposal</div>
                                <div className="mt-1 text-[11px] font-medium text-stone-500">November 16, 2026</div>
                            </div>
                        </div>

                        {/* Memo Metadata Block */}
                        <div className="memo-section grid grid-cols-1 gap-2 rounded-md border border-ink-900/[0.08] bg-bone-50 p-3.5 text-[11px] leading-relaxed text-stone-600 sm:grid-cols-2">
                            <div><strong className="font-semibold text-ink-900">TO:</strong> Ownership &amp; Asset Management, 3101 Sage Rd</div>
                            <div><strong className="font-semibold text-ink-900">FROM:</strong> Hospitality Operations Team</div>
                            <div className="sm:col-span-2"><strong className="font-semibold text-ink-900">SUBJECT:</strong> Operational Turnover Modernization, Brand Consolidation &amp; Revenue Optimization</div>
                            <div className="space-y-1 border-t border-ink-900/[0.07] pt-2 sm:col-span-2">
                                <div>
                                    <strong className="font-semibold text-ink-900">OPERATIONS APP:</strong>{' '}
                                    <a href="https://rulloa1.github.io/3101sage/app.html" className="break-all font-medium text-ink-900 underline decoration-brass-400 underline-offset-2 transition hover:text-brass-700" target="_blank" rel="noreferrer">https://rulloa1.github.io/3101sage/app.html</a>
                                </div>
                                <div>
                                    <strong className="font-semibold text-ink-900">PROPERTY PORTAL:</strong>{' '}
                                    <a href="https://oyo.theroyeffect.com/" className="break-all font-medium text-ink-900 underline decoration-brass-400 underline-offset-2 transition hover:text-brass-700" target="_blank" rel="noreferrer">https://oyo.theroyeffect.com/</a>
                                </div>
                            </div>
                        </div>

                        {/* 1. Executive Summary */}
                        <div className="memo-section space-y-2">
                            <SectionTitle index="01" title="Executive Summary" />
                            <p className="text-xs leading-relaxed text-stone-600">
                                A channel and operations audit of <strong className="font-semibold text-ink-900">3101 Sage Rd</strong> reveals two critical leaks impacting net operating income (NOI):
                                (1) severe brand fragmentation between on-site physical door signage (<strong className="font-semibold text-ink-900">"PARC HOTEL"</strong>) and digital OTA listings (<strong className="font-semibold text-ink-900">OYO #90631 / Stellar Stay</strong>), depressing guest satisfaction (<strong className="font-semibold text-ink-900">3.7&#9733;</strong>) and triggering chargebacks; and (2) turnover friction with unmonetized early arrivals. By deploying RoomSync Pro, ownership recaptures an estimated <strong className="font-semibold text-emerald-800">+$31,663/year</strong> in pure margin.
                            </p>
                        </div>

                        {/* 2. On-Site Physical Reality vs. Digital Channels */}
                        <div className="memo-section space-y-2">
                            <SectionTitle index="02" title="On-site physical evidence: brand identity disconnect" palette="text-rose-600" />
                            <div className="overflow-x-auto rounded-md border border-ink-900/[0.08] text-[11px]">
                                <table className="w-full min-w-[520px] border-collapse text-left">
                                    <thead className="border-b border-ink-900/[0.08] bg-bone-50 text-[10px] uppercase tracking-[0.1em] text-stone-500">
                                        <tr>
                                            <th className="p-2 font-semibold sm:p-2.5">Channel / Touchpoint</th>
                                            <th className="p-2 font-semibold sm:p-2.5">Current Brand Name</th>
                                            <th className="p-2 font-semibold sm:p-2.5">Identified Impact / Risk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-ink-900/[0.06] text-stone-600">
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Physical Garage Check-In Door</td>
                                            <td className="p-2 font-semibold text-rose-700 sm:p-2.5">"PARC HOTEL"</td>
                                            <td className="p-2 text-rose-700 sm:p-2.5">Guests think they arrived at wrong hotel; drive-offs</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">OYO Corporate App &amp; Expedia</td>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">OYO Property #90631</td>
                                            <td className="p-2 sm:p-2.5">Card statement disputes when bill reads "Stellar Stay"</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Booking.com / Agoda / Google</td>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">"Stellar Stay" / "Galleria Garden"</td>
                                            <td className="p-2 sm:p-2.5">Splits review volume across 3 pins; suppresses rank</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Financial ROI Projections */}
                        <div className="memo-section space-y-2">
                            <SectionTitle index="03" title="Projected financial ROI & margin recovery" palette="text-emerald-700" />
                            <div className="overflow-x-auto rounded-md border border-ink-900/[0.08] text-[11px]">
                                <table className="w-full min-w-[520px] border-collapse text-left">
                                    <thead className="border-b border-ink-900/[0.08] bg-bone-50 text-[10px] uppercase tracking-[0.1em] text-stone-500">
                                        <tr>
                                            <th className="p-2 font-semibold sm:p-2.5">Revenue Driver</th>
                                            <th className="p-2 font-semibold sm:p-2.5">Operational Mechanism</th>
                                            <th className="p-2 text-right font-semibold sm:p-2.5">Annual Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-ink-900/[0.06] text-stone-600">
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Early Arrival Monetization</td>
                                            <td className="p-2 sm:p-2.5">3 rooms/day captured at standard $25 early check-in fee</td>
                                            <td className="p-2 text-right font-semibold tabular-nums text-emerald-800 sm:p-2.5">+$27,375 / yr</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Direct Booking Recapture</td>
                                            <td className="p-2 sm:p-2.5">8 repeat guests/month booking direct via Keycard QR (bypassing 18% OTA fee)</td>
                                            <td className="p-2 text-right font-semibold tabular-nums text-emerald-800 sm:p-2.5">+$2,488 / yr</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Housekeeping Labor Efficiency</td>
                                            <td className="p-2 sm:p-2.5">12 minutes saved per room turn via 1-tap Spanish/English dashboard</td>
                                            <td className="p-2 text-right font-semibold tabular-nums text-ink-800 sm:p-2.5">1,022 hrs saved</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 font-semibold text-ink-900 sm:p-2.5">Chargeback Defense Shield</td>
                                            <td className="p-2 sm:p-2.5">Mandatory printed billing disclosure signed on Keycard Sleeve</td>
                                            <td className="p-2 text-right font-semibold tabular-nums text-ink-800 sm:p-2.5">~$1,800 saved</td>
                                        </tr>
                                        <tr className="bg-bone-100">
                                            <td className="p-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-900 sm:p-2.5">Total Net Annual Value</td>
                                            <td className="p-2 text-ink-700 sm:p-2.5">Zero software licensing fees &bull; Instant deployment</td>
                                            <td className="p-2 text-right sm:p-2.5">
                                                <span className="font-display text-lg leading-none tabular-nums text-brass-700">+$31,663</span>
                                                <span className="ml-1 text-[10px] uppercase tracking-[0.1em] text-stone-500">/ yr</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. 3-Step Remediation Plan */}
                        <div className="memo-section space-y-2">
                            <SectionTitle index="04" title="Immediate 3-step remediation roadmap" palette="text-brass-600" />
                            <ol className="list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-stone-600 marker:text-[10px] marker:font-semibold marker:text-brass-600">
                                <li>
                                    <strong className="font-semibold text-ink-900">Deploy RoomSync Pro (Day 1):</strong> Load on front desk PC and housekeeper smartphones. Zero hardware required.
                                </li>
                                <li>
                                    <strong className="font-semibold text-ink-900">Bridge Garage Door Signage (Week 1):</strong> Affix an OYO brand plaque adjacent to the physical <em>"PARC HOTEL"</em> door reading: <em>"Parc Hotel &amp; Suites — an OYO Hotel"</em>.
                                </li>
                                <li>
                                    <strong className="font-semibold text-ink-900">Consolidate Google Maps (Month 1):</strong> Merge duplicate pins into <em>"Parc Hotel &amp; Suites, an OYO Hotel - Houston Galleria"</em> to centralize all review stars.
                                </li>
                            </ol>
                        </div>

                        {/* Sign-off */}
                        <div className="memo-section flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/[0.08] pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                            <div>RoomSync Pro &bull; Houston Galleria Operations</div>
                            <div>Authorized Proposal &bull; 3101 Sage Rd</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Close (Screen Only) */}
                <div className="screen-only flex flex-shrink-0 justify-end gap-2 border-t border-ink-900/[0.07] bg-bone-50 px-5 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-md px-3.5 py-2 text-[11px] font-semibold text-stone-500 transition hover:bg-white hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ink-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-ink-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40"
                    >
                        <i className="fa-solid fa-print"></i>
                        <span>Print proposal</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
