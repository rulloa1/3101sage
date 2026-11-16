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
            return { bg: 'bg-emerald-600', border: 'border-emerald-500/25', light: 'bg-emerald-500/[0.08]', label: dict.clean, icon: 'fa-circle-check', text: 'text-emerald-400' };
        case 'cleaning':
            return { bg: 'bg-amber-500', border: 'border-amber-500/25', light: 'bg-amber-500/[0.08]', label: dict.cleaning, icon: 'fa-arrows-rotate fa-spin', text: 'text-amber-400' };
        case 'dirty':
            return { bg: 'bg-rose-500', border: 'border-rose-500/25', light: 'bg-rose-500/[0.08]', label: dict.dirty, icon: 'fa-broom', text: 'text-rose-400' };
        case 'occupied':
            return { bg: 'bg-blue-600', border: 'border-blue-500/25', light: 'bg-blue-500/[0.08]', label: dict.occupied, icon: 'fa-user-check', text: 'text-blue-400' };
        case 'dnd':
            return { bg: 'bg-purple-600', border: 'border-purple-500/25', light: 'bg-purple-500/[0.08]', label: dict.dnd, icon: 'fa-ban', text: 'text-purple-400' };
        default:
            return { bg: 'bg-slate-600', border: 'border-slate-500/25', light: 'bg-slate-500/[0.08]', label: dict.maintenance, icon: 'fa-wrench', text: 'text-slate-400' };
    }
}
