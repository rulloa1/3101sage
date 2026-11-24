import React, { useState } from 'react';
import { OYO_LOGO, OYO_LISTING_URL, OYO_US_PORTAL } from '../constants/brand';
import hotelHeroBg from '../assets/hotel-hero-bg.jpg';
import hotelSuite from '../assets/hotel-suite.jpg';
import hotelPool from '../assets/hotel-pool.jpg';
import hotelFrontDeskParc from '../assets/hotel-front-desk-parc.jpg';
import hotelGarageEntrance from '../assets/hotel-garage-entrance.jpg';

export default function AuditView({ onOpenMemo }) {
    const [earlyPerDay, setEarlyPerDay] = useState(3);
    const [directPerMonth, setDirectPerMonth] = useState(8);
    const [minsSavedPerRoom, setMinsSavedPerRoom] = useState(12);

    const annualEarly = earlyPerDay * 25 * 365;
    const annualOtaSaved = Math.round(directPerMonth * 12 * 144 * 0.18);
    const annualHoursSaved = Math.round((minsSavedPerRoom * 30 * 365) / 60);
    const annualTotal = annualEarly + annualOtaSaved;

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Property Audit Hero */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-35"
                    style={{ backgroundImage: `url(${hotelHeroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/75"></div>

                <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                            Property Operations &amp; Brand Audit &middot; 3101 Sage Rd
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Brand Conflict &amp; Margin Recovery Report
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                            On-site findings documenting listing fragmentation across Parc Hotel, OYO #90631, and
                            Stellar Stay, alongside turnover efficiency and direct-booking ROI.
                        </p>

                        {onOpenMemo && (
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onOpenMemo}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
                                >
                                    <i className="fa-solid fa-file-contract"></i>
                                    <span>Open Executive Proposal (Print / PDF)</span>
                                </button>
                                <a
                                    href={OYO_LISTING_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
                                >
                                    <span>OYO #90631 Listing</span>
                                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex-shrink-0 rounded-xl border border-white/15 bg-slate-950/75 px-5 py-4 backdrop-blur-sm">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            OTA Commission Leakage
                        </div>
                        <div className="mt-1 font-mono text-2xl font-extrabold text-rose-400 tabular-nums sm:text-3xl">
                            18% &ndash; 22%
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                            Paid on third-party repeat stays
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Way Brand Mismatch Analysis */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-3.5">
                    <h3 className="text-sm font-bold text-slate-900">Three-Way Brand Identity Mismatch</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Guests encounter three conflicting property names between booking, arrival, and billing.
                    </p>
                </div>
                <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-rose-700">
                            <span>Physical Door Signage</span>
                            <i className="fa-solid fa-door-open"></i>
                        </div>
                        <div className="text-base font-extrabold text-slate-900">&ldquo;PARC HOTEL&rdquo;</div>
                        <p className="text-xs leading-relaxed text-slate-600">
                            The garage check-in entrance door is prominently labeled <strong>PARC HOTEL</strong> with
                            drive-up front desk service windows.
                        </p>
                        <p className="pt-1 text-xs font-semibold text-rose-700">
                            <i className="fa-solid fa-triangle-exclamation mr-1.5 text-[11px]"></i>
                            OTA guests pull in and believe they reached the wrong property.
                        </p>
                    </div>

                    <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <span>Franchise Channel</span>
                            <i className="fa-solid fa-globe text-rose-600"></i>
                        </div>
                        <div className="text-base font-extrabold text-slate-900">&ldquo;OYO Hotel Houston Galleria&rdquo;</div>
                        <p className="text-xs leading-relaxed text-slate-600">
                            Listed across the OYO corporate app and Expedia network under official Property #90631.
                        </p>
                        <p className="pt-1 text-xs font-semibold text-amber-700">
                            <i className="fa-solid fa-triangle-exclamation mr-1.5 text-[11px]"></i>
                            Card disputes arise when billing descriptors do not match signage.
                        </p>
                    </div>

                    <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <span>OTA &amp; Legacy Listings</span>
                            <i className="fa-brands fa-google text-blue-600"></i>
                        </div>
                        <div className="text-base font-extrabold text-slate-900">&ldquo;Stellar Stay / Galleria Garden&rdquo;</div>
                        <p className="text-xs leading-relaxed text-slate-600">
                            Appears on Booking.com and Agoda as Stellar Stay alongside duplicate legacy Google Maps pins.
                        </p>
                        <p className="pt-1 text-xs font-semibold text-blue-700">
                            <i className="fa-solid fa-triangle-exclamation mr-1.5 text-[11px]"></i>
                            Fragments review volume (3.7★) while incurring 18%&ndash;22% commissions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Live OYO #90631 Channel Metrics */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                            <img src={OYO_LOGO} alt="OYO" className="h-5 w-auto object-contain" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                OTA Channel Snapshot &middot; Property #90631
                            </h3>
                            <p className="text-xs text-slate-500">
                                3101 Sage Rd, Houston, TX 77056 &middot; Galleria &middot; 30 suites &middot; 2 floors
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <a
                            href={OYO_US_PORTAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <span>OYO US Portal</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
                        </a>
                        <a
                            href={OYO_LISTING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                        >
                            <span>Open Listing #90631</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
                    <div className="p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            OTA Nightly Rate
                        </div>
                        <div className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums">
                            $132 <span className="font-sans text-xs font-medium text-slate-400">/ night</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
                            $154 w/ tax ($188 base)
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Guest Rating
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 font-mono text-lg font-extrabold text-amber-600 tabular-nums">
                            <i className="fa-solid fa-star text-xs text-amber-500"></i>
                            <span>3.7</span>
                            <span className="font-sans text-xs font-medium text-slate-400">/ 5.0</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500 tabular-nums">17 verified reviews</div>
                    </div>
                    <div className="p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Standard Hours
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 tabular-nums">Check-in 3:00 PM</div>
                        <div className="mt-0.5 text-xs text-slate-500 tabular-nums">Checkout 11:00 AM</div>
                    </div>
                    <div className="p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Suite Configurations
                        </div>
                        <div className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">
                            1BR Queen &middot; 2-Queen &middot; 2BR 2-Queen
                        </div>
                    </div>
                </div>
            </section>

            {/* On-Site Property Photography Evidence */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3.5">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            On-Site Visual Inspection &mdash; 3101 Sage Rd
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Field photography verifying physical garage signage alongside property exterior, suites, and pool.
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">
                        <i className="fa-solid fa-circle-check mr-1 text-[11px]"></i>
                        Field &amp; Channel Verified
                    </span>
                </div>

                {/* Arrival Evidence */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <figure className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                                src={hotelFrontDeskParc}
                                alt="Garage front desk check-in door signed PARC HOTEL"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                            <figcaption className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                                    Physical Door Evidence
                                </div>
                                <div className="mt-0.5 text-sm font-bold">
                                    Garage Front Desk Door (&ldquo;PARC HOTEL&rdquo;)
                                </div>
                                <p className="mt-0.5 text-[11px] leading-snug text-slate-300">
                                    Entrance door signed PARC HOTEL next to drive-up check-in windows.
                                </p>
                            </figcaption>
                        </div>
                    </figure>

                    <figure className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                                src={hotelGarageEntrance}
                                alt="Covered garage drive-in entrance bay"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                            <figcaption className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                    Ground Arrival
                                </div>
                                <div className="mt-0.5 text-sm font-bold">Covered Garage Drive-In Entry</div>
                                <p className="mt-0.5 text-[11px] leading-snug text-slate-300">
                                    5 MPH drive-in lane leading directly to the covered front desk bay.
                                </p>
                            </figcaption>
                        </div>
                    </figure>
                </div>

                {/* Facade, Suite, Pool */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <figure className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                                src={hotelHeroBg}
                                alt="3101 Sage Rd exterior facade"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                            <figcaption className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <div className="text-xs font-bold">3101 Sage Rd Exterior</div>
                                <div className="text-[11px] text-slate-300">Porte-cochere &amp; guest parking</div>
                            </figcaption>
                        </div>
                    </figure>

                    <figure className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                                src={hotelSuite}
                                alt="Guest suite interior"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                            <figcaption className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <div className="text-xs font-bold">Suite Interior</div>
                                <div className="text-[11px] text-slate-300">1 &amp; 2 Queen layouts with kitchenette</div>
                            </figcaption>
                        </div>
                    </figure>

                    <figure className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                                src={hotelPool}
                                alt="Outdoor courtyard swimming pool"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                            <figcaption className="absolute bottom-3 left-3.5 right-3.5 text-white">
                                <div className="text-xs font-bold">Courtyard Pool</div>
                                <div className="text-[11px] text-slate-300">Outdoor guest recreation courtyard</div>
                            </figcaption>
                        </div>
                    </figure>
                </div>
            </section>

            {/* 3-Step Remediation Plan */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Three-Step Remediation Plan for Ownership
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Practical sequence to align guest arrival, billing descriptors, and daily turnover.
                        </p>
                    </div>
                    {onOpenMemo && (
                        <button
                            type="button"
                            onClick={onOpenMemo}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                            <i className="fa-solid fa-print text-[11px]"></i>
                            <span>Print Proposal Memo</span>
                        </button>
                    )}
                </div>

                <ol className="mt-4 divide-y divide-slate-100">
                    <li className="flex items-start gap-3.5 py-3 first:pt-0">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-white">
                            1
                        </span>
                        <div>
                            <div className="text-xs font-bold text-slate-900 sm:text-sm">
                                Bridge Garage Signage &amp; Consolidate Google Business Profile
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                Add an OYO brand plaque beside the physical <em>PARC HOTEL</em> garage door and merge
                                duplicate Google Maps pins into one verified listing:{' '}
                                <em>Parc Hotel &amp; Suites, an OYO Hotel &mdash; Houston Galleria</em>.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5 py-3">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-white">
                            2
                        </span>
                        <div>
                            <div className="text-xs font-bold text-slate-900 sm:text-sm">
                                Align Merchant Billing &amp; OTA Channel Descriptors
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                Standardize Booking.com, Expedia, and card terminal descriptors to{' '}
                                <em>PARC HOTEL / OYO 90631</em> and issue the signed Keycard Sleeve disclosure at
                                check-in to prevent unrecognized-charge disputes.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5 py-3 last:pb-0">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-900 font-mono text-xs font-bold text-white">
                            3
                        </span>
                        <div>
                            <div className="text-xs font-bold text-slate-900 sm:text-sm">
                                Run Live Bilingual Turnover Across Front Desk &amp; Housekeeping
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                Equip housekeepers with 1-tap English/Spanish status updates and 3-point QC checks to
                                remove phone tag and unlock early check-in inventory faster.
                            </p>
                        </div>
                    </li>
                </ol>
            </section>

            {/* Interactive Owner ROI Calculator */}
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            Financial Impact Calculator &middot; 3101 Sage
                        </p>
                        <h3 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                            Projected Annual Margin &amp; Labor Recovery
                        </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                        Zero software licensing cost
                    </span>
                </div>

                {/* Sliders */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <label htmlFor="roi-early" className="block text-xs font-semibold text-slate-300">
                            Early Check-ins / Day
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                            <input
                                id="roi-early"
                                type="range"
                                min="1"
                                max="8"
                                value={earlyPerDay}
                                onChange={(e) => setEarlyPerDay(parseInt(e.target.value, 10))}
                                className="w-full cursor-pointer accent-amber-400"
                            />
                            <span className="min-w-[28px] text-right font-mono text-base font-extrabold text-amber-300 tabular-nums">
                                {earlyPerDay}
                            </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-400">At $25 standard early fee</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <label htmlFor="roi-direct" className="block text-xs font-semibold text-slate-300">
                            Direct Repeat Stays / Month
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                            <input
                                id="roi-direct"
                                type="range"
                                min="2"
                                max="25"
                                value={directPerMonth}
                                onChange={(e) => setDirectPerMonth(parseInt(e.target.value, 10))}
                                className="w-full cursor-pointer accent-sky-400"
                            />
                            <span className="min-w-[28px] text-right font-mono text-base font-extrabold text-sky-300 tabular-nums">
                                {directPerMonth}
                            </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-400">Bypassing 18% OTA commission</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <label htmlFor="roi-mins" className="block text-xs font-semibold text-slate-300">
                            Minutes Saved / Suite Turn
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                            <input
                                id="roi-mins"
                                type="range"
                                min="5"
                                max="20"
                                value={minsSavedPerRoom}
                                onChange={(e) => setMinsSavedPerRoom(parseInt(e.target.value, 10))}
                                className="w-full cursor-pointer accent-emerald-400"
                            />
                            <span className="min-w-[34px] text-right font-mono text-base font-extrabold text-emerald-300 tabular-nums">
                                {minsSavedPerRoom}m
                            </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-400">Eliminates manual phone checks</p>
                    </div>
                </div>

                {/* Output Metrics */}
                <div className="mt-5 grid grid-cols-1 divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
                    <div className="p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Early Check-In Revenue
                        </div>
                        <div className="mt-1 font-mono text-xl font-extrabold text-amber-300 tabular-nums">
                            +${annualEarly.toLocaleString()}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">Annual direct margin</div>
                    </div>

                    <div className="p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            OTA Commission Saved
                        </div>
                        <div className="mt-1 font-mono text-xl font-extrabold text-sky-300 tabular-nums">
                            +${annualOtaSaved.toLocaleString()}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">Retained from direct repeats</div>
                    </div>

                    <div className="p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Turnover Time Saved
                        </div>
                        <div className="mt-1 font-mono text-xl font-extrabold text-emerald-300 tabular-nums">
                            {annualHoursSaved.toLocaleString()} hrs
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">Faster 3 PM room readiness</div>
                    </div>

                    <div className="bg-emerald-950/40 p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                            Total Net Impact / Year
                        </div>
                        <div className="mt-1 font-mono text-2xl font-extrabold text-white tabular-nums">
                            +${annualTotal.toLocaleString()}
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold text-emerald-300">
                            Immediate payback
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
