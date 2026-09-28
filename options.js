// The modifier key is chosen with radio buttons, but stored as three booleans
// (useCtrl / useAlt / useMeta) because that is what handler.js reads.
// `lastModifier` remembers the choice while the drag mode is active, so it can
// be restored when the user switches back to the standard mode.
const MODIFIERS = ['Ctrl', 'Alt', 'Meta'];
const DRAG_MODE = '0';

function modeSelect() {
  return document.querySelector('select[name=wordSelectMode]');
}

function selectedModifier(prefs) {
  // Older versions allowed several keys at once; keep the first one found.
  return MODIFIERS.find((key) => prefs[`use${key}`]) || prefs.lastModifier || 'Alt';
}

function checkedModifier() {
  const radio = document.querySelector('input[name=modifier]:checked');
  return radio ? radio.value : null;
}

// In drag mode modifier keys are meaningless: clear and lock the group.
function updateModifierState(lastModifier) {
  const locked = modeSelect().value === DRAG_MODE;
  const radios = document.querySelectorAll('input[name=modifier]');
  radios.forEach((radio) => {
    radio.disabled = locked;
    radio.checked = !locked && radio.value === lastModifier;
  });
  document.getElementById('keys-lock').hidden = !locked;
  document.getElementById('keys-msg').hidden = true;
  document.querySelector('fieldset[name=modifier-keys]').classList.toggle('locked', locked);
}

/* global defaultPrefs */
function restoreOptions() {
  browser.storage.local.get({
    prefs: defaultPrefs
  }).then((results) => {
    const { prefs } = results;
    modeSelect().value = prefs.wordSelectMode;
    updateModifierState(selectedModifier(prefs));
  });
}

let lastModifier = 'Alt';

function saveOptions() {
  const chosen = checkedModifier();
  if (chosen) {
    lastModifier = chosen;
  }
  const newPrefs = {
    wordSelectMode: modeSelect().value,
    lastModifier: lastModifier
  };
  for (const key of MODIFIERS) {
    newPrefs[`use${key}`] = (key === chosen);
  }
  browser.storage.local.set({
    prefs: newPrefs
  });
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  browser.storage.local.get({ prefs: defaultPrefs }).then(({ prefs }) => {
    lastModifier = selectedModifier(prefs);
  });
});

modeSelect().addEventListener('change', () => {
  updateModifierState(lastModifier);
  saveOptions();
});

document.querySelectorAll('input[name=modifier]').forEach((radio) => {
  radio.addEventListener('change', saveOptions);
});

// Clicking the locked keys explains why they can't be changed.
document.getElementById('keys-lock').addEventListener('click', () => {
  document.getElementById('keys-msg').hidden = false;
});
