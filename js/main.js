import { initTheme } from './theme.js';
import { initChart } from './chart.js';
import { initMap } from './map.js';
import { initFootnotes } from './footnotes.js';
import { initReveal } from './reveal.js';
import { initScroll } from './scroll.js';
import { initNav } from './nav.js';

initTheme();
initChart();   // builds the chart from the table, so it must run before reveal and scroll
initMap();
initFootnotes();
initReveal();
initScroll();
initNav();
