import React from 'react';

export default function Toast({ toast }) {
    if (!toast || !toast.visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
            <div className="animate-slideUp flex items-center gap-2.5 rounded-md border border-paper-300 border-l-2 border-l-brand-600 bg-white px-4 py-2.5 text-xs font-semibold text-stone-900 shadow-2xl backdrop-blur-xl">
                <i className={`fa-solid ${toast.icon || 'fa-circle-check text-emerald-600'} text-sm`}></i>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}
