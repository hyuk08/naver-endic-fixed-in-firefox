const modeIcons = [
  'icons/ic_mode_classic.png',
  'icons/ic_mode_std.png'
];
const modeName = [
  '옛날 방법 (드래그)',
  '표준 (기능키 + 클릭)'
];

function initBrowserAction(wordSelectMode) {
  browser.browserAction.setIcon({
    path: modeIcons[wordSelectMode]
  });
  browser.browserAction.setTitle({
    title: `Naver English Dictionary (Unofficial)\n${modeName[wordSelectMode]}`
  });
}

/* global defaultPrefs */
browser.storage.local.get({
  prefs: defaultPrefs
}).then((results) => {
  const { prefs } = results;
  initBrowserAction(prefs.wordSelectMode);
});

browser.storage.onChanged.addListener((changes, area) => {
  if (!changes.prefs || !changes.prefs.newValue) {
    return;
  }
  const wordSelectMode = changes.prefs.newValue.wordSelectMode;
  initBrowserAction(wordSelectMode);
});

browser.browserAction.onClicked.addListener((tab) => {
  browser.runtime.openOptionsPage();
});

browser.commands.onCommand.addListener((cmd) => {
  if (cmd === 'toggle-mode') {
    browser.storage.local.get({
      prefs: defaultPrefs
    }).then((results) => {
      const { prefs } = results;
      prefs['wordSelectMode'] = prefs['wordSelectMode'] == 0 ? 1 : 0;
      browser.storage.local.set({
        prefs: prefs
      });
    });
  }
});


let pronounceAudio = null;

browser.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== 'play-pronounce') {
    return undefined;
  }
  if (pronounceAudio) {
    pronounceAudio.pause();
  }
  const audio = new Audio(msg.url);
  pronounceAudio = audio;
  return new Promise((resolve) => {
    audio.addEventListener('ended', () => resolve({}));
    audio.addEventListener('pause', () => resolve({}));
    audio.addEventListener('error', () => {
      const code = audio.error ? audio.error.code : '?';
      resolve({ error: `audio error ${code}` });
    });
    audio.play().catch((e) => resolve({ error: String(e) }));
  });
});

// Right-click menu: works where the popup can't be injected (e.g. Firefox's
// built-in PDF viewer). The result opens in a small window.
const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 440;
const MAX_LOOKUP_LENGTH = 40;
let lookupWindowId = null;

browser.contextMenus.create({
  id: 'lookup-selection',
  title: '네이버 사전에서 찾기: "%s"',
  contexts: ['selection']
});

async function openLookupWindow(text) {
  const url = browser.runtime.getURL('dict.html') + `?text=${encodeURIComponent(text)}`;
  if (lookupWindowId !== null) {
    try {
      // Reuse the window opened by a previous lookup.
      const win = await browser.windows.get(lookupWindowId, { populate: true });
      await browser.tabs.update(win.tabs[0].id, { url: url });
      await browser.windows.update(lookupWindowId, { focused: true });
      return;
    } catch (e) {
      lookupWindowId = null;
    }
  }
  const win = await browser.windows.create({
    url: url,
    type: 'popup',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT
  });
  lookupWindowId = win.id;
}

browser.windows.onRemoved.addListener((windowId) => {
  if (windowId === lookupWindowId) {
    lookupWindowId = null;
  }
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== 'lookup-selection') {
    return;
  }
  const text = (info.selectionText || '').trim().slice(0, MAX_LOOKUP_LENGTH);
  if (text.length > 0) {
    openLookupWindow(text);
  }
});
