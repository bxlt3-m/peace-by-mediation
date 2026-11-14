// Small helpers shared by the chart and the map.

export function el(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

// Show the "what to say" box that matches the selected button, if the page has them (the script page does).
export function showSay(figure, key) {
    const root = figure.closest('.aid-body') || figure;
    root.querySelectorAll('[data-say-for]').forEach((box) => { box.hidden = box.dataset.sayFor !== String(key); });
}

// Fill a readout card. Built with DOM methods, so page text can never inject markup.
export function showCard(panel, { kicker, title, body, tag }) {
    const nodes = [el('span', 'k', kicker), el('h3', '', title)];
    if (body) nodes.push(el('p', '', body));
    if (tag) nodes.push(el('span', 'tag', tag));
    panel.replaceChildren(...nodes);
}
