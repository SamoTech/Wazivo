import { formatDate, getPriorityColor, cn } from '../utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('baz');
  });
});

describe('formatDate', () => {
  it('returns "Recently" for undefined', () => {
    expect(formatDate()).toBe('Recently');
  });

  it('returns "Today" for current date', () => {
    const today = new Date().toISOString();
    expect(formatDate(today)).toBe('Today');
  });

  it('returns relative time for recent dates', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const result = formatDate(yesterday);
    expect(result).toBe('Yesterday');
  });

  it('handles invalid dates gracefully', () => {
    expect(formatDate('invalid-date')).toBe('Recently');
  });
});

describe('getPriorityColor', () => {
  it('returns red classes for high priority', () => {
    const result = getPriorityColor('high');
    expect(result).toContain('red');
  });

  it('returns yellow classes for medium priority', () => {
    const result = getPriorityColor('medium');
    expect(result).toContain('yellow');
  });

  it('returns green classes for low priority', () => {
    const result = getPriorityColor('low');
    expect(result).toContain('green');
  });

  it('returns gray classes for unknown priority', () => {
    const result = getPriorityColor('unknown');
    expect(result).toContain('gray');
  });

  it('is case-insensitive', () => {
    expect(getPriorityColor('HIGH')).toContain('red');
    expect(getPriorityColor('Medium')).toContain('yellow');
  });
});
