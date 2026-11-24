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
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="animate-scaleIn max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-start gap-2.5">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-lg text-amber-600 shadow-xs">
                            <i className="fa-solid fa-file-arrow-up"></i>
                        </div>
                        <div>
                            <h3 id="room-list-title" className="text-base font-bold text-slate-800">
                                Load the property's real room list
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-400">
                                Replaces the working model for every device synced to this property
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close room list importer"
                        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                    <strong>The app currently shows a working model:</strong> suite numbers 101–115 / 201–215,
                    an even three-wing split and a placeholder bed mix. Loading a list replaces all of that and
                    marks the inventory as <em>imported</em> everywhere (header, banner and shift report).
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-room-list-template.csv', buildRoomListTemplate())}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        <i className="fa-solid fa-download text-slate-500"></i>
                        CSV template
                    </button>
                    <button
                        type="button"
                        onClick={() => downloadFile('3101-sage-current-inventory.csv', toRoomCsv(inventory.rooms))}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        <i className="fa-solid fa-file-csv text-slate-500"></i>
                        Export current list
                    </button>
                    <span className="text-[10px] font-medium text-slate-400">
                        CSV columns: suite, floor, wing, type, status, notes
                    </span>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="room-list-file"
                        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
                    >
                        <i className="fa-solid fa-cloud-arrow-up text-lg text-indigo-500"></i>
                        <span className="text-xs font-bold text-slate-700">
                            Choose a .csv or .json file
                        </span>
                        <span className="text-[10px] text-slate-400">or paste the rows below</span>
                        <input
                            id="room-list-file"
                            type="file"
                            accept=".csv,.json,text/csv,application/json"
                            onChange={handleFile}
                            className="sr-only"
                        />
                    </label>

                    {fileName && (
                        <p className="text-[11px] font-semibold text-indigo-700">
                            <i className="fa-solid fa-paperclip mr-1"></i>{fileName}
                        </p>
                    )}

                    <label htmlFor="room-list-text" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Paste room list
                    </label>
                    <textarea
                        id="room-list-text"
                        value={text}
                        onChange={(e) => { setText(e.target.value); setFileName(''); }}
                        rows={5}
                        spellCheck={false}
                        placeholder={'suite,floor,wing,type,status,notes\n101,1,North Wing,1BR Queen Suite,clean,\n102,1,North Wing,2-Queen Suite,dirty,Check-in 3 PM'}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {fileError && (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-[11px] font-bold text-rose-800">
                        {fileError}
                    </p>
                )}

                {hasInput && parsed.errors.length > 0 && (
                    <div aria-live="polite" className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 p-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
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
                    <div aria-live="polite" className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                            Warnings
                        </p>
                        <ul className="max-h-24 space-y-1 overflow-y-auto text-[11px] font-medium text-amber-900">
                            {parsed.warnings.slice(0, 8).map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {canImport && (
                    <div className="space-y-2">
                        <div aria-live="polite" className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] font-bold text-emerald-900">
                            <i className="fa-solid fa-circle-check text-emerald-600"></i>
                            <span>{parsed.rooms.length} suites · {floorCount} floor{floorCount === 1 ? '' : 's'} ready to load</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-[11px]">
                                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-2.5 py-1.5">Suite</th>
                                        <th className="px-2.5 py-1.5">Floor</th>
                                        <th className="px-2.5 py-1.5">Wing</th>
                                        <th className="px-2.5 py-1.5">Type</th>
                                        <th className="px-2.5 py-1.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {parsed.rooms.slice(0, 6).map((room) => {
                                        const cfg = getStatusConfig(room.status, 'en');
                                        return (
                                            <tr key={room.id} className="text-slate-700">
                                                <td className="px-2.5 py-1.5 font-bold">{room.id}</td>
                                                <td className="px-2.5 py-1.5">{room.floor}</td>
                                                <td className="px-2.5 py-1.5">{room.wing || '—'}</td>
                                                <td className="px-2.5 py-1.5">{room.type}</td>
                                                <td className="px-2.5 py-1.5">
                                                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${cfg.softBg} ${cfg.softBorder} ${cfg.softText}`}>
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
                            <p className="text-[10px] font-medium text-slate-400">
                                Showing the first 6 of {parsed.rooms.length} suites.
                            </p>
                        )}
                    </div>
                )}

                <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex flex-wrap items-center justify-between gap-2 rounded-b-3xl border-t border-slate-100 bg-white/95 px-6 pb-4 pt-3 backdrop-blur">
                    <div>
                        {isImported && (
                            <button
                                type="button"
                                onClick={onResetModel}
                                className="cursor-pointer rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-500 underline-offset-2 transition hover:text-rose-700 hover:underline"
                            >
                                Reset to working model
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onImport(parsed.rooms, fileName || 'pasted list')}
                            disabled={!canImport}
                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
