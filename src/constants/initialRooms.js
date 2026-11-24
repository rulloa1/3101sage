// 3101 SAGE RD — 30-SUITE, TWO-STOREY COURTYARD INVENTORY
//
// Verified from public records / OTA listings:
//   • 30 suites, 2 floors, exterior corridors (HotelPlanner, EventGuru, HRS, OYO #90631)
//   • all-suite product with full kitchens (dishwasher, microwave, fridge, range)
//   • one- and two-bedroom suites; 1 queen, 2 queen and accessible configurations
//
// Working model: suite numbers, wing assignment and per-room statuses are set by the
// GM. Swap these rows for the owner's actual key list before go-live — the rest of
// the app (filters, stats, housekeeping, reports) adapts automatically.
export function createInitialRooms() {
    const now = Date.now();

    return [
        // ── Ground floor · North Wing (courtyard-facing, 2-storey) ──
        { id: 101, floor: 1, wing: "North Wing", type: "1BR Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },
        { id: 102, floor: 1, wing: "North Wing", type: "1BR Queen Suite", status: "dirty", notes: "Check-in 3 PM", cleaningStartedAt: null },
        { id: 103, floor: 1, wing: "North Wing", type: "2-Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 104, floor: 1, wing: "North Wing", type: "2BR 2-Queen Suite", status: "cleaning", notes: "", cleaningStartedAt: now - (12 * 60 * 1000) },
        { id: 105, floor: 1, wing: "North Wing", type: "Studio Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },

        // ── Ground floor · West Wing (Sage Rd side) ──
        { id: 106, floor: 1, wing: "West Wing", type: "1BR Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 107, floor: 1, wing: "West Wing", type: "2-Queen Suite", status: "dirty", notes: "High priority turnover", cleaningStartedAt: null },
        { id: 108, floor: 1, wing: "West Wing", type: "2BR 2-Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },
        { id: 109, floor: 1, wing: "West Wing", type: "1BR Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 110, floor: 1, wing: "West Wing", type: "Studio Queen Suite", status: "dnd", notes: "Guest requested privacy", cleaningStartedAt: null },

        // ── Ground floor · South Wing (pool courtyard) ──
        { id: 111, floor: 1, wing: "South Wing", type: "2-Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 112, floor: 1, wing: "South Wing", type: "1BR Queen Suite", status: "dirty", notes: "Late checkout 1 PM", cleaningStartedAt: null },
        { id: 113, floor: 1, wing: "South Wing", type: "Accessible Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },
        { id: 114, floor: 1, wing: "South Wing", type: "2BR 2-Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 115, floor: 1, wing: "South Wing", type: "1BR Queen Suite", status: "maintenance", notes: "AC leak reported", cleaningStartedAt: null },

        // ── Second floor · North Wing ──
        { id: 201, floor: 2, wing: "North Wing", type: "1BR Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },
        { id: 202, floor: 2, wing: "North Wing", type: "2-Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 203, floor: 2, wing: "North Wing", type: "2BR 2-Queen Suite", status: "dirty", notes: "High priority turnover", cleaningStartedAt: null },
        { id: 204, floor: 2, wing: "North Wing", type: "1BR Queen Suite", status: "cleaning", notes: "", cleaningStartedAt: now - (8 * 60 * 1000) },
        { id: 205, floor: 2, wing: "North Wing", type: "Studio Queen Suite", status: "dnd", notes: "Do not disturb", cleaningStartedAt: null },

        // ── Second floor · West Wing ──
        { id: 206, floor: 2, wing: "West Wing", type: "2-Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },
        { id: 207, floor: 2, wing: "West Wing", type: "1BR Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 208, floor: 2, wing: "West Wing", type: "2BR 2-Queen Suite", status: "dirty", notes: "", cleaningStartedAt: null },
        { id: 209, floor: 2, wing: "West Wing", type: "Accessible Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 210, floor: 2, wing: "West Wing", type: "Studio Queen Suite", status: "clean", notes: "", cleaningStartedAt: null },

        // ── Second floor · South Wing ──
        { id: 211, floor: 2, wing: "South Wing", type: "1BR Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 212, floor: 2, wing: "South Wing", type: "2-Queen Suite", status: "dirty", notes: "Extra towels requested", cleaningStartedAt: null },
        { id: 213, floor: 2, wing: "South Wing", type: "2BR 2-Queen Suite", status: "occupied", notes: "", cleaningStartedAt: null },
        { id: 214, floor: 2, wing: "South Wing", type: "1BR Queen Suite", status: "dirty", notes: "", cleaningStartedAt: null },
        { id: 215, floor: 2, wing: "South Wing", type: "Studio Queen Suite", status: "clean", notes: "", cleaningStartedAt: null }
    ];
}

export const initialRooms = createInitialRooms();
