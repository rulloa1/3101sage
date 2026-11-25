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
        <section className="border-b border-ink-900/[0.07] bg-white/60 px-4 py-2.5 backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2.5 text-xs">
                {/* Floor segmented control */}
                <div className="flex min-w-0 items-center gap-2.5 overflow-x-auto pb-0.5 sm:pb-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">Floor</span>
                    <div className="flex items-center gap-0.5 rounded-lg border border-ink-900/[0.07] bg-bone-100/70 p-0.5">
                        {['ALL', ...floors].map((floor) => (
                            <button
                                key={floor}
                                type="button"
                                aria-pressed={currentFloor === floor}
                                onClick={() => setFloor(floor)}
                                className={`cursor-pointer whitespace-nowrap rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60 ${
                                    currentFloor === floor
                                        ? 'bg-white text-ink-900 shadow-[0_1px_2px_rgba(16,20,26,0.10)]'
                                        : 'text-stone-600 hover:text-ink-900'
                                }`}
                            >
                                {floor === 'ALL' ? 'All' : floor}
                            </button>
                        ))}
                    </div>

                    <span className="h-5 w-px bg-ink-900/[0.08]" aria-hidden="true"></span>

                    <button
                        type="button"
                        onClick={onWalkInMatch}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold text-brass-700 transition hover:bg-brass-500/[0.09] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60"
                    >
                        <i className="fa-solid fa-key text-[10px]"></i>
                        <span>Ready for walk-in</span>
                    </button>

                    {onOpenAddRoom && (
                        <button
                            type="button"
                            onClick={onOpenAddRoom}
                            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold text-stone-500 transition hover:bg-ink-900/[0.04] hover:text-ink-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60"
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
                        <div className="flex animate-fadeIn items-center gap-1.5 rounded-md border border-ink-900/[0.08] bg-bone-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-800">
                            <span className="text-stone-500">Filter</span>
                            <span className="normal-case tracking-normal">{currentStatusFilter}</span>
                            <button
                                type="button"
                                onClick={resetFilters}
                                aria-label="Clear status filter"
                                className="cursor-pointer text-stone-500 transition hover:text-ink-900"
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
                            className="w-full rounded-lg border border-ink-900/[0.09] bg-white py-1.5 pl-7 pr-7 text-[11px] text-ink-900 placeholder:text-stone-500 focus:border-brass-500/40 focus:outline-none focus:ring-2 focus:ring-brass-500/15"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-stone-500 transition hover:text-ink-900"
                            >
                                <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onResetDemo}
                        aria-label="Reset rooms to demo layout"
                        className="cursor-pointer rounded-md p-1.5 text-stone-500 transition hover:bg-ink-900/[0.04] hover:text-ink-900"
                        title="Reset rooms to demo layout"
                    >
                        <i className="fa-solid fa-rotate-left text-[11px]"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
