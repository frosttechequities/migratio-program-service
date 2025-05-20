import { add, subtract, multiply, divide } from '../math';

describe('Math Utils', () => {
  test('add function adds two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('subtract function subtracts two numbers correctly', () => {
    expect(subtract(3, 2)).toBe(1);
    expect(subtract(1, 1)).toBe(0);
    expect(subtract(0, 5)).toBe(-5);
  });

  test('multiply function multiplies two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
  });

  test('divide function divides two numbers correctly', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(5, 2)).toBe(2.5);
    expect(divide(0, 5)).toBe(0);
  });
});
