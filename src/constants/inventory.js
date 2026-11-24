import { createInitialRooms } from './initialRooms';

// ─────────────────────────────────────────────────────────────────────────────
// Inventory provenance & persistence
//
// The app ships with a WORKING MODEL of the property (30 suites, 2 floors,
// invented suite numbers/wing split/bed mix). It must never be mistaken for the
// owner's real key list, so the inventory is stored as one record that carries
// its own provenance:
//
//   { schema, source: 'model' | 'imported', importedAt, fileName, rooms[] }
//
// A single storage key keeps rooms and provenance from drifting apart.
// ─────────────────────────────────────────────────────────────────────────────

export const INVENTORY_SCHEMA = 2;
export const INVENTORY_STORAGE_KEY = 'sage_inventory_v2';
export const LEGACY_ROOMS_STORAGE_KEY = 'sage_rooms_v3';

export const STATUS_VALUES = ['clean', 'cleaning', 'dirty', 'occupied', 'dnd', 'maintenance'];

export function createModelInventory() {
    return {
        schema: INVENTORY_SCHEMA,
        source: 'model',
        importedAt: null,
        fileName: null,
        rooms: createInitialRooms()
    };
}

export function inventoryMeta(record) {
    return {
        source: record?.source === 'imported' ? 'imported' : 'model',
        importedAt: record?.importedAt || null,
        fileName: record?.fileName || null
    };
}

export function isRoomArray(value) {
    if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ROOMS) return false;
    if (!value.every(isUsableRoom)) return false;
    // Duplicate suite numbers would produce duplicate React keys and double-count
    // occupancy, so reject them at the boundary.
    return new Set(value.map(room => Number(room.id))).size === value.length;
}

function isUsableRoom(room) {
    if (!room) return false;
    const id = Number(room.id);
    const floor = Number(room.floor);
    return (
        Number.isInteger(id) &&
        id > 0 &&
        Number.isInteger(floor) &&
        floor >= 1 &&
        floor <= 60 &&
        typeof room.type === 'string' &&
        room.type.trim() !== '' &&
        STATUS_VALUES.includes(room.status)
    );
}

function sanitizeInventoryRecord(value) {
    if (!value || !Array.isArray(value.rooms)) return null;

    // Keep every usable suite rather than discarding the whole record over one
    // malformed row (a partial cache is still better than an empty board).
    const seenIds = new Set();
    const rooms = [];

    value.rooms.filter(isUsableRoom).forEach(room => {
        const id = Number(room.id);
        if (seenIds.has(id)) return;
        seenIds.add(id);

        const startedAt = Number(room.cleaningStartedAt);
        rooms.push({
            id,
            floor: Number(room.floor),
            wing: typeof room.wing === 'string' ? room.wing.slice(0, 40) : '',
            type: room.type.slice(0, 60),
            status: room.status,
            notes: typeof room.notes === 'string' ? room.notes.slice(0, 200) : '',
            // Preserve "no timer" as null; Number(null) would silently become 0.
            cleaningStartedAt: room.cleaningStartedAt != null && Number.isFinite(startedAt) && startedAt > 0
                ? startedAt
                : null
        });
    });

    if (rooms.length === 0) return null;

    const importedAt = Number(value.importedAt);
    return {
        schema: INVENTORY_SCHEMA,
        source: value.source === 'imported' ? 'imported' : 'model',
        importedAt: value.importedAt != null && Number.isFinite(importedAt) && importedAt > 0 ? importedAt : null,
        fileName: typeof value.fileName === 'string' ? value.fileName.slice(0, 120) : null,
        rooms
    };
}

export function readInventory() {
    try {
        const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (saved) {
            const record = sanitizeInventoryRecord(JSON.parse(saved));
            if (record) return record;
        }
    } catch (e) {}

    // Migrate the earlier rooms-only cache (which held the working model).
    try {
        const legacy = localStorage.getItem(LEGACY_ROOMS_STORAGE_KEY);
        if (legacy) {
            const rooms = JSON.parse(legacy);
            if (isRoomArray(rooms)) {
                return { ...createModelInventory(), rooms };
            }
        }
    } catch (e) {}

    return createModelInventory();
}

