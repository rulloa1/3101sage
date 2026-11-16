// REAL-TIME CLOUD & MULTI-TAB SYNC SERVICE
export const myClientId = 'client_' + Math.random().toString(36).substring(2, 9);
export const CLOUD_SYNC_TOPIC = 'roomsync_3101_sage_operations_v2';
export const WS_URL = 'wss://ntfy.sh/' + CLOUD_SYNC_TOPIC + '/ws';
export const POST_URL = 'https://ntfy.sh/' + CLOUD_SYNC_TOPIC;

// Local BroadcastChannel for instant multi-tab sync on same machine
export const localBroadcast = ('BroadcastChannel' in window) 
    ? new BroadcastChannel('roomsync_sage_local_v2') 
    : null;

class SyncService {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectTimer = null;
        this.listeners = new Set();
        this.statusListeners = new Set();
    }

    init() {
        this.setupLocalBroadcast();
        this.connectCloud();
    }

    setupLocalBroadcast() {
        if (localBroadcast) {
            localBroadcast.onmessage = (event) => {
                if (event.data) this.notifyListeners(event.data);
            };
        }
    }

    connectCloud() {
        try {
            if (this.ws) {
                try { this.ws.close(); } catch (e) {}
            }
            this.notifyStatus(false, "Connecting...");
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                this.isConnected = true;
                this.notifyStatus(true, "Cloud Live");
                this.publish({ type: 'SYNC_REQUEST', senderId: myClientId });
            };

            this.ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    if (parsed.event === 'message' && parsed.message) {
                        const data = JSON.parse(parsed.message);
                        this.notifyListeners(data);
                    }
                } catch (e) {}
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                this.notifyStatus(false, "Offline / Retry");
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = setTimeout(() => this.connectCloud(), 4000);
            };

            this.ws.onerror = () => {
                try { this.ws.close(); } catch (e) {}
            };
        } catch (e) {
            this.notifyStatus(false, "Local Only");
        }
    }

    publish(payload) {
        payload.senderId = myClientId;
        payload.timestamp = Date.now();

        // Broadcast to other tabs locally
        if (localBroadcast) {
            try {
                localBroadcast.postMessage(payload);
            } catch (e) {}
        }

        // Publish to cloud WebSocket topic
        fetch(POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {});
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    subscribeStatus(listener) {
        this.statusListeners.add(listener);
        return () => this.statusListeners.delete(listener);
    }

    notifyListeners(data) {
        if (!data || data.senderId === myClientId) return;
        this.listeners.forEach(fn => fn(data));
    }

    notifyStatus(connected, label) {
        this.isConnected = connected;
        this.statusListeners.forEach(fn => fn(connected, label));
    }
}

export const syncService = new SyncService();
