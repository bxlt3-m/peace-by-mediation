import { initMetrics } from './metrics.js';
import { initSettings } from './settings.js';
import { initTimer } from './timer.js';

const root = document.documentElement;

// Fade lines in as they scroll into view
function initReveal() {
    const items = document.querySelectorAll('.rv');

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

    items.forEach((el) => io.observe(el));
}

// Reading progress, one transform write per animation frame
function initProgress() {
    const bar = document.getElementById('progress');
    let queued = false;

    function frame() {
        queued = false;
        const max = root.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }

    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    // Text size and the Arabic toggle change page height without any scroll
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
    frame();
}

// Highlight the time pill of the segment you are reading
function initActiveSegment() {
    if (!('IntersectionObserver' in window)) return;

    const segments = [...document.querySelectorAll('.seg')];
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            segments.forEach((s) => s.classList.toggle('active', s === entry.target));
        }
    }, { rootMargin: '-35% 0px -55% 0px' });

    segments.forEach((s) => io.observe(s));
}

initMetrics();
initSettings();
initTimer();
initReveal();
initProgress();
initActiveSegment();
