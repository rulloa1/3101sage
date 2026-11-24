import React from 'react';

export default function Toast({ toast }) {
    if (!toast || !toast.visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="animate-slideUp pointer-events-none fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)]"
        >
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl">
                <i className={`fa-solid ${toast.icon || 'fa-circle-check text-emerald-400'} text-sm`}></i>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}
