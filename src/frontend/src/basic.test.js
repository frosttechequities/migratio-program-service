// Basic test file that doesn't depend on any imports
describe('Basic Tests', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });
});
