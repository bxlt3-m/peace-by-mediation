// Peace prize chart. The data comes straight from the table, so there is one source of truth.

import { el, showCard, showSay } from './readout.js';

const LANES = [
    { key: 'deal', label: 'Negotiated settlement' },
    { key: 'doc', label: 'Documentation, testimony and campaigning' },
];

function readPrizes() {
    return [...document.querySelectorAll('.tbl tbody tr')].map((row) => {
        const [year, laureate, place, why] = row.cells;
        const copy = why.cloneNode(true);
        copy.querySelectorAll('.tag, .fn').forEach((n) => n.remove());
        return {
            year: year.textContent.trim(),
            laureate: laureate.textContent.trim(),
            place: place.textContent.trim(),
            why: copy.textContent.trim(),
            deal: row.classList.contains('deal'),
        };
    }).reverse(); // the table runs newest first; the chart runs left to right in time
}

export function initChart() {
    const chart = document.getElementById('prize-chart');
    if (!chart) return;

    const prizes = readPrizes();
    if (!prizes.length) return;

    const lanes = chart.querySelector('.lanes');
    const panel = chart.querySelector('.readout');
    const dots = [];
    const byPrize = new Map();

    function select(button, prize) {
        dots.forEach((d) => d.setAttribute('aria-pressed', String(d === button)));
        showCard(panel, {
            kicker: `${prize.year} \u00b7 ${prize.place}`,
            title: prize.laureate,
            body: prize.why,
            tag: prize.deal ? 'Negotiated settlement' : '',
        });
        showSay(chart, prize.year);
    }

    for (const lane of LANES) {
        const wrap = el('div', `lane lane-${lane.key}`);
        const grid = el('div', 'dots');
        wrap.append(el('span', 'lane-label', lane.label), grid);

        for (const prize of prizes) {
            const slot = el('div', 'slot');
            if ((lane.key === 'deal') === prize.deal) {
                const button = el('button', `dot dot-${lane.key}`);
                button.type = 'button';
                button.setAttribute('aria-pressed', 'false');
                button.setAttribute('aria-label', `${prize.year}: ${prize.laureate}`);
                button.addEventListener('click', () => select(button, prize));
                button.addEventListener('pointerenter', (e) => {
                    if (e.pointerType === 'mouse') select(button, prize);
                });
                dots.push(button);
                byPrize.set(prize, button);
                slot.append(button);
            } else {
                slot.append(el('i'));
            }
            grid.append(slot);
        }
        lanes.append(wrap);
    }

    const axis = el('div', 'axis');
    prizes.forEach((p) => axis.append(el('span', '', p.year)));
    lanes.append(axis);

    const latest = prizes[prizes.length - 1];
    select(byPrize.get(latest), latest);

    chart.hidden = false;
}
