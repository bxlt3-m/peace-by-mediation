// Light and dark theme. A snippet in <head> sets the starting theme before paint;
// this module wires the button and follows the system setting until the reader picks one.

const KEY = 'report-theme';
const COLORS = { light: '#f3efe6', dark: '#0f1511' };

function read() {
    try { return localStorage.getItem(KEY); } catch { return null; }
}

function write(value) {
    try { localStorage.setItem(KEY, value); } catch { /* storage blocked */ }
}

export function initTheme() {
    const root = document.documentElement;
    const button = document.getElementById('theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    const system = window.matchMedia('(prefers-color-scheme: dark)');

    function apply(theme) {
        root.dataset.theme = theme;
        if (meta) meta.setAttribute('content', COLORS[theme]);
        if (button) {
            button.setAttribute('aria-pressed', String(theme === 'dark'));
            button.setAttribute('aria-label', theme === 'dark' ? 'Light mode' : 'Dark mode');
        }
    }

    apply(read() || (system.matches ? 'dark' : 'light'));

    button?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        apply(next);
        write(next);
    });

    system.addEventListener('change', (e) => {
        if (!read()) apply(e.matches ? 'dark' : 'light');
    });
}
