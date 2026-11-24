import oyoLogo from '../../assets/oyo-logo.png';

// Importing through Vite gives a hashed, base-aware URL in production builds.
// A hardcoded "assets/oyo-logo.png" 404s once the app is deployed.
export const OYO_LOGO = oyoLogo;

export const OYO_LISTING_URL =
    'https://www.oyorooms.com/us/90631/?latitude=29.73487&longitude=-95.4666&locale=en';

export const OYO_US_PORTAL = 'https://www.oyorooms.com/us/';

export const PROPERTY = {
    name: 'RoomSync Pro',
    oyoId: 90631,
    address: '3101 Sage Rd',
    city: 'Houston, TX 77056',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    wifi: 'Sage_Guest_Free',
    wifiPassword: 'galleria3101',
    deskPhone: '+1 (844) 266-5696'
};
