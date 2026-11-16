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
    onResetDemo
}) {
    return (
        <section className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Floor Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-slate-400 font-bold mr-1 uppercase tracking-wider text-[11px]">Floor:</span>
                    {['ALL', '1', '2', '3'].map((floor) => (
                        <button
                            key={floor}
                            onClick={() => setFloor(floor)}
                            className={`cursor-pointer px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                                currentFloor === floor
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {floor === 'ALL' ? 'All Floors' : `Floor ${floor}`}
                        </button>
                    ))}

                    {/* Quick Walk-in Matcher Button */}
                    <button 
                        onClick={onWalkInMatch} 
                        className="cursor-pointer ml-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition flex items-center gap-1.5 shadow-xs active:scale-95"
                    >
                        <i className="fa-solid fa-key text-amber-600 text-xs"></i>
                        <span>Quick Match: Ready for Walk-in</span>
                    </button>

                    {/* Add Room Button */}
                    {onOpenAddRoom && (
                        <button 
                            type="button"
                            onClick={onOpenAddRoom} 
                            className="cursor-pointer ml-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1.5 active:scale-95"
                            title="Add a custom room to inventory"
                        >
                            <i className="fa-solid fa-plus text-amber-600"></i>
                            <span className="hidden sm:inline">Add Room</span>
                        </button>
                    )}
                </div>

                {/* Search & Reset */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Active Filter Pill */}
                    {currentStatusFilter !== 'ALL' && (
                        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-fadeIn">
                            <span>Filter:</span>
                            <span className="capitalize">{currentStatusFilter}</span>
                            <button onClick={resetFilters} className="cursor-pointer text-indigo-500 hover:text-indigo-800 ml-0.5">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-56">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Room #, King, note..."
                            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="cursor-pointer absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>

                    {/* Reset Demo State Button */}
                    <button
                        onClick={onResetDemo}
                        className="cursor-pointer text-slate-400 hover:text-indigo-600 text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="Reset rooms to demo layout"
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
