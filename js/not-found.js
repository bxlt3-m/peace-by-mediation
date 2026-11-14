// Show the address that failed, and suggest a real page if it looks like a typo.

const PAGES = {
    script: '/script/script',
    report: '/',
    index: '/',
    home: '/',
};

// Edit distance: how many single-character changes turn a into b
function distance(a, b) {
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const row = [i];
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
        }
        prev = row;
    }
    return prev[b.length];
}

function closestPage(path) {
    const slug = path.split('/').filter(Boolean).pop()?.replace(/\.html?$/i, '').toLowerCase();
    if (!slug) return null;

    let best = null;
    for (const [name, href] of Object.entries(PAGES)) {
        const d = distance(slug, name);
        const limit = Math.max(2, Math.floor(name.length / 2));
        if (d <= limit && (!best || d < best.d)) best = { href, d };
    }
    return best?.href ?? null;
}

const missing = document.getElementById('missing');
const box = document.getElementById('suggest');
const link = document.getElementById('suggest-link');

if (missing && location.pathname !== '/') missing.textContent = location.pathname;

const match = closestPage(location.pathname);
if (match && box && link) {
    link.href = match;
    link.textContent = match;
    box.hidden = false;
}
