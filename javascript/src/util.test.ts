import {
  combineWorkerProcess,
  toHexString,
} from './util';

test('Worker and Process IDs combine', () => {
  expect(combineWorkerProcess(0, 0)).toBe(0x000); // 0000 000000
  expect(combineWorkerProcess(1, 1)).toBe(0x021); // 00001 00001
  expect(combineWorkerProcess(31, 31)).toBe(0x3FF); // 11111 11111
  expect(combineWorkerProcess(5, 19)).toBe(0x0B3); // 00101 10011
});

test('Worker ID range too low', () => {
  expect(() => {
    combineWorkerProcess(-1, 0);
  }).toThrow();
});

test('Worker ID range too high', () => {
  expect(() => {
    combineWorkerProcess(32, 0);
  }).toThrow();
});

test('Process ID range too low', () => {
  expect(() => {
    combineWorkerProcess(0, -1);
  }).toThrow();
});

test('Process ID range too high', () => {
  expect(() => {
    combineWorkerProcess(0, 32);
  }).toThrow();
});

test('Hex strings to convert correctly', () => {
  expect(toHexString(0x0)).toBe('0');
  expect(toHexString(0xF)).toBe('F');
  expect(toHexString(0x0, 1)).toBe('0');
  expect(toHexString(0xF, 1)).toBe('F');
});

test('Hex strings to add padding', () => {
  expect(toHexString(0x0, 2)).toBe('00');
  expect(toHexString(0xF, 5)).toBe('0000F');
  expect(toHexString(0xDEADBEEF, 8)).toBe('DEADBEEF');
});

test('Hex strings to preserve original length', () => {
  expect(toHexString(0x10, 1)).toBe('10');
  expect(toHexString(0xFFFF, 3)).toBe('FFFF');
  expect(toHexString(0xDEADBEEF, 0)).toBe('DEADBEEF');
});

test('Hex string value too low', () => {
  expect(() => {
    toHexString(-1);
  }).toThrow();
});
