import React from 'react';

export default function FilterControls({
    currentFloor,
    setFloor,
    currentStatusFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    onWalkInMatch,
    onResetDemo
}) {
    return (
        <section className="border-b border-white/[0.07] bg-ink-900/30 px-4 py-2.5 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
                {/* Floor Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="eyebrow mr-1">Floor</span>
                    {['ALL', '1', '2', '3'].map((floor) => (
                        <button
                            key={floor}
                            onClick={() => setFloor(floor)}
                            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                currentFloor === floor
                                    ? 'bg-brand-600 text-white shadow-brand-glow'
                                    : 'bg-white/[0.05] text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/[0.09] hover:text-white'
                            }`}
                        >
                            {floor === 'ALL' ? 'All Floors' : `Floor ${floor}`}
                        </button>
                    ))}

                    {/* Quick Walk-in Matcher Button */}
                    <button
                        onClick={onWalkInMatch}
                        className="ml-1.5 flex cursor-pointer items-center gap-1.5 rounded-xl border border-gold-500/30 bg-gold-500/[0.10] px-3 py-1.5 text-xs font-extrabold text-gold-400 transition hover:bg-gold-500/[0.16] hover:text-gold-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
                    >
                        <i className="fa-solid fa-key text-xs"></i>
                        <span>Quick Match: Ready for Walk-in</span>
                    </button>
                </div>

                {/* Search & Reset */}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {/* Active Filter Pill */}
                    {currentStatusFilter !== 'ALL' && (
                        <div className="animate-fadeIn flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/[0.10] px-2.5 py-1 text-[11px] font-bold text-brand-400">
                            <span className="text-slate-400">Filter:</span>
                            <span className="capitalize">{currentStatusFilter}</span>
                            <button onClick={resetFilters} className="ml-0.5 cursor-pointer text-brand-400 transition hover:text-white">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-56">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-slate-500"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Room #, King, note..."
                            className="field py-1.5 pl-8 pr-7"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-2.5 cursor-pointer text-slate-500 transition hover:text-slate-200"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>

                    {/* Reset Demo State Button */}
                    <button
                        onClick={onResetDemo}
                        className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-white/[0.06] hover:text-brand-400"
                        title="Reset rooms to demo layout"
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
