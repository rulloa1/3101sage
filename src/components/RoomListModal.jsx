import React, { useEffect, useMemo, useState } from 'react';
import { getStatusConfig } from '../constants/i18n';
import {
    buildRoomListTemplate,
    parseRoomListText,
    toRoomCsv
} from '../constants/inventory';

function downloadFile(name, content, type = 'text/csv;charset=utf-8') {
    try {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
        // Download may be blocked; the current list is still visible on screen.
    }
}

const eyebrow = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500';
const fieldLabel = 'block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500';
const ghostButton = 'flex cursor-pointer items-center gap-1.5 rounded-md border border-ink-900/[0.12] bg-white px-3 py-2 text-[11px] font-semibold text-ink-800 transition hover:border-ink-900/25 hover:bg-bone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25';

export default function RoomListModal({
    isOpen,
    onClose,
    inventory,
    onImport,
    onResetModel
}) {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setText('');
            setFileName('');
            setFileError('');
        }
    }, [isOpen]);

    const parsed = useMemo(
        () => (text.trim() ? parseRoomListText(text) : { rooms: [], errors: [], warnings: [] }),
        [text]
    );

    if (!isOpen) return null;

    const hasInput = text.trim().length > 0;
    const canImport = hasInput && parsed.rooms.length > 0 && parsed.errors.length === 0;
    const floorCount = new Set(parsed.rooms.map(room => room.floor)).size;
    const isImported = inventory?.source === 'imported';

    const handleFile = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            setFileError('That file is over 1 MB. Trim the list or paste only the room rows.');
            return;
        }

        try {
            const content = await file.text();
            setText(content);
            setFileName(file.name);
            setFileError('');
        } catch (e) {
            setFileError('Could not read that file. Try a .csv or .json export.');
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-list-title"
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl border border-ink-900/[0.08] bg-white p-6 shadow-panel">
                <div className="flex items-start justify-between gap-3 border-b border-ink-900/[0.07] pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bone-100 text-lg text-brass-600">
                            <i className="fa-solid fa-file-arrow-up"></i>
                        </div>
                        <div>
                            <p className={eyebrow}>Inventory</p>
                            <h3 id="room-list-title" className="mt-1 font-display text-[21px] leading-none text-ink-900">
                                Load the property's real room list
                            </h3>
                            <p className="mt-1.5 text-[11px] font-medium text-stone-500">
                                Replaces the working model for every device synced to this property
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close room list importer"
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-md text-stone-500 transition hover:bg-bone-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="rounded-md border border-brass-400/40 border-l-2 border-l-brass-500 bg-brass-500/[0.07] p-3.5 text-[11px] leading-relaxed text-brass-700">
                    <strong className="text-ink-900">The app currently shows a working model:</strong> suite numbers 101–115 / 201–215,
                    an even three-wing split and a placeholder bed mix. Loading a list replaces all of that and
                    marks the inventory as <em>imported</em> everywhere (header, banner and shift report).
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-room-list-template.csv', buildRoomListTemplate())}
                        className={ghostButton}
                    >
                        <i className="fa-solid fa-download text-brass-600"></i>
                        CSV template
                    </button>
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-current-inventory.csv', toRoomCsv(inventory.rooms))}
                        className={ghostButton}
                    >
                        <i className="fa-regular fa-file-lines text-brass-600"></i>
                        Export current list
                    </button>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500">
                        CSV columns: suite, floor, wing, type, status, notes
                    </span>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="room-list-file"
                        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-900/20 bg-bone-50/60 px-4 py-5 text-center transition hover:border-brass-400/70 hover:bg-bone-50"
                    >
                        <i className="fa-solid fa-cloud-arrow-up text-lg text-brass-600"></i>
                        <span className="text-xs font-semibold text-ink-800">
                            Choose a .csv or .json file
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-stone-500">or paste the rows below</span>
                        <input
                            id="room-list-file"
                            type="file"
                            accept=".csv,.json,text/csv,application/json"
                            onChange={handleFile}
                            className="sr-only"
                        />
                    </label>

                    {fileName && (
                        <p className="text-[11px] font-semibold text-brass-700">
                            <i className="fa-solid fa-paperclip mr-1"></i>{fileName}
                        </p>
                    )}

                    <label htmlFor="room-list-text" className={fieldLabel}>
                        Paste room list
                    </label>
                    <textarea
                        id="room-list-text"
                        value={text}
                        onChange={(e) => { setText(e.target.value); setFileName(''); }}
                        rows={5}
                        spellCheck={false}
                        placeholder={'suite,floor,wing,type,status,notes\n101,1,North Wing,1BR Queen Suite,clean,\n102,1,North Wing,2-Queen Suite,dirty,Check-in 3 PM'}
                        className="w-full rounded-md border border-ink-900/[0.12] bg-bone-50/60 p-3 font-mono text-[11px] leading-relaxed text-ink-800 outline-none transition focus:border-brass-500/40 focus:bg-white focus:ring-2 focus:ring-brass-500/20"
                    />
                </div>

                {fileError && (
                    <p className="rounded-md border border-rose-200 bg-rose-50/70 p-2.5 text-[11px] font-semibold text-rose-800">
                        {fileError}
                    </p>
                )}

                {hasInput && parsed.errors.length > 0 && (
                    <div aria-live="polite" className="space-y-1.5 rounded-md border border-rose-200 bg-rose-50/70 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-700">
                            Fix {parsed.errors.length} issue{parsed.errors.length === 1 ? '' : 's'} before loading
                        </p>
                        <ul className="max-h-28 space-y-1 overflow-y-auto text-[11px] font-medium text-rose-800">
                            {parsed.errors.slice(0, 12).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                        {parsed.errors.length > 12 && (
                            <p className="text-[10px] font-semibold text-rose-600">
                                …and {parsed.errors.length - 12} more.
                            </p>
                        )}
                    </div>
                )}

                {hasInput && parsed.warnings.length > 0 && (
                    <div aria-live="polite" className="space-y-1.5 rounded-md border border-brass-400/40 bg-brass-500/[0.07] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-700">
                            Warnings
                        </p>
                        <ul className="max-h-24 space-y-1 overflow-y-auto text-[11px] font-medium text-brass-700">
                            {parsed.warnings.slice(0, 8).map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {canImport && (
                    <div className="space-y-2">
                        <div aria-live="polite" className="flex flex-wrap items-center gap-2 rounded-md border border-ink-900/[0.08] bg-bone-50 p-3 text-[11px] font-semibold text-ink-800">
                            <i className="fa-solid fa-circle-check text-emerald-600"></i>
                            <span>
                                <span className="font-display text-sm">{parsed.rooms.length}</span> suites
                                <span className="mx-1.5 text-stone-300">/</span>
                                <span className="font-display text-sm">{floorCount}</span> floor{floorCount === 1 ? '' : 's'} ready to load
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-md border border-ink-900/[0.08]">
                            <table className="w-full text-left text-[11px]">
                                <thead className="border-b border-ink-900/[0.08] bg-bone-50 text-[10px] uppercase tracking-[0.12em] text-stone-500">
                                    <tr>
                                        <th className="px-2.5 py-2 font-semibold">Suite</th>
                                        <th className="px-2.5 py-2 font-semibold">Floor</th>
                                        <th className="px-2.5 py-2 font-semibold">Wing</th>
                                        <th className="px-2.5 py-2 font-semibold">Type</th>
                                        <th className="px-2.5 py-2 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-ink-900/[0.05]">
                                    {parsed.rooms.slice(0, 6).map((room) => {
                                        const cfg = getStatusConfig(room.status, 'en');
                                        return (
                                            <tr key={room.id} className="text-ink-800">
                                                <td className="px-2.5 py-1.5 font-semibold tabular-nums">{room.id}</td>
                                                <td className="px-2.5 py-1.5 tabular-nums">{room.floor}</td>
                                                <td className="px-2.5 py-1.5">{room.wing || '—'}</td>
                                                <td className="px-2.5 py-1.5">{room.type}</td>
                                                <td className="px-2.5 py-1.5">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${cfg.badge}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}></span>
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {parsed.rooms.length > 6 && (
                            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500">
                                Showing the first 6 of {parsed.rooms.length} suites.
                            </p>
                        )}
                    </div>
                )}

                <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-b-xl border-t border-ink-900/[0.07] bg-white/95 px-6 pb-4 pt-3 backdrop-blur">
                    <div>
                        {isImported && (
                            <button
                                type="button"
                                onClick={onResetModel}
                                className="cursor-pointer rounded-md px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500 underline-offset-4 transition hover:text-rose-700 hover:underline"
                            >
                                Reset to working model
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-md px-3.5 py-2 text-[11px] font-semibold text-stone-500 transition hover:bg-bone-50 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/25"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onImport(parsed.rooms, fileName || 'pasted list')}
                            disabled={!canImport}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ink-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-ink-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <i className="fa-solid fa-file-import"></i>
                            <span>Load {parsed.rooms.length > 0 ? `${parsed.rooms.length} suites` : 'room list'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
