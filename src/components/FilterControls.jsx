import React from 'react';

export default function FilterControls({
    currentFloor,
    setFloor,
    currentStatusFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    onWalkInMatch,
    onOpenAddRoom,
    onResetDemo,
    rooms
}) {
    // Derive floor options from actual inventory so floor 4+ rooms are reachable
    const floors = React.useMemo(() => {
        if (!rooms || rooms.length === 0) return ['1', '2', '3'];
        const unique = [...new Set(rooms.map(r => String(r.floor)))].sort((a, b) => Number(a) - Number(b));
        return unique;
    }, [rooms]);

    return (
        <section className="border-b border-white/10 bg-[#121622] px-4 py-2.5 backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2.5 text-xs text-stone-200">
                {/* Floor segmented control */}
                <div className="flex min-w-0 items-center gap-2.5 overflow-x-auto pb-0.5 sm:pb-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Floor</span>
                    <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#171c2b] p-1">
                        {['ALL', ...floors].map((floor) => (
                            <button
                                key={floor}
                                type="button"
                                aria-pressed={currentFloor === floor}
                                onClick={() => setFloor(floor)}
                                className={`cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                                    currentFloor === floor
                                        ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] text-slate-950 font-bold shadow-md'
                                        : 'text-stone-300 hover:text-white'
                                }`}
                            >
                                {floor === 'ALL' ? 'All' : floor}
                            </button>
                        ))}
                    </div>

                    <span className="h-4 w-px bg-white/10" aria-hidden="true"></span>

                    <button
                        type="button"
                        onClick={onWalkInMatch}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 transition hover:bg-amber-400/20 active:scale-[0.98]"
                    >
                        <i className="fa-solid fa-key text-[10px]"></i>
                        <span>Ready for walk-in</span>
                    </button>

                    {onOpenAddRoom && (
                        <button
                            type="button"
                            onClick={onOpenAddRoom}
                            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-[#171c2b] px-2.5 py-1.5 text-[11px] font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
                            title="Add a custom room to inventory"
                        >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                            <span className="hidden sm:inline">Add room</span>
                        </button>
                    )}
                </div>

                {/* Search & reset */}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {currentStatusFilter !== 'ALL' && (
                        <div className="flex animate-fadeIn items-center gap-1.5 rounded-lg border border-white/10 bg-[#171c2b] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-200">
                            <span className="text-stone-400">Filter:</span>
                            <span className="font-bold text-amber-300">{currentStatusFilter}</span>
                            <button
                                type="button"
                                onClick={resetFilters}
                                aria-label="Clear status filter"
                                className="cursor-pointer text-stone-400 transition hover:text-white ml-0.5"
                            >
                                <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                        </div>
                    )}

                    <div className="relative flex-1 sm:w-60">
                        <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-500"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Room, bed type, note…"
                            aria-label="Search rooms by number, type or note"
                            className="w-full rounded-xl border border-white/10 bg-[#171c2b] py-1.5 pl-7 pr-7 text-[11px] text-white placeholder:text-stone-500 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400 transition hover:text-white"
                            >
                                <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onResetDemo}
                        aria-label="Reset rooms to demo layout"
                        className="cursor-pointer rounded-lg border border-white/5 bg-[#171c2b] p-1.5 text-stone-400 transition hover:bg-white/10 hover:text-white"
                        title="Reset rooms to demo layout"
                    >
                        <i className="fa-solid fa-rotate-left text-[11px]"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
