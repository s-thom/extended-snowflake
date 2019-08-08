export {
  default as ExtSnowflakeGenerator,
} from './ExtSnowflakeGenerator';

/**
 * Combines a worker and process ID into a single instance ID
 * @param workerId Worker ID (5 bits)
 * @param processId Process ID (5 bits)
 */
export function combineWorkerProcess(workerId: number, processId: number) {
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

  return processId + (workerId << 5);
}
