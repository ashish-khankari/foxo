import { Biomarker } from './types';

export type Trend = 'up' | 'down' | 'steady';

// Change of less than 3% from first to last reading counts as steady.
export function getTrend(history: number[]): Trend {
  if (history.length < 2) return 'steady';
  const first = history[0];
  const last = history[history.length - 1];
  if (first === 0) return last === 0 ? 'steady' : 'up';
  const change = (last - first) / Math.abs(first);
  if (Math.abs(change) < 0.03) return 'steady';
  return change > 0 ? 'up' : 'down';
}

export function trendSentence(m: Biomarker): string {
  const t = getTrend(m.history);
  const n = m.history.length;
  if (t === 'steady') return `Your ${m.name} has stayed steady over ${n} tests.`;
  const dir = t === 'up' ? 'rising' : 'dropping';
  return `Your ${m.name} has been ${dir} over ${n} tests.`;
}

export type RangeState = 'low' | 'in' | 'high';

// Understands '4.0-5.6', '<100' and '>40'. Returns null if the format is unknown.
export function parseRange(range: string): { min: number; max: number } | null {
  const r = range.trim();
  const between = r.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/);
  if (between) return { min: parseFloat(between[1]), max: parseFloat(between[2]) };
  const lt = r.match(/^<\s*(\d+(?:\.\d+)?)$/);
  if (lt) return { min: -Infinity, max: parseFloat(lt[1]) };
  const gt = r.match(/^>\s*(\d+(?:\.\d+)?)$/);
  if (gt) return { min: parseFloat(gt[1]), max: Infinity };
  return null;
}

export function rangeState(value: number, range: string): RangeState {
  const p = parseRange(range);
  if (!p) return 'in';
  if (value < p.min) return 'low';
  if (value > p.max) return 'high';
  return 'in';
}

// Index of the reading where the result first left its usual range and stayed out, or -1.
export function outOfRangeSince(m: Biomarker): number {
  let since = -1;
  m.history.forEach((v, i) => {
    if (rangeState(v, m.range) === 'in') since = -1;
    else if (since === -1) since = i;
  });
  return since;
}

export function doctorQuestions(m: Biomarker): string[] {
  if (m.status === 'normal') return [];
  const t = getTrend(m.history);
  const last = m.history[m.history.length - 1];
  return [
    `My ${m.name} is ${last} ${m.unit} (usual range ${m.range}). What could be causing this?`,
    t === 'steady'
      ? 'Do I need to act now, or just recheck later?'
      : `It is ${t === 'up' ? 'rising' : 'dropping'}. How soon should I retest?`,
  ];
}

// Always returns at least one question, even for normal results.
export function questionsFor(m: Biomarker): string[] {
  const qs = doctorQuestions(m);
  return qs.length ? qs : ['Anything I should know about this result?'];
}

export function buildSummary(markers: Biomarker[], flagged: string[]): string {
  const picked = markers.filter((m) => m.status !== 'normal' || flagged.includes(m.id));
  if (picked.length === 0) return 'All results look normal. No questions for now.';
  return picked
    .map((m) => `${m.name}\n${questionsFor(m).map((q) => `- ${q}`).join('\n')}`)
    .join('\n\n');
}
