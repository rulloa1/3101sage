export const i18n = {
    en: {
        clean: "Clean / Ready",
        cleaning: "In Progress",
        dirty: "Dirty / Vacant",
        occupied: "Occupied",
        maintenance: "Maint / DND",
        dnd: "Do Not Disturb",
        quickActionClean: "Mark Clean",
        quickActionStart: "Start Cleaning",
        selectStatus: "Change Status",
        frontDeskTab: "Desk",
        housekeepingTab: "Housekeeping",
        shiftReportBtn: "Shift Report",
        readinessLabel: "Check-in Readiness:",
        toastCleaned: "marked Clean & Ready",
        toastCleaning: "cleaning in progress",
        houseFloorSelect: "Floor:",
        earlyCheckin: "Early Check-In",
        qcInspection: "QC Inspection",
        handymanAlert: "Handyman Alert"
    },
    es: {
        clean: "Limpia / Lista",
        cleaning: "En Limpieza",
        dirty: "Sucia / Salida",
        occupied: "Ocupada",
        maintenance: "Mantenimiento",
        dnd: "No Molestar",
        quickActionClean: "Marcar Limpia",
        quickActionStart: "Empezar Limpieza",
        selectStatus: "Cambiar Estado",
        frontDeskTab: "Recepción",
        housekeepingTab: "Camaristas",
        shiftReportBtn: "Reporte Turno",
        readinessLabel: "Listas para Check-in:",
        toastCleaned: "marcada Limpia y Lista",
        toastCleaning: "limpieza en progreso",
        houseFloorSelect: "Piso:",
        earlyCheckin: "Llegada Temprana",
        qcInspection: "Inspección de Calidad",
        handymanAlert: "Alerta Mantenimiento"
    }
};

export function getStatusConfig(status, lang = 'en') {
    const dict = i18n[lang] || i18n.en;
    switch (status) {
        case 'clean':
            return {
                bg: 'bg-emerald-600', border: 'border-emerald-300', light: 'bg-emerald-50/70',
                accent: 'bg-emerald-500', dot: 'bg-emerald-500', badge: 'border-emerald-200/80 bg-emerald-50/70 text-emerald-800',
                label: dict.clean, icon: 'fa-circle-check', text: 'text-emerald-600'
            };
        case 'cleaning':
            return {
                bg: 'bg-amber-500', border: 'border-amber-300', light: 'bg-amber-50/70',
                accent: 'bg-amber-500', dot: 'bg-amber-500', badge: 'border-amber-200/80 bg-amber-50/70 text-amber-800',
                label: dict.cleaning, icon: 'fa-arrows-rotate fa-spin', text: 'text-amber-600'
            };
        case 'dirty':
            return {
                bg: 'bg-rose-500', border: 'border-rose-300', light: 'bg-rose-50/70',
                accent: 'bg-rose-400', dot: 'bg-rose-500', badge: 'border-rose-200/80 bg-rose-50/70 text-rose-800',
                label: dict.dirty, icon: 'fa-broom', text: 'text-rose-600'
            };
        case 'occupied':
            return {
                bg: 'bg-blue-600', border: 'border-blue-300', light: 'bg-blue-50/70',
                accent: 'bg-blue-600', dot: 'bg-blue-600', badge: 'border-blue-200/80 bg-blue-50/70 text-blue-800',
                label: dict.occupied, icon: 'fa-user-check', text: 'text-blue-600'
            };
        case 'dnd':
            return {
                bg: 'bg-purple-600', border: 'border-purple-300', light: 'bg-purple-50/70',
                accent: 'bg-purple-500', dot: 'bg-purple-500', badge: 'border-purple-200/80 bg-purple-50/70 text-purple-800',
                label: dict.dnd, icon: 'fa-ban', text: 'text-purple-600'
            };
        default:
            return {
                bg: 'bg-slate-600', border: 'border-slate-300', light: 'bg-slate-100/70',
                accent: 'bg-slate-500', dot: 'bg-slate-500', badge: 'border-slate-200/80 bg-slate-50 text-slate-700',
                label: dict.maintenance, icon: 'fa-wrench', text: 'text-slate-600'
            };
    }
}
