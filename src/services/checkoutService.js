// Checkout log persistence helpers
// Each entry: { id, roomId, roomType, floor, guestName, fee, timestamp }

const STORAGE_KEY = 'sage_checkout_log';

export function loadCheckoutLog() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveCheckoutLog(log) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch {}
}

export function appendCheckout(entry) {
    const log = loadCheckoutLog();
    log.push(entry);
    saveCheckoutLog(log);
    return log;
}

export function todayCheckouts(log) {
    const todayStr = new Date().toDateString();
    return log.filter(e => new Date(e.timestamp).toDateString() === todayStr);
}

export function formatElapsed(timestamp) {
    const ms = Date.now() - timestamp;
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`;
}
