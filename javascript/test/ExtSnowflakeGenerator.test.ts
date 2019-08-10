import ExtSnowflakeGenerator, {createSnowflake} from '../src/ExtSnowflakeGenerator';

test('ExtSnowflakeGenerator can be instantiated', () => {
  expect(() => {
    new ExtSnowflakeGenerator(0);
  }).not.toThrow();
});

test('ExtSnowflakeGenerator Instance ID too high', () => {
  expect(() => {
    new ExtSnowflakeGenerator(1024);
  }).toThrow();
});

test('ExtSnowflakeGenerator Instance ID too low', () => {
  expect(() => {
    new ExtSnowflakeGenerator(-1);
  }).toThrow();
});

test('creation is successful with lowest values', () => {
  expect(createSnowflake(0, 0, 0, 0)).toBe('A0000000000000000000');
});

test('creation is successful with highest values', () => {
  expect(createSnowflake(255, 2199023255551, 1023, 4095)).toBe('A0FF7FFFFFFFFFFFFFFF');
});

test('creation has sections in correct locations', () => {
  expect(createSnowflake(1, 1, 1, 1)).toBe('A0010000000000401001');
});

