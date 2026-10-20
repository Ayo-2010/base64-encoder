var inputEl = document.getElementById('input');
var outputEl = document.getElementById('output');
var encodeBtn = document.getElementById('encodeBtn');
var decodeBtn = document.getElementById('decodeBtn');
var swapBtn = document.getElementById('swapBtn');
var copyBtn = document.getElementById('copyBtn');
var clearBtn = document.getElementById('clearBtn');
var urlSafeEl = document.getElementById('urlSafe');
var errorEl = document.getElementById('error');
var sizesEl = document.getElementById('sizes');
var inLabelEl = document.getElementById('inLabel');
var outLabelEl = document.getElementById('outLabel');

var encoder = new TextEncoder();
var decoder = new TextDecoder('utf-8', { fatal: true });
var mode = 'encode';

function byteLength(text) {
  return encoder.encode(text).length;
}

function toBase64(text, urlSafe) {
  var bytes = encoder.encode(text);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var result = window.btoa(binary);
  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return result;
}

function fromBase64(text) {
  var cleaned = text.replace(/\s+/g, '');
  if (cleaned === '') {
    return '';
  }
  cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
  if (/[^A-Za-z0-9+/=]/.test(cleaned)) {
    throw new Error('Input has characters that are not valid Base64.');
  }
  var remainder = cleaned.length % 4;
  if (remainder === 1) {
    throw new Error('Input length is not valid Base64.');
  }
  if (remainder > 0) {
    cleaned += '===='.slice(0, 4 - remainder);
  }
  var binary = window.atob(cleaned);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  try {
    return decoder.decode(bytes);
  } catch (err) {
    throw new Error('Decoded bytes are not valid UTF-8 text.');
  }
}

function setError(message) {
  errorEl.textContent = message || '';
}

function updateSizes(inputText, outputText) {
  sizesEl.textContent = byteLength(inputText) + ' bytes in \u00b7 ' + byteLength(outputText) + ' bytes out';
}

function updateLabels() {
  if (mode === 'encode') {
    inLabelEl.textContent = 'Plain text';
    outLabelEl.textContent = 'Base64';
  } else {
    inLabelEl.textContent = 'Base64';
    outLabelEl.textContent = 'Plain text';
  }
}

function convert(showErrors) {
  var text = inputEl.value;
  if (text.trim() === '') {
    outputEl.value = '';
    setError('');
    updateSizes('', '');
    return;
  }
  if (mode === 'encode') {
    try {
      var encoded = toBase64(text, urlSafeEl.checked);
      outputEl.value = encoded;
      setError('');
      updateSizes(text, encoded);
    } catch (err) {
      outputEl.value = '';
      setError('Could not encode this text.');
      updateSizes(text, '');
    }
    return;
  }
  try {
    var decoded = fromBase64(text);
    outputEl.value = decoded;
    setError('');
    updateSizes(text, decoded);
  } catch (err) {
    outputEl.value = '';
    if (showErrors) {
      setError(err.message);
    } else {
      setError('');
    }
    updateSizes(text, '');
  }
}

function setMode(next) {
  mode = next;
  updateLabels();
  try {
    window.localStorage.setItem('b64.mode', mode);
  } catch (err) {
    return;
  }
}

encodeBtn.addEventListener('click', function () {
  setMode('encode');
  convert(true);
});

decodeBtn.addEventListener('click', function () {
  setMode('decode');
  convert(true);
});

swapBtn.addEventListener('click', function () {
  var previous = outputEl.value;
  inputEl.value = previous;
  setMode(mode === 'encode' ? 'decode' : 'encode');
  convert(true);
});

copyBtn.addEventListener('click', function () {
  var text = outputEl.value;
  if (text === '') {
    setError('There is no output to copy yet.');
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      setError('');
      sizesEl.textContent = 'Output copied \u00b7 ' + byteLength(text) + ' bytes';
    }).catch(function () {
      setError('The browser blocked clipboard access.');
    });
  } else {
    setError('Clipboard is not available in this browser.');
  }
});

clearBtn.addEventListener('click', function () {
  inputEl.value = '';
  outputEl.value = '';
  setError('');
  updateSizes('', '');
  inputEl.focus();
});

urlSafeEl.addEventListener('change', function () {
  try {
    window.localStorage.setItem('b64.urlSafe', urlSafeEl.checked ? '1' : '0');
  } catch (err) {
    return;
  }
  convert(true);
});

inputEl.addEventListener('input', function () {
  convert(mode === 'decode');
});

document.addEventListener('keydown', function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    convert(true);
  }
});

(function init() {
  try {
    var saved = window.localStorage.getItem('b64.urlSafe');
    if (saved === '1') {
      urlSafeEl.checked = true;
    }
    var savedMode = window.localStorage.getItem('b64.mode');
    if (savedMode === 'decode') {
      setMode('decode');
    }
  } catch (err) {
    urlSafeEl.checked = false;
  }
  updateLabels();
  updateSizes('', '');
})();
