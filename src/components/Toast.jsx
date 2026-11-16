import React from 'react';

export default function Toast({ toast }) {
    if (!toast || !toast.visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
            <div className="animate-slideUp flex items-center gap-2.5 rounded-xl border border-white/12 border-l-2 border-l-brand-500 bg-ink-800/95 px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-2xl backdrop-blur-xl">
                <i className={`fa-solid ${toast.icon || 'fa-circle-check text-emerald-400'} text-sm`}></i>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}
