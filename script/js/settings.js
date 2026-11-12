// Text size, reading mode and Arabic toggle, remembered in localStorage.
// An inline snippet in <head> applies the saved values before first paint;
// this module wires up the buttons and keeps them in sync.

const KEY = { size: 'say-size', theme: 'say-theme', arabic: 'say-ar' };
const SIZE = { min: 1.0, max: 2.6, step: 0.12, fallback: 1.4 };

const root = document.documentElement;

function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

function write(key, value) {
    try { localStorage.setItem(key, value); } catch { /* private mode or storage blocked */ }
}

function initSize() {
    const smaller = document.getElementById('smaller');
    const larger = document.getElementById('larger');

    // Saved value wins; otherwise read whatever size the stylesheet gives this screen
    let size = parseFloat(read(KEY.size))
        || parseFloat(getComputedStyle(root).getPropertyValue('--say'))
        || SIZE.fallback;

    function apply(next) {
        size = Math.min(SIZE.max, Math.max(SIZE.min, next));
        root.style.setProperty('--say', `${size.toFixed(2)}rem`);
        write(KEY.size, size.toFixed(2));
        smaller.disabled = size <= SIZE.min;
        larger.disabled = size >= SIZE.max;
    }

    smaller.addEventListener('click', () => apply(size - SIZE.step));
    larger.addEventListener('click', () => apply(size + SIZE.step));
    smaller.disabled = size <= SIZE.min;
    larger.disabled = size >= SIZE.max;
}

function initTheme() {
    const button = document.getElementById('theme');
    const meta = document.querySelector('meta[name="theme-color"]');

    function set(dark, persist) {
        if (dark) root.dataset.theme = 'dark';
        else delete root.dataset.theme;
        button.setAttribute('aria-pressed', String(dark));
        if (meta) meta.setAttribute('content', dark ? '#0d1a13' : '#f3efe6');
        if (persist) write(KEY.theme, dark ? 'dark' : 'light');
    }

    set(read(KEY.theme) === 'dark', false);
    button.addEventListener('click', () => set(button.getAttribute('aria-pressed') !== 'true', true));
}

function initArabic() {
    const button = document.getElementById('arbtn');

    function set(on, persist) {
        root.classList.toggle('show-ar', on);
        button.setAttribute('aria-pressed', String(on));
        if (persist) write(KEY.arabic, on ? '1' : '0');
    }

    set(read(KEY.arabic) === '1', false);
    button.addEventListener('click', () => set(button.getAttribute('aria-pressed') !== 'true', true));
}

export function initSettings() {
    initSize();
    initTheme();
    initArabic();
}
