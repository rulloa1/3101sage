import React from 'react';

export default function Toast({ toast }) {
    if (!toast || !toast.visible) return null;

    return (
        <div className="fixed bottom-5 right-5 pointer-events-none z-50 transform translate-y-0 opacity-100 transition-all duration-300 animate-slideUp">
            <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5">
                <i className={`fa-solid ${toast.icon || 'fa-circle-check text-emerald-400'} text-sm`}></i>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}
