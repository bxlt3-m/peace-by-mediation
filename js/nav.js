// Mark the nav link for whichever section sits in the middle of the viewport.

export function initNav() {
    if (!('IntersectionObserver' in window)) return;

    const links = [...document.querySelectorAll('.nav a')];
    const sections = links
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const current = `#${entry.target.id}`;
            links.forEach((a) => {
                a.setAttribute('aria-current', String(a.getAttribute('href') === current));
            });
        }
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((s) => io.observe(s));
}
