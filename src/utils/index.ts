const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export { delay };
export { formatJsforceError, hubRequest } from './formatJsforceError.js';
