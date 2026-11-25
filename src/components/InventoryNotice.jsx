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
                className="border-b border-ink-900/[0.07] bg-bone-50/80"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500"></span>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-sm border border-ink-900/[0.1] bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                                    Imported list
                                </span>
                                <strong className="text-[11.5px] font-semibold text-ink-900">
                                    {roomCount} suites from your room list
                                </strong>
                            </div>
                            <p className="mt-0.5 text-[10.5px] font-medium text-stone-500">
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
                            className="cursor-pointer rounded-md border border-ink-900/[0.1] bg-white px-3 py-1.5 text-[10.5px] font-semibold text-ink-900 transition hover:bg-bone-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60"
                        >
                            Replace list
                        </button>
                        <button
                            type="button"
                            onClick={onResetModel}
                            className="cursor-pointer text-[10.5px] font-semibold text-stone-500 underline-offset-2 transition hover:text-ink-900 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass-500/60"
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
            className="border-b border-brass-300/40 bg-[#fbf7ee]"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-2.5 sm:items-center">
                    <i className="fa-solid fa-triangle-exclamation mt-0.5 text-[11px] text-brass-600 sm:mt-0"></i>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-sm border border-brass-400/40 bg-brass-500/[0.14] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-700">
                                Working model
                            </span>
                            <strong className="text-[11.5px] font-semibold text-ink-900">
                                Demo inventory — not the owner's room list
                            </strong>
                        </div>
                        <p className="mt-1 max-w-3xl text-[10.5px] font-medium leading-relaxed text-stone-600">
                            Suite numbers (101–115 / 201–215), the wing split and the bed-type mix are
                            placeholders built from public property data. Don't give this to housekeeping
                            as-is — load the owner's real room list first.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onOpenImport}
                    className="flex flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 self-start rounded-md bg-ink-900 px-3.5 py-2 text-[10.5px] font-semibold text-white transition hover:bg-ink-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/60 sm:self-center"
                >
                    <i className="fa-solid fa-file-arrow-up text-[10px]"></i>
                    Load real room list
                </button>
            </div>
        </section>
    );
}
