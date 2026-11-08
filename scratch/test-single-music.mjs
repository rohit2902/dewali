import { spawn } from 'child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9227',
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--autoplay-policy=no-user-gesture-required',
  'http://localhost:5173'
]);

await new Promise(r => setTimeout(r, 2000));
const res = await fetch('http://127.0.0.1:9227/json');
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

// Wait past loading screen (2.6s)
await new Promise(r => setTimeout(r, 2700));

console.log("\n================ SINGLE MUSIC.MP3 VERIFICATION ================");

// 1. Initial State Check
const check1 = await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    const audio = window.__diwaliAudio;
    return {
      buttonFound: !!btn,
      buttonText: btn ? btn.textContent.trim() : null,
      audioInitialized: !!audio,
      audioSrc: audio ? audio.src : null,
      audioLoop: audio ? audio.loop : null,
      audioPaused: audio ? audio.paused : null,
      isAutoplayOff: audio ? audio.paused : true
    };
  })()`,
  returnByValue: true
});

console.log("1. Initial Status (OFF by default, never autoplay):", check1.result.value);

// 2. Click Navbar Music Toggle to Play
await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    if (btn) btn.click();
  })()`
});

// Wait for fade in (800ms)
await new Promise(r => setTimeout(r, 1000));

const check2 = await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    const audio = window.__diwaliAudio;
    return {
      buttonTextAfterPlay: btn ? btn.textContent.trim() : null,
      buttonAriaPressed: btn ? btn.getAttribute('aria-pressed') : null,
      audioPlaying: audio ? !audio.paused : false,
      volumePercent: audio ? Math.round(audio.volume * 100) : 0,
      targetVolumeIsAround30Percent: audio ? Math.round(audio.volume * 100) === 30 : false
    };
  })()`,
  returnByValue: true
});

console.log("2. After Toggle Click (Play & Fade in to 30%):", check2.result.value);

// 3. Click again to Pause
await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    if (btn) btn.click();
  })()`
});

// Wait for fade out (500ms)
await new Promise(r => setTimeout(r, 700));

const check3 = await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = document.querySelector('nav button[aria-label*="music"], nav button[aria-label*="संगीत"]');
    const audio = window.__diwaliAudio;
    return {
      buttonTextAfterPause: btn ? btn.textContent.trim() : null,
      audioPaused: audio ? audio.paused : true,
      audioVolumeAfterFadeOut: audio ? Math.round(audio.volume * 100) : 0
    };
  })()`,
  returnByValue: true
});

console.log("3. After Toggle Click Again (Fade out & Pause):", check3.result.value);

console.log("=================================================================\n");

ws.close();
chrome.kill();

