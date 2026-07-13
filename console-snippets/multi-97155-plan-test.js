/**
 * Paste in panel console after a 97155 scan, or run: node console-snippets/multi-97155-plan-test.js
 * (standalone copy of peel planner for quick checks)
 */
function minutesToTimeString(minutes) {
  if (minutes == null || typeof minutes !== 'number') return '';
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const isPm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const pad = (n) => String(n).padStart(2, '0');
  return pad(h12) + ':' + pad(m) + ' ' + (isPm ? 'PM' : 'AM');
}

const TOL = 1;
function segOverlap(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1;
}
function classify(wStart, wEnd, s0, s1) {
  const os = Math.max(wStart, s0);
  const oe = Math.min(wEnd, s1);
  if (oe <= os) return null;
  if (os <= s0 + TOL) return 'start';
  if (oe >= s1 - TOL) return 'end';
  return 'middle';
}

function buildPlan(entry97153, concurrent97155) {
  const S = entry97153.startMinutes;
  const E = entry97153.endMinutes;
  const windows = concurrent97155
    .map((e) => ({
      startMinutes: Math.max(S, e.startMinutes),
      endMinutes: Math.min(E, e.endMinutes),
      entry: e
    }))
    .filter((w) => w.endMinutes > w.startMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);
  let billableSpans = [{ lineIndex: 0, startMinutes: S, endMinutes: E }];
  const nonBillableLines = [];
  let nextLineIndex = 1;
  for (const w of windows) {
    const spanIdx = billableSpans.findIndex((s) =>
      segOverlap(s.startMinutes, s.endMinutes, w.startMinutes, w.endMinutes)
    );
    if (spanIdx === -1) {
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes
      });
      continue;
    }
    const span = billableSpans[spanIdx];
    const kind = classify(w.startMinutes, w.endMinutes, span.startMinutes, span.endMinutes);
    if (kind === 'start') {
      billableSpans[spanIdx] = { ...span, startMinutes: w.endMinutes };
      nonBillableLines.push({ lineIndex: nextLineIndex++, startMinutes: w.startMinutes, endMinutes: w.endMinutes });
    } else if (kind === 'end') {
      billableSpans[spanIdx] = { ...span, endMinutes: w.startMinutes };
      nonBillableLines.push({ lineIndex: nextLineIndex++, startMinutes: w.startMinutes, endMinutes: w.endMinutes });
    } else {
      const oldEnd = span.endMinutes;
      billableSpans[spanIdx] = { ...span, endMinutes: w.startMinutes };
      nonBillableLines.push({ lineIndex: nextLineIndex++, startMinutes: w.startMinutes, endMinutes: w.endMinutes });
      billableSpans.push({ lineIndex: nextLineIndex++, startMinutes: w.endMinutes, endMinutes: oldEnd });
    }
  }
  const all = [
    ...billableSpans.map((s) => ({ ...s, type: 'billable' })),
    ...nonBillableLines.map((n) => ({ ...n, type: 'nonbillable' }))
  ].sort((a, b) => a.lineIndex - b.lineIndex);
  return all.map((l) => ({
    line: l.lineIndex + 1,
    type: l.type,
    from: minutesToTimeString(l.startMinutes),
    to: minutesToTimeString(l.endMinutes)
  }));
}

const exA = buildPlan(
  { startMinutes: 9 * 60, endMinutes: 12 * 60 },
  [
    { startMinutes: 9 * 60, endMinutes: 10 * 60 },
    { startMinutes: 10 * 60 + 30, endMinutes: 11 * 60 + 30 }
  ]
);
console.log('Example A', exA);
