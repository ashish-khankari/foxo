import { getTrend, doctorQuestions, buildSummary, parseRange, rangeState, outOfRangeSince } from '../utils';
import { BIOMARKERS } from '../data';

describe('ranges', () => {
  it('parses the formats used in the data', () => {
    expect(parseRange('4.0-5.6')).toEqual({ min: 4, max: 5.6 });
    expect(parseRange('<100')).toEqual({ min: -Infinity, max: 100 });
    expect(parseRange('>40')).toEqual({ min: 40, max: Infinity });
    expect(parseRange('weird')).toBeNull();
  });
  it('parses every biomarker range', () => {
    BIOMARKERS.forEach((m) => expect(parseRange(m.range)).not.toBeNull());
  });
  it('classifies values', () => {
    expect(rangeState(5.9, '4.0-5.6')).toBe('high');
    expect(rangeState(21, '30-100')).toBe('low');
    expect(rangeState(50, '>40')).toBe('in');
  });
  it('finds when a result left range', () => {
    expect(outOfRangeSince(BIOMARKERS.find((m) => m.id === 'hba1c')!)).toBe(2);
    expect(outOfRangeSince(BIOMARKERS.find((m) => m.id === 'tsh')!)).toBe(-1);
  });
});

describe('getTrend', () => {
  it('detects rising, dropping and steady', () => {
    expect(getTrend([5, 6])).toBe('up');
    expect(getTrend([30, 20])).toBe('down');
    expect(getTrend([100, 101])).toBe('steady');
  });
  it('handles short history', () => {
    expect(getTrend([])).toBe('steady');
    expect(getTrend([4])).toBe('steady');
  });
});

describe('doctorQuestions', () => {
  it('returns nothing for normal results', () => {
    expect(doctorQuestions(BIOMARKERS.find((m) => m.status === 'normal')!)).toEqual([]);
  });
  it('returns questions for results that need attention', () => {
    expect(doctorQuestions(BIOMARKERS.find((m) => m.id === 'hba1c')!).length).toBe(2);
  });
});

describe('buildSummary', () => {
  it('includes flagged normal results', () => {
    expect(buildSummary(BIOMARKERS, ['tsh'])).toContain('TSH');
  });
});
