const query = new URLSearchParams(window.location.search).get('text') || '';
const ALLOWED_TAGS = new Set(['STRONG', 'B', 'EM', 'I', 'SUP', 'SUB']);

function reportSize() {
  // Let the content script resize the iframe to fit the content.
  const rect = document.body.getBoundingClientRect();
  window.parent.postMessage({
    type: 'naver-endic-size',
    width: Math.ceil(rect.width) + 4,
    height: Math.ceil(rect.height) + 8
  }, '*');
}

function playPronounce(url, btn) {
  document.querySelectorAll('button.speak.playing')
    .forEach((b) => b.classList.remove('playing'));
  btn.classList.remove('error');
  btn.classList.add('playing');
  btn.title = '발음 듣기';
  // Playback happens in the background page: audio started from an iframe
  // embedded in a web page is subject to that page's autoplay policy.
  browser.runtime.sendMessage({ type: 'play-pronounce', url: url })
    .then((res) => {
      btn.classList.remove('playing');
      if (res && res.error) {
        throw new Error(res.error);
      }
    })
    .catch((err) => {
      console.error('pronounce failed', err);
      btn.classList.remove('playing');
      btn.classList.add('error');
      btn.title = '재생 실패: ' + err.message;
    });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

// Copy an HTML fragment from the API into `parent`, keeping only simple
// formatting tags (without attributes) and flattening everything else to text.
function appendRichText(parent, html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const copy = (from, to) => {
    for (const child of from.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        to.appendChild(document.createTextNode(child.textContent));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (ALLOWED_TAGS.has(child.tagName)) {
          const node = document.createElement(child.tagName.toLowerCase());
          copy(child, node);
          to.appendChild(node);
        } else {
          copy(child, to);
        }
      }
    }
  };
  copy(doc.body, parent);
}

function render(result) {
  const body = document.body;
  body.textContent = '';
  result.words.forEach((word) => {
    const dl = el('dl');
    const dt = el('dt');
    appendRichText(dt, word.title);
    word.pronounces.forEach((p) => {
      const span = el('span', 'pron');
      span.appendChild(el('span', 'tag', p.country));
      span.appendChild(document.createTextNode(p.text));
      dt.appendChild(document.createTextNode(' '));
      dt.appendChild(span);
      const btn = el('button', 'speak');
      btn.type = 'button';
      btn.title = '발음 듣기';
      const img = el('img');
      img.alt = '발음 듣기';
      img.src = 'icons/speech.png';
      btn.appendChild(img);
      btn.addEventListener('click', () => playPronounce(p.url, btn));
      dt.appendChild(btn);
    });
    const dd = el('dd');
    const ul = el('ul');
    word.descs.forEach((desc) => {
      const li = el('li');
      if (desc.order) {
        li.appendChild(document.createTextNode(`${desc.order}. `));
      }
      if (desc.part) {
        li.appendChild(el('span', 'tag', desc.part));
        li.appendChild(document.createTextNode(' '));
      }
      appendRichText(li, desc.value);
      ul.appendChild(li);
    });
    dd.appendChild(ul);
    dl.appendChild(dt);
    dl.appendChild(dd);
    body.appendChild(dl);
  });
  const p = el('p', 'naver-link');
  const a = el('a', null, '네이버 사전 열기');
  a.href = result.pageUrl;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  p.appendChild(a);
  body.appendChild(p);
}

getWordMeaning(query).then((result) => {
  render(result);
  reportSize();
}).catch(() => {
  document.body.textContent = '';
  document.body.appendChild(el('div', 'msg', '검색 결과가 없습니다.'));
  reportSize();
});

function getWordMeaning(word) {
  const encodedWord = encodeURIComponent(word);
  const dictUrl = `https://en.dict.naver.com/api3/enko/search?query=${encodedWord}&m=pc&range=all&shouldSearchVlive=true&lang=ko`;
  const pageUrl = `https://en.dict.naver.com/#/search?query=${encodedWord}&range=all`;
  const init = {
    headers: {
      'User-Agent': `${window.navigator.userAgent} NotAndroid`,
    },
    'referrer': 'https://en.dict.naver.com/'
  };
  return fetch(dictUrl, init).then((response) => response.json())
    .then((data) => data.searchResultMap.searchResultListMap.WORD.items)
    .then((items) => {
      if (items.length < 1) {
        throw Error('No Result');
      }
      const words = items.slice(0, 4).map((item) => ({
        title: item.expEntry,
        pronounces: (item.searchPhoneticSymbolList || [])
          .filter((p) => p.symbolType !== 'accentia' && p.symbolFile)
          .map((p) => ({
            country: p.symbolType,
            text: p.symbolValue ? p.symbolValue : '',
            url: p.symbolFile
          })),
        descs: item.meansCollector.map((c) => c.means.map((mean) => ({
          order: mean.order,
          part: c.partOfSpeech,
          value: mean.value
        }))).flat()
      }));
      return { words: words, pageUrl: pageUrl };
    });
}
