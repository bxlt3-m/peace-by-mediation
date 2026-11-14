// Mission map: pins on the map and chips below it both drive one readout card.

import { el, showCard, showSay } from './readout.js';

export function initMap() {
    const figure = document.getElementById('mission-map');
    if (!figure) return;

    const pins = [...figure.querySelectorAll('.pin')];
    const list = figure.querySelector('.chips');
    const panel = figure.querySelector('.readout');

    function select(index) {
        pins.forEach((pin, i) => {
            pin.classList.toggle('on', i === index);
            chips[i].setAttribute('aria-pressed', String(i === index));
        });
        const pin = pins[index];
        showCard(panel, {
            kicker: pin.dataset.when,
            title: `${pin.dataset.n}. ${pin.dataset.place}`,
            body: pin.dataset.text,
        });
        showSay(figure, pin.dataset.n);
    }

    // Chips are the keyboard and screen-reader route; the SVG pins are for the pointer
    const chips = pins.map((pin, i) => {
        const chip = el('button', 'chip');
        chip.type = 'button';
        chip.setAttribute('aria-pressed', 'false');
        chip.append(el('b', '', pin.dataset.n), document.createTextNode(pin.dataset.place));
        chip.addEventListener('click', () => select(i));

        pin.addEventListener('click', () => select(i));
        pin.addEventListener('pointerenter', (e) => {
            if (e.pointerType === 'mouse') select(i);
        });

        const item = el('li');
        item.append(chip);
        list.append(item);
        return chip;
    });

    select(0);
}
