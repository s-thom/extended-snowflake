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
  if (workerId < 0) {
    throw new Error(`Worker ID ${workerId} is too low`);
  } else if (workerId > 31) {
    throw new Error(`Worker ID ${workerId} is too large`);
  }
  if (processId < 0) {
    throw new Error(`Process ID ${processId} is too low`);
  } else if (processId > 31) {
    throw new Error(`Process ID ${processId} is too large`);
  }

  return processId + (workerId << 5);
}

/**
 * Converts a number to a hexadecimal string
 * @param n Number to stringify
 * @param padLength Padding length
 */
export function toHexString(n: number, padLength = 0) {
  return n
    .toString(16)
    .padStart(padLength, '0')
    .toUpperCase();
}
