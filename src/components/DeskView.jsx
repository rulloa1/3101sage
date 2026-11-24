import React, { useState } from 'react';
import { getStatusConfig, i18n } from '../constants/i18n';

function getCleaningMinutes(startedAt) {
    if (!startedAt) return null;
    const elapsedMs = Date.now() - startedAt;
    return Math.max(1, Math.floor(elapsedMs / 60000));
}

export default function DeskView({
    rooms,
    currentLang,
    viewLayout = 'cards',
    onChangeStatus,
    onOpenQc,
    onOpenEdit,
    onOpenKeycard,
    onCheckout
}) {
    const [confirmingCheckoutId, setConfirmingCheckoutId] = useState(null);
    const [guestName, setGuestName] = useState('');
    const dict = i18n[currentLang] || i18n.en;

    if (rooms.length === 0) {
        return null;
    }

    const handleCheckoutConfirm = (roomId) => {
        onCheckout(roomId, guestName.trim());
        setConfirmingCheckoutId(null);
        setGuestName('');
    };

    const handleCheckoutCancel = () => {
        setConfirmingCheckoutId(null);
        setGuestName('');
    };

    if (viewLayout === 'table') {
        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-4 py-2.5">{dict.suiteLabel}</th>
                                <th className="px-3 py-2.5">Type</th>
                                <th className="hidden px-3 py-2.5 sm:table-cell">Location</th>
                                <th className="px-3 py-2.5">Status</th>
                                <th className="hidden px-3 py-2.5 md:table-cell">Notes / Timer</th>
                                <th className="px-4 py-2.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rooms.map((room) => {
                                const cfg = getStatusConfig(room.status, currentLang);
                                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;
                                const isConfirming = confirmingCheckoutId === room.id;

                                return (
                                    <tr
                                        key={room.id}
                                        className="transition hover:bg-slate-50/80"
                                    >
                                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-sm font-extrabold text-slate-900 tabular-nums">
                                            {room.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-700">
                                            {room.type}
                                        </td>
                                        <td className="hidden whitespace-nowrap px-3 py-2.5 text-slate-500 sm:table-cell">
                                            {dict.floorLabel} {room.floor}
                                            {room.wing ? ` · ${room.wing}` : ''}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cfg.softBg} ${cfg.softBorder} ${cfg.softText}`}
                                            >
                                                <i className={`fa-solid ${cfg.icon} text-[10px]`}></i>
                                                <span>{cfg.label}</span>
                                            </span>
                                        </td>
                                        <td className="hidden max-w-xs px-3 py-2.5 md:table-cell">
                                            <div className="flex items-center gap-2 truncate">
                                                {cleaningMins && (
                                                    <span className="font-mono text-[11px] font-bold text-amber-700 tabular-nums">
                                                        {cleaningMins}m
                                                    </span>
                                                )}
                                                {room.notes ? (
                                                    <span className="truncate font-medium text-slate-700" title={room.notes}>
                                                        {room.notes}
                                                    </span>
                                                ) : !cleaningMins ? (
                                                    <span className="text-slate-300">&mdash;</span>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-right">
                                            {isConfirming ? (
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    <input
                                                        type="text"
                                                        value={guestName}
                                                        onChange={(e) => setGuestName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleCheckoutConfirm(room.id);
                                                            if (e.key === 'Escape') handleCheckoutCancel();
                                                        }}
                                                        placeholder={dict.guestNamePlaceholder}
                                                        autoFocus
                                                        className="w-36 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCheckoutConfirm(room.id)}
                                                        className="cursor-pointer rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
                                                    >
                                                        OK
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCheckoutCancel}
                                                        aria-label="Cancel checkout"
                                                        className="cursor-pointer rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    {room.status === 'dirty' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onChangeStatus(room.id, 'cleaning')}
                                                            className="cursor-pointer rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-amber-700"
                                                        >
                                                            {dict.quickActionStart}
                                                        </button>
                                                    )}
                                                    {room.status === 'cleaning' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onOpenQc(room.id)}
                                                            className="cursor-pointer rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-700"
                                                        >
                                                            {dict.quickActionQc}
                                                        </button>
                                                    )}
                                                    {room.status === 'clean' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onChangeStatus(room.id, 'occupied')}
                                                            className="cursor-pointer rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                                                        >
                                                            {dict.quickActionCheckIn}
                                                        </button>
                                                    )}
                                                    {room.status === 'occupied' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmingCheckoutId(room.id)}
                                                            className="cursor-pointer rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-blue-700"
                                                        >
                                                            {dict.quickActionCheckOut}
                                                        </button>
                                                    )}
                                                    {(room.status === 'maintenance' || room.status === 'dnd') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onChangeStatus(room.id, 'dirty')}
                                                            className="cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                                        >
                                                            {dict.quickActionMarkDirty}
                                                        </button>
                                                    )}

                                                    {onOpenKeycard && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onOpenKeycard(room.id)}
                                                            title={dict.printKeycard}
                                                            aria-label={`${dict.printKeycard} ${room.id}`}
                                                            className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                                        >
                                                            <i className="fa-solid fa-qrcode text-[11px]"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => onOpenEdit(room.id)}
                                                        title={dict.editRoom}
                                                        aria-label={`${dict.editRoom} ${room.id}`}
                                                        className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <i className="fa-solid fa-sliders text-[11px]"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {rooms.map((room) => {
                const cfg = getStatusConfig(room.status, currentLang);
                const cleaningMins = room.status === 'cleaning' ? getCleaningMinutes(room.cleaningStartedAt) : null;
                const isDirty = room.status === 'dirty';
                const isCleaning = room.status === 'cleaning';
                const isClean = room.status === 'clean';
                const isOccupied = room.status === 'occupied';
                const isConfirming = confirmingCheckoutId === room.id;

                return (
                    <article
                        key={room.id}
                        className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-white transition hover:border-slate-300 ${cfg.border}`}
                    >
                        {/* Subtle 2px top status rail */}
                        <span className={`block h-0.5 w-full ${cfg.bar}`} aria-hidden="true"></span>

                        <div className="p-4">
                            {/* Header row: Suite # & semantic status tag */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-mono text-xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                                            {room.id}
                                        </h3>
                                        <span className="text-xs font-medium text-slate-500">
                                            {dict.floorLabel} {room.floor}
                                            {room.wing ? ` · ${room.wing}` : ''}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                                        {room.type}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cfg.softBg} ${cfg.softBorder} ${cfg.softText}`}
                                >
                                    <i className={`fa-solid ${cfg.icon} text-[10px]`}></i>
                                    <span>{cfg.label}</span>
                                </span>
                            </div>

                            {/* Cleaning timer & notes */}
                            <div className="mt-3 space-y-2">
                                {cleaningMins && (
                                    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-xs">
                                        <span className="font-medium text-amber-800">
                                            <i className="fa-regular fa-clock mr-1.5 text-amber-600"></i>
                                            {dict.activeCleaning}
                                        </span>
                                        <span className="font-mono font-bold text-amber-900 tabular-nums">
                                            {cleaningMins} min
                                        </span>
                                    </div>
                                )}

                                {room.notes ? (
                                    <p className="rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 text-xs leading-relaxed text-slate-700">
                                        <i className="fa-regular fa-note-sticky mr-1.5 text-slate-400"></i>
                                        {room.notes}
                                    </p>
                                ) : (
                                    <p className="py-1 text-xs text-slate-400">{dict.noNotes}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
                            {isConfirming ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCheckoutConfirm(room.id);
                                            if (e.key === 'Escape') handleCheckoutCancel();
                                        }}
                                        placeholder={dict.guestNamePlaceholder}
                                        autoFocus
                                        aria-label={`Guest name for suite ${room.id} checkout`}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleCheckoutConfirm(room.id)}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-[11px]"></i>
                                            <span>{dict.confirmCheckout}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCheckoutCancel}
                                            aria-label="Cancel checkout"
                                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    {isDirty && (
                                        <button
                                            type="button"
                                            onClick={() => onChangeStatus(room.id, 'cleaning')}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98]"
                                        >
                                            <i className="fa-solid fa-play text-[10px]"></i>
                                            <span>{dict.quickActionStart}</span>
                                        </button>
                                    )}

                                    {isCleaning && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenQc(room.id)}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                                            title="Verify 3-point QC inspection and mark clean"
                                        >
                                            <i className="fa-solid fa-clipboard-check text-[11px]"></i>
                                            <span>{dict.quickActionQc}</span>
                                        </button>
                                    )}

                                    {isClean && (
                                        <button
                                            type="button"
                                            onClick={() => onChangeStatus(room.id, 'occupied')}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                                        >
                                            <i className="fa-solid fa-key text-[10px] text-emerald-400"></i>
                                            <span>{dict.quickActionCheckIn}</span>
                                        </button>
                                    )}

                                    {isOccupied && (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmingCheckoutId(room.id)}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            <i className="fa-solid fa-right-from-bracket text-[11px]"></i>
                                            <span>{dict.quickActionCheckOut}</span>
                                        </button>
                                    )}

                                    {!isDirty && !isCleaning && !isClean && !isOccupied && (
                                        <button
                                            type="button"
                                            onClick={() => onChangeStatus(room.id, 'dirty')}
                                            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 active:scale-[0.98]"
                                        >
                                            <i className="fa-solid fa-broom text-[11px]"></i>
                                            <span>{dict.quickActionMarkDirty}</span>
                                        </button>
                                    )}

                                    {onOpenKeycard && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenKeycard(room.id)}
                                            aria-label={`${dict.printKeycard} ${room.id}`}
                                            title={dict.printKeycard}
                                            className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            <i className="fa-solid fa-qrcode text-[11px]"></i>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onOpenEdit(room.id)}
                                        aria-label={`${dict.editRoom} ${room.id}`}
                                        title={dict.editRoom}
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <i className="fa-solid fa-sliders text-[11px]"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
