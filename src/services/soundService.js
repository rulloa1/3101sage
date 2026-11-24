// WEB AUDIO NOTIFICATION CHIME
// A single shared AudioContext is reused: creating one per sound exhausts the
// browser limit (~6) and silently kills all later notification sounds.
let sharedAudioCtx = null;

function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        sharedAudioCtx = new AudioContextClass();
    }

    // Browsers start the context suspended until a user gesture.
    if (sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
}

export function playChime(freq = 587.33, duration = 0.22) {
    try {
        const audioCtx = getAudioContext();
        if (!audioCtx) return;

        const startAt = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(0.08, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startAt);
        osc.stop(startAt + duration);

        // Release the nodes so long shifts don't accumulate audio graph objects.
        osc.onended = () => {
            try {
                osc.disconnect();
                gain.disconnect();
            } catch (e) {}
        };
    } catch (e) {
        // audio playback might be blocked until user interacts with the page
    }
}
