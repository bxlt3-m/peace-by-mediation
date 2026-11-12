// Stopwatch against the planned running time, with an alert when you go over.
// Time comes from performance.now(), so a throttled background tab stays accurate.

import { formatTime, getTargetSeconds } from './metrics.js';

export function initTimer() {
    const clock = document.getElementById('clock');
    const time = document.getElementById('clock-time');
    const note = document.getElementById('clock-note');
    const status = document.getElementById('timer-status');
    const startBtn = document.getElementById('start');
    const resetBtn = document.getElementById('reset');

    const limit = getTargetSeconds();

    let banked = 0;      // seconds from earlier runs, before the last pause
    let startedAt = 0;   // performance.now() when the current run began, 0 when paused
    let interval = null;
    let shown = -1;      // whole second currently on screen
    let alerted = false;

    const elapsed = () => banked + (startedAt ? (performance.now() - startedAt) / 1000 : 0);

    function overtimeAlert() {
        alerted = true;
        status.textContent = `Time is up. You are past the ${formatTime(limit)} limit.`;
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }

    // Only touch the DOM when the visible second changes
    function paint() {
        const secs = Math.floor(elapsed());
        if (secs === shown) return;
        shown = secs;

        const over = secs > limit;
        time.textContent = formatTime(secs);
        note.textContent = over ? `+${formatTime(secs - limit)} over` : `of ${formatTime(limit)}`;
        clock.classList.toggle('over', over);
        if (over && !alerted) overtimeAlert();
    }

    function toggle() {
        if (interval) {
            banked = elapsed();
            startedAt = 0;
            clearInterval(interval);
            interval = null;
            startBtn.textContent = 'Resume';
        } else {
            startedAt = performance.now();
            interval = setInterval(paint, 250);
            startBtn.textContent = 'Pause';
        }
        paint();
    }

    function reset() {
        clearInterval(interval);
        interval = null;
        banked = 0;
        startedAt = 0;
        shown = -1;
        alerted = false;
        status.textContent = '';
        startBtn.textContent = 'Start';
        paint();
    }

    startBtn.addEventListener('click', toggle);
    resetBtn.addEventListener('click', reset);
    paint();
}
