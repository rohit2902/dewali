import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9226', '--headless=new', '--disable-gpu', '--no-sandbox', '--autoplay-policy=no-user-gesture-required', 'http://localhost:5173'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9226/json');
const tab = (await res.json()).find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const send = (method, params = {}) => new Promise(r => {
  const reqId = id++;
  const h = e => {
    const d = JSON.parse(e.data);
    if (d.id === reqId) {
      ws.removeEventListener('message', h);
      r(d.result);
    }
  };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: reqId, method, params }));
});

// Wait for app to mount
await new Promise(r => setTimeout(r, 2800));

console.log("\n================ AUDIO ENGINE VERIFICATION ================");

// 1. Initial State Check (Autoplay check)
const initialCheck = await send('Runtime.evaluate', {
  expression: `(() => {
    const audioBtn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    const audios = Array.from(document.querySelectorAll('audio'));
    const isPlayingAny = audios.some(a => !a.paused);
    return {
      hasAudioBtn: !!audioBtn,
      btnText: audioBtn ? audioBtn.textContent.trim() : null,
      isPlayingInitially: isPlayingAny,
      autoplayBlockedOrRespected: !isPlayingAny
    };
  })()`,
  returnByValue: true
});

console.log("1. Initial Autoplay Status:", initialCheck.result.value);

// 2. Open Audio Panel
await send('Runtime.evaluate', {
  expression: `(() => {
    const audioBtn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    if (audioBtn) audioBtn.click();
  })()`
});

await new Promise(r => setTimeout(r, 500));

const panelCheck = await send('Runtime.evaluate', {
  expression: `(() => {
    const dialog = document.querySelector('div[role="dialog"][aria-label*="Music"], div[role="dialog"][aria-label*="संगीत"]');
    if (!dialog) return { panelOpen: false };
    const moodButtons = Array.from(dialog.querySelectorAll('button')).map(b => b.textContent.trim());
    const slider = dialog.querySelector('input[type="range"]');
    return {
      panelOpen: true,
      moodButtons,
      volumeSliderFound: !!slider,
      currentVolume: slider ? slider.value : null
    };
  })()`,
  returnByValue: true
});

console.log("2. Panel Open & Controls Status:", panelCheck.result.value);

// 3. Trigger Play
await send('Runtime.evaluate', {
  expression: `(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const playBtn = dialog ? dialog.querySelector('button[aria-label*="Play"]') : null;
    if (playBtn) playBtn.click();
  })()`
});

await new Promise(r => setTimeout(r, 800));

const playingCheck = await send('Runtime.evaluate', {
  expression: `(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const pauseBtn = dialog ? dialog.querySelector('button[aria-label*="Pause"]') : null;
    const audio = window.__diwaliAudio;
    return {
      pauseButtonVisible: !!pauseBtn,
      hasAudioInstance: !!audio,
      audioSrc: audio ? audio.src : null,
      audioPaused: audio ? audio.paused : null,
      audioVolume: audio ? Math.round(audio.volume * 100) : null,
      audioLoop: audio ? audio.loop : null
    };
  })()`,
  returnByValue: true
});

console.log("3. Playback Status After User Click:", playingCheck.result.value);

// 4. Test Switching Mood to "Traditional"
await send('Runtime.evaluate', {
  expression: `(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    const buttons = Array.from(dialog.querySelectorAll('button'));
    const traditionalBtn = buttons.find(b => b.textContent.includes('Traditional') || b.textContent.includes('पारंपरिक'));
    if (traditionalBtn) traditionalBtn.click();
  })()`
});

await new Promise(r => setTimeout(r, 1000));

const moodCheck = await send('Runtime.evaluate', {
  expression: `(() => {
    const audio = window.__diwaliAudio;
    return {
      newSrc: audio ? audio.src : null,
      isPlaying: audio ? !audio.paused : null,
      volume: audio ? Math.round(audio.volume * 100) : null
    };
  })()`,
  returnByValue: true
});

console.log("4. Status After Switching to Traditional:", moodCheck.result.value);

console.log("===========================================================\n");

ws.close();
chrome.kill();
