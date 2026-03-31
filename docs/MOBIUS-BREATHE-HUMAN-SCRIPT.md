# Möbius calm path — spoken breathing guide (`mobius-breathe-human.mp3`)

Deploy as `/audio/mobius-breathe-human.mp3`. The Text-mode calm path runs **three** slow cycles (inhale → hold → exhale) before **2 Timothy 1:7** repetitions; the UI does not need frame-perfect sync, but pacing should feel unhurried and plain.

**Shipped default:** The repository includes a **system voice** render (macOS Samantha via `npm run audio:mobius-breathe`) so the optional checkbox works everywhere. For a warmer read, record over this script and replace the MP3 in place.

## Recording notes

- **Length:** About 60–90 seconds total is enough (intro + three breath cycles + optional short closing).
- **Tone:** Warm, steady, no hype, no music bed.
- **Format:** Mono MP3, ~128 kbps is fine.
- **Privacy:** Static file only; same as other site MP3s.

## Suggested script (KJV on the exhale close)

Speak slowly; leave **long silences** where noted so the ring can move without fighting your voice.

1. **Soft open (optional, ~5–10 s)**  
   *“Let’s breathe slowly together. Nothing to prove here.”*

2. **Round 1**  
   - *“Breathe in… slow.”* (pause ~5 s)  
   - *“Hold… gentle.”* (pause ~3 s)  
   - *“Let it out… easy.”* (pause ~6 s)

3. **Round 2**  
   - Same three cues with the same pauses (or slightly shorter if you are tight on time).

4. **Round 3**  
   - Same three cues.

5. **Optional close on the last exhale or just after**  
   *“For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.”* — **2 Timothy 1:7** (KJV)

If the file is **shorter** than the UI breathing block, the app still runs the ring; the voice simply finishes first. If **longer**, the verse reps begin when the breathing phase ends—users can leave the box unchecked.

See also: `audio/README.md` (Möbius section).
