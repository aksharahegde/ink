export function usePageFlipAudio() {
  let audioContext: AudioContext | null = null;

  function getContext() {
    if (!import.meta.client) return null;
    audioContext ??= new AudioContext();
    return audioContext;
  }

  async function playFlip() {
    const context = getContext();
    if (!context) return;

    if (context.state === "suspended") await context.resume();

    const duration = 0.16;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      const progress = i / data.length;
      data[i] = (Math.random() * 2 - 1) * (1 - progress) * 0.28;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.setValueAtTime(550, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  }

  return { playFlip };
}
