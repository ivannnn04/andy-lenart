/**
 * The home page's background track, shared by everything that shows or
 * switches it: the opening screen's "Sound on / off", the sound wave in the
 * header and the switch in the corner. The <audio> element lives in the
 * Preloader, which attaches it here.
 */

const VOLUME = 0.6;

let el: HTMLAudioElement | null = null;
let playing = false;
let fade: number | undefined;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const set = (on: boolean) => {
  if (playing === on) return;
  playing = on;
  emit();
};

// Whether this browser lets the page change the volume (iPhones and iPads do not).
let volumeWorks: boolean | undefined;
const canFade = () => {
  if (volumeWorks === undefined) {
    const probe = new Audio();
    probe.volume = 0.5;
    volumeWorks = probe.volume === 0.5;
  }
  return volumeWorks;
};

function ramp(to: number, then?: () => void) {
  const a = el;
  if (!a) return;
  window.clearInterval(fade);
  fade = window.setInterval(() => {
    const up = to > a.volume;
    const next = a.volume + (up ? 0.04 : -0.06);
    if (up ? next >= to : next <= to) {
      a.volume = to;
      window.clearInterval(fade);
      then?.();
    } else a.volume = Math.max(0, Math.min(1, next));
  }, 60);
}

// Any other sound on the page (a garment's preview) takes over from the track.
function onOtherPlay(e: Event) {
  if (e.target !== el && playing) {
    window.clearInterval(fade);
    el?.pause();
    set(false);
  }
}

export const backgroundSound = {
  /** Called by the Preloader with its <audio> (null when it goes). */
  attach(audio: HTMLAudioElement | null) {
    if (audio === el) return;
    window.clearInterval(fade);
    el?.pause();
    el = audio;
    playing = false;
    if (audio) document.addEventListener("play", onOtherPlay, true);
    else document.removeEventListener("play", onOtherPlay, true);
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  isPlaying: () => playing,
  /** Whether there is a track on this page. */
  isAvailable: () => el !== null,
  /** Starts (with a fade in) or stops (with a fade out) the track. */
  turn(on: boolean) {
    const a = el;
    if (!a) return;
    // Without a settable volume (iOS): no fade, just play and pause.
    const smooth = canFade();
    window.clearInterval(fade);
    if (on) {
      set(true);
      if (smooth) a.volume = 0;
      a.play()
        .then(() => smooth && ramp(VOLUME))
        .catch(() => set(false));
    } else {
      set(false);
      if (smooth) ramp(0, () => a.pause());
      else a.pause();
    }
  },
  toggle() {
    backgroundSound.turn(!playing);
  },
};
