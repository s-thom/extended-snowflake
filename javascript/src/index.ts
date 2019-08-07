export default class SnowflakeGenerator {
  private readonly workerId: number;
  private readonly processId: number;

  private lastGeneratedId: number;
  private lastGeneratedTimestamp: number;

  constructor(workerId: number, processId: number) {
    // Check types of these IDs
    if ((typeof workerId !== 'number') || (typeof processId !== 'number')) {
      throw new Error(`Worker ID (${workerId}) or Process ID (${processId}) was not a number`);
    }

    // Also ensure they're in the correct range
    if (workerId > 31) {
      throw new Error(`Worker ID ${workerId} is too large`);
    }
    if (processId > 31) {
      throw new Error(`Worker ID ${processId} is too large`);
    }

    this.workerId = workerId;
    this.processId = processId;
  }

  public next() {
    // A forenote:
    // Javascript has no notion on threads, as it's a single threaded event loop.
    // WebWorkers do bring threading in, so care must be taken then.
    // Honestly, I'm not sure how that will turn out.
    // JS has no `synchronised {}` block, like Java and others, so I'm not sure
    // that this library can protect against potentially wrong usage.

    const timestamp = Date.now();

    if (timestamp != this.lastGeneratedTimestamp) {
      // Reset the counter
      this.lastGeneratedTimestamp = timestamp;
      this.lastGeneratedId = 0;
    } else {
      // Check for overflow (12 bits)
      if (this.lastGeneratedId >= 4096) {
        throw new Error(`Highest ID reached for worker ${this.workerId}, process ${this.processId}, timestamp ${timestamp}`);
      }

      // Increment ID
      this.lastGeneratedId++;
    }

    // All this date manipulation could probably be tidied up or optimised
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const yearRange = Math.floor(year / 50);
    const epochYear = yearRange * 50;
    const epochId = yearRange - 40;
    const epochDate = new Date(epochYear, 0);
    const epochTimestamp = epochDate.getTime();
    const timeOffset = timestamp - epochTimestamp;

    // As the timestamp section is only 41 bits, and JS doesn't do 64 bit ints,
    // and bitwise operations act on 32 bit ints.
    // The Snowflake section needs to be split in two
    // The upper section holds the unused bit and the highest 31 bits of the timestamp
    // The lower section holds the lowest 10 bits of the timestamp, the worker/process IDs, and the counter

    // Snowflake upper
    // Since the time offset is less than 2^41, the 42nd is always 0
    const snowflakeUpper = timeOffset >>> 10;

    // Snowflake lower
    // Lower part of the timestamp just needs to be masked and shifted into place
    const timestampShift = (timeOffset & 0x3FF) << 22;
    const workerShift = this.workerId << 17;
    const processShift = this.processId << 12;
    const snowflakeLower = timestampShift + workerShift + processShift + this.lastGeneratedId

    const epochString = epochId.toString(16).padStart(2, '0');
    const snowflakeUpperString = snowflakeUpper.toString(16).padStart(8, '0');
    const snowflakeLowerString = snowflakeLower.toString(16).padStart(8, '0');
    return `A0${epochString}${snowflakeUpperString}${snowflakeLowerString}`;
  }
}
