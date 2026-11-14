// Word counts and reading-time estimates, computed from the script text.

export const WPM = 130;

export function formatTime(seconds) {
    const s = Math.round(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const segments = () => [...document.querySelectorAll('.seg')];

// Total planned time, summed from each segment's data-target (seconds)
export function getTargetSeconds() {
    return segments().reduce((sum, seg) => sum + (Number(seg.dataset.target) || 0), 0);
}

// Count only what is spoken: skip the Arabic lines, the "pause" tags and footnote numbers
function countSpoken(segment) {
    let words = 0;
    segment.querySelectorAll('.say, .list').forEach((el) => {
        if (el.closest('.aid')) return; // optional visual aids are not part of the 6:30 talk
        const copy = el.cloneNode(true);
        copy.querySelectorAll('.ar, .pause, .fn').forEach((x) => x.remove());
        words += copy.textContent.trim().split(/\s+/).filter(Boolean).length;
    });
    return words;
}

export function initMetrics() {
    let total = 0;

    for (const seg of segments()) {
        const words = countSpoken(seg);
        total += words;

        const note = seg.querySelector('.est');
        if (note) {
            const target = Number(seg.dataset.target) || 0;
            note.textContent =
                `${words} words, about ${formatTime((words / WPM) * 60)} spoken. Target ${formatTime(target)}.`;
        }
    }

    document.getElementById('wc').textContent = total.toLocaleString();
    document.getElementById('rt').textContent = formatTime((total / WPM) * 60);
}
