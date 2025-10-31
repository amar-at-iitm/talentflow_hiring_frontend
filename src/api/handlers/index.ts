import { jobsHandlers } from './jobs';
import { candidatesHandlers } from './candidates';
import { assessmentsHandlers } from './assessments';

export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers,
  ...assessmentsHandlers,
];