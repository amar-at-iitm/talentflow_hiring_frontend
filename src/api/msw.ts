import { setupWorker } from 'msw/browser';
import { jobsHandlers } from './handlers/jobs';
import { candidatesHandlers } from './handlers/candidates';
import { assessmentsHandlers } from './handlers/assessments';

export const worker = setupWorker(...jobsHandlers, ...candidatesHandlers, ...assessmentsHandlers);

export async function setupWorkerIfNeeded() {
  // Only in browser
  if (typeof window === 'undefined') return;
  // start the worker
  await worker.start({ onUnhandledRequest: 'bypass' });
}
