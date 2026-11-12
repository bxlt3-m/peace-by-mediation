// Fade-and-lift elements in as they scroll into view.
// Siblings that enter together get a small stagger via --i.

export function initReveal() {
    const items = document.querySelectorAll('.rv');

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        let n = 0;
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.style.setProperty('--i', Math.min(n++, 6));
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        }
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    items.forEach((el) => io.observe(el));
}
