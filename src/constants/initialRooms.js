// AUTHENTIC 3101 SAGE ROOM INVENTORY (MATCHING OYO #90631 ROOM CATEGORIES)
export const initialRooms = [
    { id: 101, floor: 1, type: "2 Queen Beds", status: "clean", notes: "", cleaningStartedAt: null },
    { id: 102, floor: 1, type: "Queen Bed", status: "dirty", notes: "Check-in 3 PM", cleaningStartedAt: null },
    { id: 103, floor: 1, type: "Full bed with Twin", status: "occupied", notes: "", cleaningStartedAt: null },
    { id: 104, floor: 1, type: "2 Queen Beds", status: "cleaning", notes: "", cleaningStartedAt: Date.now() - (12 * 60 * 1000) },
    { id: 105, floor: 1, type: "Queen Bed", status: "maintenance", notes: "AC leak reported", cleaningStartedAt: null },
    { id: 201, floor: 2, type: "2 Queen Beds", status: "clean", notes: "", cleaningStartedAt: null },
    { id: 202, floor: 2, type: "Full bed with Twin", status: "occupied", notes: "", cleaningStartedAt: null },
    { id: 203, floor: 2, type: "Queen Bed", status: "dirty", notes: "High priority turnover", cleaningStartedAt: null },
    { id: 204, floor: 2, type: "2 Queen Beds", status: "cleaning", notes: "", cleaningStartedAt: Date.now() - (8 * 60 * 1000) },
    { id: 205, floor: 2, type: "Full bed with Twin", status: "dnd", notes: "Guest requested privacy", cleaningStartedAt: null },
    { id: 301, floor: 3, type: "2 Queen Beds", status: "clean", notes: "", cleaningStartedAt: null },
    { id: 302, floor: 3, type: "Queen Bed", status: "dirty", notes: "", cleaningStartedAt: null },
    { id: 303, floor: 3, type: "2 Queen Beds", status: "occupied", notes: "", cleaningStartedAt: null },
    { id: 304, floor: 3, type: "Queen Bed", status: "clean", notes: "", cleaningStartedAt: null }
];
