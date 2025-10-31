// Synchronize MSW mock changes with Dexie (optional)
import { db } from "./index";


export async function syncJobUpdate(job: any) {
  await db.jobs.put(job);
}

export async function syncCandidateUpdate(candidate: any) {
  await db.candidates.put(candidate);
}