export function writeInventory(record) {
    try {
        const serialized = JSON.stringify(record);
        // Skip identical writes: avoids redundant disk churn and rules out a
        // storage-event echo loop between tabs.
        if (localStorage.getItem(INVENTORY_STORAGE_KEY) !== serialized) {
            localStorage.setItem(INVENTORY_STORAGE_KEY, serialized);
        }
        // The legacy rooms-only key is superseded by the record above.
        localStorage.removeItem(LEGACY_ROOMS_STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
}

export function describeInventorySource(record) {
    if (!record || record.source !== 'imported') {
        return 'Working model — suite numbers, wings and bed mix are placeholders';
    }
    const when = record.importedAt ? new Date(record.importedAt).toLocaleString() : 'unknown time';
    return `Imported list — ${record.fileName || 'pasted list'} · ${when}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV / JSON import
// ─────────────────────────────────────────────────────────────────────────────

const HEADER_ALIASES = {
    id: ['suite', 'suitenumber', 'suiteno', 'room', 'roomnumber', 'roomno', 'number', 'unit', 'unitnumber', 'id'],
    floor: ['floor', 'level', 'storey', 'story'],
    wing: ['wing', 'building', 'block', 'section'],
    type: ['type', 'roomtype', 'bedtype', 'beds', 'suitetype', 'category'],
    status: ['status', 'state', 'housekeepingstatus', 'cleanstatus'],
    notes: ['notes', 'note', 'comment', 'comments', 'remarks']
};

const STATUS_ALIASES = {
    clean: ['clean', 'ready', 'cleanready', 'inspected', 'vacantclean'],
    cleaning: ['cleaning', 'inprogress', 'beingcleaned', 'started'],
    dirty: ['dirty', 'vacant', 'vacantdirty', 'checkout', 'departure', 'due'],
    occupied: ['occupied', 'inhouse', 'stayover', 'occ'],
    dnd: ['dnd', 'donotdisturb', 'nodisturb', 'privacy'],
    maintenance: ['maintenance', 'maint', 'outoforder', 'outofservice', 'oos', 'repair']
};

const MAX_ROOMS = 500;

function normalizeKey(key) {
    return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mapHeader(header) {
    const normalized = normalizeKey(header);
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
        if (aliases.includes(normalized)) return field;
    }
    return null;
}

function normalizeStatus(value) {
    const normalized = normalizeKey(value);
    for (const [status, aliases] of Object.entries(STATUS_ALIASES)) {
        if (aliases.includes(normalized)) return status;
    }
    return null;
}

function splitCsvRows(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    let unclosedQuote = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];

        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            row.push(field);
            field = '';
        } else if (char === '\n') {
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        } else if (char !== '\r') {
            field += char;
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    if (inQuotes) unclosedQuote = true;

    return {
        rows: rows.filter(cells => cells.some(cell => String(cell).trim() !== '')),
        unclosedQuote
    };
}

/**
 * Parse a pasted/uploaded room list. Returns validated rooms plus per-row errors
 * and warnings. Any error blocks import so a typo can never silently wipe the
 * housekeeping board.
 */
export function parseRoomListText(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
        return { rooms: [], errors: ['Paste or upload a room list to preview it.'], warnings: [] };
    }
    if (trimmed.length > 500000) {
        return { rooms: [], errors: ['That list is too large. Split it into smaller files (under 500,000 characters).'], warnings: [] };
    }

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        return parseJsonRoomList(trimmed);
    }
    return parseCsvRoomList(trimmed);
}

function parseJsonRoomList(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (e) {
        return { rooms: [], errors: ['That JSON could not be parsed. Check for a missing comma or bracket.'], warnings: [] };
    }

    const records = Array.isArray(parsed) ? parsed : parsed?.rooms;
    if (!Array.isArray(records)) {
        return { rooms: [], errors: ['JSON must be an array of suites, or an object with a "rooms" array.'], warnings: [] };
    }

    const rows = records.map((record, index) => {
        const mapped = {};
        Object.entries(record || {}).forEach(([key, value]) => {
            const field = mapHeader(key);
            if (field && mapped[field] === undefined) mapped[field] = value;
        });
        return { data: mapped, line: index + 1 };
    });

    return validateRows(rows);
}

function parseCsvRoomList(text) {
    const { rows, unclosedQuote } = splitCsvRows(text);

    if (unclosedQuote) {
        return { rooms: [], errors: ['A quoted value is missing its closing quote ("). Check the note fields.'], warnings: [] };
    }
    if (rows.length === 0) {
        return { rooms: [], errors: ['No rows found.'], warnings: [] };
    }

    const headerFields = rows[0].map(mapHeader);
    if (!headerFields.includes('id')) {
        return {
            rooms: [],
            errors: ['The first row must be a header that includes a suite/room number column (e.g. "suite").'],
            warnings: []
        };
    }
    if (headerFields.filter(Boolean).length < 2) {
        return {
            rooms: [],
            errors: ['Could not read enough columns. Download the template for the expected format.'],
            warnings: []
        };
    }

    const dataRows = rows.slice(1).map((cells, index) => {
        const data = {};
        headerFields.forEach((field, column) => {
            if (!field) return;
            if (data[field] === undefined) data[field] = cells[column] !== undefined ? cells[column] : '';
        });
        return { data, line: index + 2 };
    });

    return validateRows(dataRows);
}

function validateRows(rows) {
    const errors = [];
    const warnings = [];
    const rooms = [];
    const seenIds = new Set();

    if (rows.length > MAX_ROOMS) {
        return { rooms: [], errors: [`That list has ${rows.length} suites; the importer accepts up to ${MAX_ROOMS}.`], warnings };
    }

    rows.forEach(({ data, line }) => {
        if (!data || Object.keys(data).length === 0) return;

        const rawId = String(data.id ?? '').trim();
        if (!/^\d{1,5}$/.test(rawId)) {
            errors.push(`Line ${line}: suite number "${rawId || '(blank)'}" is not a number. Use numbers like 101 or 214.`);
            return;
        }
        const id = Number(rawId);
        if (id <= 0) {
            errors.push(`Line ${line}: suite number must be greater than zero.`);
            return;
        }
        if (seenIds.has(id)) {
            errors.push(`Line ${line}: suite ${id} appears more than once.`);
            return;
        }

        const rawFloor = String(data.floor ?? '').trim();
        const floor = Number(rawFloor);
        if (!rawFloor || !Number.isInteger(floor) || floor < 1 || floor > 60) {
            errors.push(`Line ${line}: floor "${rawFloor || '(blank)'}" must be a whole number between 1 and 60.`);
            return;
        }

        const rawStatus = String(data.status ?? '').trim();
        let status = normalizeStatus(rawStatus);
        if (!status && !rawStatus) {
            status = 'dirty';
            warnings.push(`Line ${line}: no status given — defaulted to Dirty so it can't be sold as ready.`);
        } else if (!status) {
            errors.push(`Line ${line}: status "${rawStatus}" is not recognised. Use clean, cleaning, dirty, occupied, dnd or maintenance.`);
            return;
        }

        const type = String(data.type ?? '').trim().slice(0, 60);
        if (!type) {
            warnings.push(`Line ${line}: no suite type given — showing "Suite".`);
        }

        seenIds.add(id);
        rooms.push({
            id,
            floor,
            wing: String(data.wing ?? '').trim().slice(0, 40),
            type: type || 'Suite',
            status,
            notes: String(data.notes ?? '').trim().slice(0, 200),
            cleaningStartedAt: null
        });
    });

    if (errors.length === 0 && rooms.length === 0) {
        errors.push('No suites found in that file.');
    }

    return { rooms, errors, warnings };
}

function csvCell(value) {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export const ROOM_CSV_HEADERS = ['suite', 'floor', 'wing', 'type', 'status', 'notes'];

export function toRoomCsv(rooms) {
    const lines = [ROOM_CSV_HEADERS.join(',')];
    rooms.forEach(room => {
        lines.push([
            room.id,
            room.floor,
            csvCell(room.wing),
            csvCell(room.type),
            room.status,
            csvCell(room.notes)
        ].join(','));
    });
    return lines.join('\n');
}

export function buildRoomListTemplate() {
    return [
        ROOM_CSV_HEADERS.join(','),
        '101,1,North Wing,1BR Queen Suite,clean,',
        '102,1,North Wing,1BR Queen Suite,dirty,Check-in 3 PM',
        '201,2,West Wing,2-Queen Suite,occupied,',
        '202,2,West Wing,2BR 2-Queen Suite,maintenance,AC leak reported'
    ].join('\n');
}
