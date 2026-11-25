import React from 'react';

export default function Toast({ toast }) {
    if (!toast || !toast.visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="animate-slideUp pointer-events-none fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)]"
        >
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-ink-950/95 px-4 py-2.5 text-[12px] font-medium text-stone-100 shadow-[0_18px_40px_-18px_rgba(13,15,18,0.6)] backdrop-blur-sm">
                <i className={`fa-solid ${toast.icon || 'fa-circle-check text-emerald-400'} text-[13px]`}></i>
                <span className="leading-snug">{toast.message}</span>
            </div>
        </div>
    );
}
