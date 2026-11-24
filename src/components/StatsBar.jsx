import React from 'react';
import { i18n } from '../constants/i18n';

export default function StatsBar({
    rooms,
    inventory,
    currentStatusFilter,
    onStatusFilter,
    currentLang,
    activeView,
    todayEarlyTotal,
    onOpenImport,
    onOpenResetConfirm,
    onOpenKeycardSleeve,
    onOpenShiftReport,
    onOpenAddRoom
}) {
    const total = rooms.length;
    const clean = rooms.filter(r => r.status === 'clean').length;
    const cleaning = rooms.filter(r => r.status === 'cleaning').length;
    const dirty = rooms.filter(r => r.status === 'dirty').length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const maint = rooms.filter(r => r.status === 'maintenance' || r.status === 'dnd').length;
    const readyPct = total > 0 ? Math.round((clean / total) * 100) : 0;

    const dict = i18n[currentLang] || i18n.en;
    const isImported = inventory?.source === 'imported';

    const stats = [
        {
            key: 'ALL',
            value: total,
            label: dict.allSuites,
            dot: 'bg-slate-400',
            valueColor: 'text-slate-900',
            activeRing: 'bg-slate-900 text-white',
            activeSub: 'text-slate-300',
            activeDot: 'bg-white'
        },
        {
            key: 'clean',
            value: clean,
            label: dict.clean,
            dot: 'bg-emerald-500',
            valueColor: 'text-emerald-700',
            activeRing: 'bg-emerald-50 ring-1 ring-inset ring-emerald-500/60',
            activeSub: 'text-emerald-800',
            activeDot: 'bg-emerald-600'
        },
        {
            key: 'cleaning',
            value: cleaning,
            label: dict.cleaning,
            dot: 'bg-amber-500',
            valueColor: 'text-amber-700',
            activeRing: 'bg-amber-50 ring-1 ring-inset ring-amber-500/60',
            activeSub: 'text-amber-800',
            activeDot: 'bg-amber-600'
        },
        {
            key: 'dirty',
            value: dirty,
            label: dict.dirty,
            dot: 'bg-rose-500',
            valueColor: 'text-rose-700',
            activeRing: 'bg-rose-50 ring-1 ring-inset ring-rose-500/60',
            activeSub: 'text-rose-800',
            activeDot: 'bg-rose-600'
        },
        {
            key: 'occupied',
            value: occupied,
            label: dict.occupied,
            dot: 'bg-blue-500',
            valueColor: 'text-blue-700',
            activeRing: 'bg-blue-50 ring-1 ring-inset ring-blue-500/60',
            activeSub: 'text-blue-800',
            activeDot: 'bg-blue-600'
        },
        {
            key: 'maintenance',
            value: maint,
            label: dict.maintenance,
            dot: 'bg-violet-500',
            valueColor: 'text-violet-700',
            activeRing: 'bg-violet-50 ring-1 ring-inset ring-violet-500/60',
            activeSub: 'text-violet-800',
            activeDot: 'bg-violet-600'
        }
    ];

    return (
        <section
            aria-label="Operations summary"
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
            {/* Top band: Readiness progress, inventory provenance, and desk utility actions */}
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {/* Readiness metric & bar */}
                    <div className="flex items-center gap-3">
                        <div className="text-xs">
                            <span className="font-semibold text-slate-600">{dict.readinessLabel}</span>
                            <span className="ml-2 font-mono font-bold text-slate-900 tabular-nums">{readyPct}%</span>
                            <span className="ml-1.5 text-slate-400 tabular-nums">
                                ({clean} {dict.roomsReadyOf} {total} {dict.roomsReadySuffix})
                            </span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label={`${dict.readinessLabel}: ${clean} of ${total}`}
                            aria-valuenow={readyPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="hidden h-2 w-28 overflow-hidden rounded-full bg-slate-100 sm:block"
                        >
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${readyPct}%` }}
                            ></div>
                        </div>
                    </div>

                    <span className="hidden h-4 w-px bg-slate-200 sm:inline-block" aria-hidden="true"></span>

                    {/* Compact inline inventory provenance */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {isImported ? (
                            <>
                                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                                    <i className="fa-solid fa-circle-check text-[11px]"></i>
                                    {dict.importedInventoryLabel}
                                </span>
                                {inventory?.fileName && (
                                    <span className="max-w-[160px] truncate text-slate-400" title={inventory.fileName}>
                                        &middot; {inventory.fileName}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={onOpenImport}
                                    className="cursor-pointer font-semibold text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
                                >
                                    {dict.replaceList}
                                </button>
                                <button
                                    type="button"
                                    onClick={onOpenResetConfirm}
                                    className="cursor-pointer font-medium text-slate-400 transition hover:text-rose-600"
                                >
                                    {dict.resetModel}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                                    <i className="fa-solid fa-triangle-exclamation text-[11px]"></i>
                                    {dict.modelInventoryLabel}
                                </span>
                                <span className="hidden text-slate-400 sm:inline">&middot; 101–115 / 201–215</span>
                                <button
                                    type="button"
                                    onClick={onOpenImport}
                                    className="cursor-pointer font-semibold text-slate-800 underline decoration-amber-400 underline-offset-2 transition hover:text-amber-700"
                                >
                                    {dict.loadRoomList}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Operational utilities (Desk view) */}
                {activeView === 'desk' && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {todayEarlyTotal > 0 && (
                            <span className="mr-1 font-mono text-xs font-bold text-emerald-700 tabular-nums">
                                +${Number(todayEarlyTotal).toFixed(0)} early fees
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={onOpenKeycardSleeve}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <i className="fa-solid fa-qrcode text-[11px] text-slate-500"></i>
                            <span>{dict.keycardBtn}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onOpenShiftReport}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <i className="fa-solid fa-clipboard-list text-[11px] text-slate-500"></i>
                            <span>{dict.shiftReportBtn}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onOpenAddRoom}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                        >
                            <i className="fa-solid fa-plus text-[11px] text-slate-600"></i>
                            <span>{dict.addRoomBtn}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom band: Single-elevation hairline interactive KPI strip */}
            {activeView === 'desk' && (
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
                    {stats.map((stat) => {
                        const isActive = currentStatusFilter === stat.key;
                        const isAllActive = stat.key === 'ALL' && isActive;
                        return (
                            <button
                                key={stat.key}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => onStatusFilter(stat.key)}
                                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 ${
                                    isActive
                                        ? stat.activeRing
                                        : 'bg-white hover:bg-slate-50'
                                }`}
                            >
                                <div>
                                    <div
                                        className={`font-mono text-xl font-extrabold leading-none tracking-tight tabular-nums ${
                                            isAllActive ? 'text-white' : stat.valueColor
                                        }`}
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        className={`mt-1.5 text-[11px] font-semibold ${
                                            isAllActive
                                                ? stat.activeSub
                                                : isActive
                                                ? stat.activeSub
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                                <span
                                    className={`h-2 w-2 rounded-full ${isActive ? stat.activeDot : stat.dot}`}
                                    aria-hidden="true"
                                ></span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
