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

const eyebrow = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400';
const fieldLabel = 'block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400';
const ghostButton = 'flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-[#171c2b] px-3 py-2 text-[11px] font-semibold text-stone-200 transition hover:bg-white/10 hover:text-white';

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
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#141924] p-6 text-white shadow-2xl">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-lg text-amber-400">
                            <i className="fa-solid fa-file-arrow-up"></i>
                        </div>
                        <div>
                            <p className={eyebrow}>Inventory</p>
                            <h3 id="room-list-title" className="mt-1 font-display text-[21px] leading-none text-white">
                                Load the property's real room list
                            </h3>
                            <p className="mt-1.5 text-[11px] font-medium text-stone-400">
                                Replaces the working model for every device synced to this property
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close room list importer"
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="rounded-xl border border-amber-400/30 border-l-4 border-l-amber-400 bg-amber-400/10 p-3.5 text-[11px] leading-relaxed text-amber-200">
                    <strong className="text-white">The app currently shows a working model:</strong> suite numbers 101–115 / 201–215,
                    an even three-wing split and a placeholder bed mix. Loading a list replaces all of that and
                    marks the inventory as <em>imported</em> everywhere (header, banner and shift report).
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-room-list-template.csv', buildRoomListTemplate())}
                        className={ghostButton}
                    >
                        <i className="fa-solid fa-download text-amber-400"></i>
                        CSV template
                    </button>
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-current-inventory.csv', toRoomCsv(inventory.rooms))}
                        className={ghostButton}
                    >
                        <i className="fa-regular fa-file-lines text-amber-400"></i>
                        Export current list
                    </button>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-stone-400">
                        CSV columns: suite, floor, wing, type, status, notes
                    </span>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="room-list-file"
                        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 bg-[#171c2b] px-4 py-5 text-center transition hover:border-amber-400/60 hover:bg-[#1b2234]"
                    >
                        <i className="fa-solid fa-cloud-arrow-up text-lg text-amber-400"></i>
                        <span className="text-xs font-semibold text-white">
                            Choose a .csv or .json file
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-stone-400">or paste the rows below</span>
                        <input
                            id="room-list-file"
                            type="file"
                            accept=".csv,.json,text/csv,application/json"
                            onChange={handleFile}
                            className="sr-only"
                        />
                    </label>

                    {fileName && (
                        <p className="text-[11px] font-semibold text-amber-400">
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
                        className="w-full rounded-xl border border-white/10 bg-[#171c2b] p-3 font-mono text-[11px] leading-relaxed text-amber-100 placeholder-stone-500 outline-none transition focus:border-amber-400/50"
                    />
                </div>

                {fileError && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-2.5 text-[11px] font-semibold text-rose-300">
                        {fileError}
                    </p>
                )}

                {hasInput && parsed.errors.length > 0 && (
                    <div aria-live="polite" className="space-y-1.5 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                            Fix {parsed.errors.length} issue{parsed.errors.length === 1 ? '' : 's'} before loading
                        </p>
                        <ul className="max-h-28 space-y-1 overflow-y-auto text-[11px] font-medium text-rose-200">
                            {parsed.errors.slice(0, 12).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                        {parsed.errors.length > 12 && (
                            <p className="text-[10px] font-semibold text-rose-400">
                                …and {parsed.errors.length - 12} more.
                            </p>
                        )}
                    </div>
                )}

                {hasInput && parsed.warnings.length > 0 && (
                    <div aria-live="polite" className="space-y-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                            Warnings
                        </p>
                        <ul className="max-h-24 space-y-1 overflow-y-auto text-[11px] font-medium text-amber-200">
                            {parsed.warnings.slice(0, 8).map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {canImport && (
                    <div className="space-y-2">
                        <div aria-live="polite" className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#171c2b] p-3 text-[11px] font-semibold text-white">
                            <i className="fa-solid fa-circle-check text-emerald-400"></i>
                            <span>
                                <span className="font-display text-sm">{parsed.rooms.length}</span> suites
                                <span className="mx-1.5 text-stone-500">/</span>
                                <span className="font-display text-sm">{floorCount}</span> floor{floorCount === 1 ? '' : 's'} ready to load
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-[11px]">
                                <thead className="border-b border-white/10 bg-[#171c2b] text-[10px] uppercase tracking-[0.12em] text-stone-400">
                                    <tr>
                                        <th className="px-2.5 py-2 font-semibold">Suite</th>
                                        <th className="px-2.5 py-2 font-semibold">Floor</th>
                                        <th className="px-2.5 py-2 font-semibold">Wing</th>
                                        <th className="px-2.5 py-2 font-semibold">Type</th>
                                        <th className="px-2.5 py-2 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-[#141924]">
                                    {parsed.rooms.slice(0, 6).map((room) => {
                                        const cfg = getStatusConfig(room.status, 'en');
                                        return (
                                            <tr key={room.id} className="text-stone-200">
                                                <td className="px-2.5 py-1.5 font-semibold tabular-nums text-white">{room.id}</td>
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
                            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-stone-400">
                                Showing the first 6 of {parsed.rooms.length} suites.
                            </p>
                        )}
                    </div>
                )}

                <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-white/10 bg-[#141924]/95 px-6 pb-4 pt-3 backdrop-blur">
                    <div>
                        {isImported && (
                            <button
                                type="button"
                                onClick={onResetModel}
                                className="cursor-pointer rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 underline-offset-4 transition hover:text-rose-400 hover:underline"
                            >
                                Reset to working model
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl border border-white/10 bg-[#1b2230] px-4 py-2 text-[11px] font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onImport(parsed.rooms, fileName || 'pasted list')}
                            disabled={!canImport}
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#d4af37] px-4.5 py-2 text-[11px] font-bold text-slate-950 shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
