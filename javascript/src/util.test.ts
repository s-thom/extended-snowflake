import {combineWorkerProcess} from './util';

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
