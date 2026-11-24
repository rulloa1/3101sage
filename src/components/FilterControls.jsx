import React, { useMemo } from 'react';
import { i18n } from '../constants/i18n';

export default function FilterControls({
    currentFloor,
    setFloor,
    currentWing,
    setWing,
    currentStatusFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewLayout,
    setViewLayout,
    onWalkInMatch,
    rooms,
    filteredCount,
    currentLang
}) {
    const dict = i18n[currentLang] || i18n.en;

    const floors = useMemo(() => {
        if (!rooms || rooms.length === 0) return ['1', '2'];
        return [...new Set(rooms.map(r => String(r.floor)))].sort((a, b) => Number(a) - Number(b));
    }, [rooms]);

    const wings = useMemo(() => {
        if (!rooms || rooms.length === 0) return [];
        return [...new Set(rooms.map(r => (r.wing || '').trim()).filter(Boolean))].sort();
    }, [rooms]);

    const hasActiveFilter =
        currentFloor !== 'ALL' ||
        currentWing !== 'ALL' ||
        currentStatusFilter !== 'ALL' ||
        searchQuery.trim().length > 0;

    return (
        <section
            aria-label="Filter suites"
            className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 lg:flex-row lg:items-center lg:justify-between"
        >
            {/* Left: Floor segments, Wing selector, Walk-In shortcut */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5">
                    {['ALL', ...floors].map((floor) => {
                        const active = currentFloor === floor;
                        return (
                            <button
                                key={floor}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setFloor(floor)}
                                className={`cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                                    active
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {floor === 'ALL' ? dict.allFloors : `${dict.floorLabel} ${floor}`}
                            </button>
                        );
                    })}
                </div>

                {wings.length > 0 && (
                    <select
                        value={currentWing}
                        onChange={(e) => setWing(e.target.value)}
                        aria-label="Filter by wing"
                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    >
                        <option value="ALL">{dict.allWings}</option>
                        {wings.map((wing) => (
                            <option key={wing} value={wing}>
                                {wing}
                            </option>
                        ))}
                    </select>
                )}

                <button
                    type="button"
                    onClick={onWalkInMatch}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                        currentStatusFilter === 'clean'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800'
                    }`}
                >
                    <i className="fa-solid fa-key text-[11px] text-emerald-600"></i>
                    <span>{dict.walkInReady}</span>
                </button>
            </div>

            {/* Right: Search, Sort, View Toggle, Result Count */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[180px] flex-1 sm:w-52 sm:flex-none">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-2.5 top-2 text-[11px] text-slate-400"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={dict.searchPlaceholder}
                        aria-label="Search suites"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                            className="absolute right-2 top-1.5 cursor-pointer text-slate-400 hover:text-slate-700"
                        >
                            <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                    )}
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort suites"
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                >
                    <option value="room">{dict.sortRoom}</option>
                    <option value="priority">{dict.sortPriority}</option>
                    <option value="floor">{dict.sortFloor}</option>
                </select>

                {/* Cards / Table View Toggle */}
                <div
                    role="group"
                    aria-label="Suite layout"
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5"
                >
                    <button
                        type="button"
                        aria-pressed={viewLayout === 'cards'}
                        onClick={() => setViewLayout('cards')}
                        title={dict.cardsView}
                        className={`cursor-pointer rounded-md px-2 py-1 text-xs font-semibold transition ${
                            viewLayout === 'cards'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <i className="fa-solid fa-grip text-[11px]"></i>
                        <span className="ml-1 hidden sm:inline">{dict.cardsView}</span>
                    </button>
                    <button
                        type="button"
                        aria-pressed={viewLayout === 'table'}
                        onClick={() => setViewLayout('table')}
                        title={dict.tableView}
                        className={`cursor-pointer rounded-md px-2 py-1 text-xs font-semibold transition ${
                            viewLayout === 'table'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <i className="fa-solid fa-list text-[11px]"></i>
                        <span className="ml-1 hidden sm:inline">{dict.tableView}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 pl-1 text-xs font-medium text-slate-400 tabular-nums">
                    <span>
                        {filteredCount}/{rooms.length}
                    </span>
                    {hasActiveFilter && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="cursor-pointer font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-950"
                        >
                            {dict.clearFilters}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
