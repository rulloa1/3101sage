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
                className="border-b border-emerald-200 bg-emerald-50/80"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-start gap-2.5">
                        <i className="fa-solid fa-circle-check mt-0.5 text-sm text-emerald-600"></i>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                                    Imported list
                                </span>
                                <strong className="text-xs font-bold text-emerald-900">
                                    {roomCount} suites from your room list
                                </strong>
                            </div>
                            <p className="mt-0.5 text-[11px] font-medium text-emerald-800/80">
                                {inventory.fileName || 'Pasted list'}
                                {importedAt ? ` · loaded ${importedAt}` : ''}
                                {' '}· suite numbers, wings and bed types are yours.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={onOpenImport}
                            className="cursor-pointer rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                            Replace list
                        </button>
                        <button
                            type="button"
                            onClick={onResetModel}
                            className="cursor-pointer rounded-lg px-2 py-1.5 text-[11px] font-semibold text-emerald-700/80 underline-offset-2 transition hover:text-emerald-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
            className="border-b-2 border-amber-300 bg-amber-50"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-2.5">
                    <i className="fa-solid fa-triangle-exclamation mt-0.5 text-sm text-amber-600"></i>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950">
                                Working model
                            </span>
                            <strong className="text-xs font-bold text-amber-950">
                                Demo inventory — not the owner's room list
                            </strong>
                        </div>
                        <p className="mt-1 max-w-3xl text-[11px] font-medium leading-relaxed text-amber-900/85">
                            Suite numbers (101–115 / 201–215), the wing split and the bed-type mix are
                            placeholders built from public property data. Don't give this to housekeeping
                            as-is — load the owner's real room list first.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onOpenImport}
                    className="flex flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 self-start rounded-xl bg-amber-500 px-3.5 py-2 text-[11px] font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 sm:self-center"
                >
                    <i className="fa-solid fa-file-arrow-up"></i>
                    Load real room list
                </button>
            </div>
        </section>
    );
}
