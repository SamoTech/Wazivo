import { formatDate, truncateText } from '../utils';

describe('truncateText', () => {
  it('returns original string if shorter than limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis', () => {
    const result = truncateText('hello world', 5);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(8);
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid date', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
