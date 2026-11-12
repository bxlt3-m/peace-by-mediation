// Reading progress bar and timeline fill, both driven by scroll
// through a single requestAnimationFrame callback.

const TIMELINE_LINE = 0.6; // fraction of the viewport where a milestone lights up

export function initScroll() {
    const root = document.documentElement;
    const bar = document.getElementById('progress');
    const timeline = document.getElementById('timeline');
    const stops = timeline ? [...timeline.querySelectorAll('li')] : [];

    if (!bar) return;

    let queued = false;
    let lastFill = -1;

    const clamp01 = (n) => Math.min(1, Math.max(0, n));

    function frame() {
        queued = false;

        // Read everything first, write afterwards, so layout is computed once
        const vh = window.innerHeight;
        const max = root.scrollHeight - vh;
        const progress = max > 0 ? clamp01(window.scrollY / max) : 0;

        let fill = 0;
        let tops = [];
        if (timeline) {
            const rect = timeline.getBoundingClientRect();
            fill = clamp01((vh * TIMELINE_LINE - rect.top) / rect.height);
            tops = stops.map((li) => li.getBoundingClientRect().top);
        }

        bar.style.transform = `scaleX(${progress.toFixed(4)})`;

        if (timeline && fill !== lastFill) {
            lastFill = fill;
            timeline.style.setProperty('--fill', fill.toFixed(4));
            stops.forEach((li, i) => li.classList.toggle('on', tops[i] < vh * TIMELINE_LINE));
        }
    }

    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    frame();
}
