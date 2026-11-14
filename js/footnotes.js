// Numbered sources: a popover on hover or focus, and a link back from each source.

import { el } from './readout.js';

export function initFootnotes() {
    const marks = [...document.querySelectorAll('.fn a[href^="#src-"]')];
    if (!marks.length) return;

    const pop = el('div', 'fn-pop');
    pop.setAttribute('role', 'tooltip');
    document.body.append(pop);

    const firstMark = new Map(); // source <li> -> first marker that cites it

    function show(mark) {
        pop.replaceChildren(el('span', '', mark.dataset.title), el('small', '', mark.dataset.host));
        pop.classList.add('show');

        const rect = mark.getBoundingClientRect();
        const width = pop.offsetWidth;
        const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12);
        const above = rect.top - pop.offsetHeight - 10;
        pop.style.left = `${left}px`;
        pop.style.top = `${above > 72 ? above : rect.bottom + 10}px`; // 72px keeps clear of the sticky header
    }

    const hide = () => pop.classList.remove('show');

    // A source can sit inside a closed <details> frame; open it so the jump has somewhere to land
    function openFrame(target) {
        for (let d = target?.closest('details'); d; d = d.parentElement?.closest('details')) d.open = true;
    }

    for (const mark of marks) {
        const source = document.querySelector(mark.getAttribute('href'));
        const link = source?.querySelector('a');
        if (!link) continue;

        mark.dataset.title = link.textContent.trim();
        mark.dataset.host = new URL(link.href).hostname.replace(/^www\./, '');
        mark.setAttribute('aria-label', `Source ${mark.textContent}: ${mark.dataset.title}`);

        if (!firstMark.has(source)) {
            mark.id = `ref-${mark.textContent}`;
            firstMark.set(source, mark);
        }

        mark.addEventListener('click', () => openFrame(source));
        mark.addEventListener('pointerenter', () => show(mark));
        mark.addEventListener('focus', () => show(mark));
        mark.addEventListener('pointerleave', hide);
        mark.addEventListener('blur', hide);
    }

    firstMark.forEach((mark, source) => {
        const back = el('a', 'back', '\u2191');
        back.href = `#${mark.id}`;
        back.setAttribute('aria-label', 'Back to where this source is cited');
        source.append(back);
    });

    const openFromHash = () => { if (location.hash) openFrame(document.querySelector(location.hash)); };
    window.addEventListener('hashchange', openFromHash);
    openFromHash();

    window.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
}
