import React from 'react';

export default function InventoryNotice({ inventory, onOpenImport, onResetModel }) {
    const isImported = inventory?.source === 'imported';
    const roomCount = inventory?.rooms?.length || 0;
    const importedAt = inventory?.importedAt
        ? new Date(inventory.importedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
        : null;

    if (isImported) {
        return (
            <section
                aria-label="Inventory source"
                className="border-b border-white/10 bg-[#121622] px-4 py-2 sm:px-6"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2.5">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400"></span>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-sm border border-emerald-500/40 bg-emerald-500/20 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-300">
                                    Imported list
                                </span>
                                <strong className="text-xs font-semibold text-white">
                                    {roomCount} suites from your real room list
                                </strong>
                            </div>
                            <p className="mt-0.5 text-[10.5px] font-medium text-stone-400">
                                {inventory.fileName || 'Pasted list'}
                                {importedAt ? ` · loaded ${importedAt}` : ''}
                                {' '}· live synced to all front desk &amp; housekeeping devices.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={onOpenImport}
                            className="cursor-pointer rounded-lg border border-white/10 bg-[#171c2b] px-3 py-1.5 text-[11px] font-semibold text-stone-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                        >
                            Replace list
                        </button>
                        <button
                            type="button"
                            onClick={onResetModel}
                            className="cursor-pointer text-[10.5px] font-semibold text-stone-400 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                        >
                            Reset to model
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            aria-label="Inventory source"
            className="border-b border-amber-400/20 bg-[#151924] px-4 py-2.5 sm:px-6 text-stone-200"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                    <i className="fa-solid fa-triangle-exclamation mt-0.5 text-xs text-amber-400"></i>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-sm border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#e5c05b]">
                                Working model
                            </span>
                            <strong className="text-xs font-semibold text-white">
                                Demo inventory &mdash; not the owner's real key list
                            </strong>
                        </div>
                        <p className="mt-0.5 text-[10.5px] text-stone-400">
                            Suite numbers (101&ndash;115 / 201&ndash;215), wings and bed-types are based on public property records.
                        </p>
                    </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onOpenImport}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.98]"
                    >
                        <i className="fa-solid fa-file-import text-[11px]"></i>
                        <span>Load real room list</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
