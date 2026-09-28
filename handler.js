const TOOLTIP_ID = '_ext_tooltip_34F75D';
const MAX_POPUP_HEIGHT = 300;

let prefs = null;
let ignoreMouseEvent = false;

/* global defaultPrefs */
browser.storage.local.get('prefs', (rawItem) => {
  // see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get
  const item = Array.isArray(rawItem) ? rawItem[0] : rawItem;
  prefs = item.prefs ? item.prefs : defaultPrefs;
});

browser.storage.onChanged.addListener((changes /*, area */) => {
  if (changes.prefs) {
    prefs = changes.prefs.newValue;
  }
});

let popup = document.createElement('div');
popup.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 999999; background-color: white';

document.addEventListener('selectionchange', () => {
  ignoreMouseEvent = false;
});

document.addEventListener('mouseup', (e) => {
  if (!isTooltip(e.target)) {
    hideTooltip();
  }
  if (prefs === null || prefs.wordSelectMode != 0 || ignoreMouseEvent) {
    return;
  }
  let sel = document.getSelection();
  let text = sel.toString().trim();
  if (text.length < 1 || text.length > 40) {
    return;
  }
  let focusNode = sel.focusNode;
  if (focusNode.nodeName.toLowerCase() == 'textarea'
    || focusNode.nodeName.toLowerCase() == 'input') {
    return;
  }
  ignoreMouseEvent = true;
  showTooltipFromSelection(sel, text);
});

document.addEventListener('click', (e) => {
  if (prefs === null || prefs.wordSelectMode != 1) {
    return;
  }
  if (e.ctrlKey != prefs.useCtrl
    || e.altKey != prefs.useAlt
    || e.metaKey != prefs.useMeta) {
    return;
  }
  let oldSettings = enableTextSelection();
  try {
    let sel = document.getSelection();
    sel.removeAllRanges();
    let range = createRangeFromPoint(e.clientX, e.clientY);
    if (range === null) {
      return;
    }
    sel.addRange(range);
    sel.modify("move", "backward", "word");
    sel.modify("extend", "forward", "word");
    let text = sel.toString().trim();
    if (text.length < 1) {
      return;
    }
    showTooltipFromSelection(sel, text);
    sel.removeAllRanges();
  } finally {
    restoreTextSelection(oldSettings);
  }
});

function enableTextSelection() {
  let oldSettings = {};
  if (document.body.style.MozUserSelect !== null) {
    oldSettings['MozUserSelect'] = document.body.style.MozUserSelect;
    document.body.style.MozUserSelect = 'text';
  }
  document.addEventListener('selectstart', function (e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    return true;
  }, {
    capture: true,
    once: true
  });
  return oldSettings;
}

function restoreTextSelection(oldSettings) {
  if (oldSettings['MozUserSelect'] !== undefined) {
    document.body.style.MozUserSelect = oldSettings['MozUserSelect'];
  }
}

function createRangeFromPoint(x, y) {
  let range = document.createRange();
  let textNode;
  let offset;

  if (document.caretPositionFromPoint) {
    let caretPos = document.caretPositionFromPoint(x, y);
    if (caretPos == null) {
      return null;
    }
    textNode = caretPos.offsetNode;
    offset = caretPos.offset;
  } else if (document.caretRangeFromPoint) {
    let caretRange = document.caretRangeFromPoint(x, y);
    if (caretRange == null) {
      return null;
    }
    textNode = caretRange.startContainer;
    offset = caretRange.startOffset;
  } else {
    return null;
  }
  range.setStart(textNode, offset);
  range.setEnd(textNode, offset);
  return range;
}

function showTooltipFromSelection(sel, text) {
  hideTooltip();
  let range = sel.getRangeAt(0);
  let bounds = range.getBoundingClientRect();
  showTooltip(text, {
    left: Math.trunc(window.pageXOffset + bounds.left),
    top: Math.trunc(window.pageYOffset + bounds.bottom)
  });
}

function showTooltip(text, pos) {
  let tooltip = document.createElement('div');
  tooltip.id = TOOLTIP_ID;
  let dictUrl = browser.runtime.getURL('dict.html') + `?text=${encodeURIComponent(text)}`;
  let iframe = document.createElement('iframe');
  iframe.src = dictUrl;
  iframe.style.cssText = 'border: 0; width: 260px; height: 60px; display: block; background: transparent; color-scheme: light;';
  tooltip.appendChild(iframe);
  tooltip.style.setProperty('position', `absolute`, 'important');
  tooltip.style.setProperty('top', `${pos.top}px`, 'important');
  tooltip.style.setProperty('left', `${pos.left}px`, 'important');
  tooltip.style.setProperty('display', `block`, 'important');
  tooltip.style.setProperty('width', `fit-content`, 'important');
  tooltip.style.setProperty('width', `-moz-fit-content`, 'important');
  tooltip.style.setProperty('width', `-webkit-fit-content`, 'important');
  tooltip.style.setProperty('height', `auto`, 'important');
  tooltip.style.setProperty('z-index', `${Number.MAX_SAFE_INTEGER}`, 'important');
  tooltip.style.setProperty('background-color', `white`, 'important');
  tooltip.style.setProperty('color', `darkslategray`, 'important');
  tooltip.style.setProperty('font', `normal 12px sans-serif`, 'important');
  tooltip.style.setProperty('border', `1px solid #d1d5db`, 'important');
  tooltip.style.setProperty('border-radius', `8px`, 'important');
  tooltip.style.setProperty('box-shadow', `0 4px 16px rgba(0,0,0,.18)`, 'important');
  tooltip.style.setProperty('margin', `0`, 'important');
  tooltip.style.setProperty('padding', `0`, 'important');
  tooltip.style.setProperty('max-width', `none`, 'important');
  document.body.appendChild(tooltip);  
}

window.addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'naver-endic-size') {
    return;
  }
  let tooltip = document.getElementById(TOOLTIP_ID);
  let iframe = tooltip && tooltip.querySelector('iframe');
  if (iframe && e.source === iframe.contentWindow) {
    iframe.style.width = `${e.data.width}px`;
    // "scroll": cap the height and scroll inside; "full": show everything.
    const scroll = !prefs || prefs.popupMode !== 'full';
    const height = scroll ? Math.min(e.data.height, MAX_POPUP_HEIGHT) : e.data.height;
    iframe.style.height = `${height}px`;
  }
});

function hideTooltip() {
  let tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip != null) {
    document.body.removeChild(tooltip);
  }
}

function isTooltip(elem) {
  let tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip == null) {
    return false;
  }
  return (tooltip == elem || tooltip.contains(elem));
}
