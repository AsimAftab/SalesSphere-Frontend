
const { DateTime } = require('luxon');

function test(orgTime, orgTimezone, userIsoTime) {
    console.log(`\n--- Testing with OrgTime: ${orgTime}, OrgZone: ${orgTimezone}, UserTime: ${userIsoTime} ---`);

    try {
        const [h, m] = orgTime.split(':').map(Number);

        // 1. Logic exactly as in useWebAttendance
        const now = DateTime.fromISO(userIsoTime).setZone(orgTimezone);

        const checkInTime = now.set({ hour: h, minute: m, second: 0 });
        const startWindow = checkInTime.minus({ hours: 2 });
        const endWindow = checkInTime.plus({ minutes: 30 });

        const isEnabled = now >= startWindow && now <= endWindow;

        // 2. Message generation logic
        const msg = `Check-in allowed: ${startWindow.toFormat('hh:mm a')} - ${endWindow.toFormat('hh:mm a')}`;

        console.log(`Message shown to user: "${msg}"`);
        console.log(`Button Enabled: ${isEnabled}`);

        // 3. Proposed Fix logic (convert to system/local zone)
        // Simulate System Zone as Asia/Kolkata (IST)
        const systemZone = 'Asia/Kolkata';
        const startLocal = startWindow.setZone(systemZone);
        const endLocal = endWindow.setZone(systemZone);
        const msgFixed = `Check-in allowed: ${startLocal.toFormat('hh:mm a')} - ${endLocal.toFormat('hh:mm a')}`;
        console.log(`Proposed Fix Message : "${msgFixed}"`);

    } catch (e) {
        console.error(e);
    }
}

// Hypo: User in IST. Org in UTC. Org CheckIn is 10:00 UTC.
// User Time is 10:22 IST (which is 04:52 UTC).
// User sees "10:22" on their clock.
test('10:00', 'UTC', '2026-01-16T10:22:24+05:30');
