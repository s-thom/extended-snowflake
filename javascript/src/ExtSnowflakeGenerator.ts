export function createSnowflake(epochId: number, timeOffset: number, instanceId: number, counter: number) {
  // As the timestamp section is only 41 bits, and JS doesn't do 64 bit ints,
  // and bitwise operations act on 32 bit signed ints
  // Since they're signed, the unused + timestamp + instance ID (52 bits)
  // needs to be done as 2 separate sections. As they must be aligned to
  // every 4 bits (for stringifying), the upper will be 28 bits, and the
  // lower 24 bits.

  // Can't just shift, because that'd remove the upper bits of the timestamp
  const timestampUpper = Math.floor(timeOffset / 16384);
  const timestampLower = ((timeOffset & 0x03FFF) << 10) + instanceId;

  const epochString = epochId.toString(16).padStart(2, '0');
  const upperString = timestampUpper.toString(16).padStart(7, '0');
  const lowerString = timestampLower.toString(16).padStart(6, '0');
  const counterString = counter.toString(16).padStart(3, '0');
  return `A0${epochString}${upperString}${lowerString}${counterString}`.toUpperCase();
}

export default class ExtSnowflakeGenerator {
  private readonly instanceId: number;

  private lastGeneratedId: number;
  private lastGeneratedTimestamp: number;

  constructor(instanceId: number) {
    // Check types of the instance ID
    if ((typeof instanceId !== 'number')) {
      throw new Error(`Instance ID (${instanceId}) is not a number`);
    }

    // Also ensure they're in the correct range
    if (instanceId < 0){
      throw new Error(`Instance ID (${instanceId}) is too low`);
    } else if (instanceId >= 1024) {
      throw new Error(`Instance ID (${instanceId}) is too large`);
    }

    this.instanceId = instanceId;
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
        throw new Error(`Highest ID reached for Instance ID: ${this.instanceId}, Timestamp: ${timestamp}`);
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

    return createSnowflake(epochId, timeOffset, this.instanceId, this.lastGeneratedId);
  }
}
