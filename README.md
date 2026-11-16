# RoomSync Pro | 3101 Sage Operations Suite

A lightweight, enterprise-grade hotel operations management dashboard built specifically for **3101 Sage Rd, Houston, TX 77056** (The Galleria), connecting **Front Desk**, **Housekeeping**, and **Hotel Ownership** in real-time.

🌐 **Live Application:** [https://rulloa1.github.io/3101sage/](https://rulloa1.github.io/3101sage/)  
🏢 **Live OYO Property #90631:** [OYO Hotel & Apartments Houston Galleria](https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en)  
🇺🇸 **OYO US National Portal:** [https://www.oyorooms.com/us/](https://www.oyorooms.com/us/)

---

## ✨ Core Operational Features

- **Dual Operating Modes**:
  - **Front Desk Mode**: Comprehensive room cards grid with instant status overview, floor filtering, live cleaning stopwatches, and room editing.
  - **Housekeeping Mode**: Mobile-first, high-contrast, large touch targets designed for fast 1-tap operation on smartphones during room turnover rounds.
- **Bilingual Interface**: 1-click toggle between **English** and **Spanish (Español)** for seamless housekeeping team coordination.
- **Zero-Latency Real-Time Cloud Sync**:
  - Native browser `BroadcastChannel` for instant 0ms cross-tab synchronization.
  - Free cloud WebSocket pub/sub (via `ntfy.sh`) syncing changes instantly across all front desk PCs, tablets, and housekeepers' mobile phones with zero logins or server setup.
- **Walk-in Quick Matcher**: 1-click button displaying all immediately clean & inspect-certified rooms for walk-in arrivals.
- **Live Turnover Timers**: Real-time counter showing elapsed cleaning minutes for active rooms.
- **Shift Report Generator**: Formats a timestamped operational summary ready to copy into WhatsApp or daily management emails.

---

## 💼 Owner Pitch & Revenue Defense Tools

1. **Early Check-In Monetization Tool & Tracker**:
   - Captures $25–$35 early check-in fees for arrivals before 3:00 PM check-in policy.
   - Automatically assigns clean rooms, logs guest/reservation names, tracks daily fee totals, and marks rooms occupied in real time.
2. **Housekeeping 3-Point QC Inspection Modal (3.7★ Review Defense)**:
   - Enforces a mandatory 3-point checklist before certifying a room clean: (1) Fresh Bedding & Linens, (2) Sanitized & Restocked Bathroom, (3) AC Tested (70°F) & TV Remote Sanitized.
   - Designed to raise the current 3.7★ OTA rating and eliminate guest cleanliness complaints.
3. **1-Tap Handyman Maintenance Dispatch**:
   - Instantly drafts and sends formatted repair requests via **WhatsApp** or **SMS** with room number, bed category, and reported issue.
4. **Direct Booking Keycard Sleeve & Wi-Fi Slip Generator**:
   - Prints a branded card sleeve with Wi-Fi login (`Sage_Guest_Free`), front desk extension, a 10% discount incentive to book directly and bypass 18% OTA commissions, and a credit card chargeback disclaimer (*"Charges will appear as STELLAR STAY / OYO 90631"*).
5. **Interactive Financial ROI Calculator**:
   - Embedded in the Audit tab, demonstrating an estimated **+$29,800+ in annual profit and commission savings** for the property owner.

---

## 🛠️ Tech Stack & React Architecture

- **Frontend**: **React 18** + **Vite 6**
- **Styling**: **Tailwind CSS 3** with custom executive dot-matrix luxury theme & glassmorphism
- **Sync Engine**: Native browser `BroadcastChannel` (0ms multi-tab sync) + `ntfy.sh` Cloud WebSocket pub/sub (zero-config cross-device synchronization)
- **Deployment**: Automated **GitHub Actions** CI/CD pipeline deploying to **GitHub Pages**
- **Components Structure**:
  - `Header.jsx`: OYO brand badge, live clock, language toggle, view selector & tool launchers
  - `DeskView.jsx`: Responsive room turnover grid with active cleaning stopwatches
  - `HousekeepingView.jsx`: Mobile-first large touch-target cards for floor rounds
  - `AuditView.jsx`: Property brand audit, live OYO OTA data & interactive ROI calculator
  - `EarlyCheckinModal.jsx`: Monetization tool collecting $25–$35 early fees
  - `HousekeepingQcModal.jsx`: 3-Point quality check checklist defending review ratings
  - `KeycardSleeveModal.jsx`: Printable direct booking Wi-Fi card slip
  - `EditRoomModal.jsx`: Custom status, notes chips, and 1-tap WhatsApp/SMS Handyman dispatch
  - `ShiftSummaryModal.jsx`: Formatted timestamped report with 1-click clipboard copy

---

## 🚀 Development & Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start local development server with instant HMR
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

🌐 **Production Deployment**: Automatically built and deployed on every push to `main` via GitHub Actions at:  
[https://rulloa1.github.io/3101sage/](https://rulloa1.github.io/3101sage/)
