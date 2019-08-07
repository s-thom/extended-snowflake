export default class SnowflakeGenerator {
  private readonly workerId: number;
  private readonly processId: number;

  private lastGeneratedId: number;
  private lastGeneratedTimestamp: number;

  constructor(workerId: number, processId: number) {
    if ((typeof workerId !== 'number') || (typeof processId !== 'number')) {
      throw new Error(`Worker ID (${workerId}) or Process ID (${processId}) was not a number`);
    }
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

  }
}
