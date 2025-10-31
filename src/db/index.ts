import Dexie from 'dexie';

export type JobStatus = 'active' | 'archived';
export interface Job {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  tags: string[];
  order: number;
}

export type CandidateStage = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId?: string | null;
  stage: CandidateStage;
  timeline?: Array<{ at: number; from?: string; to?: string; note?: string }>;
  notes?: Array<{ id: string; text: string; at: number; mentions?: string[] }>;
}

export interface Assessment {
  jobId: string;
  builderState: any;
  submissions: Record<string, any>;
}

class AppDB extends Dexie {
  jobs!: Dexie.Table<Job, string>;
  candidates!: Dexie.Table<Candidate, string>;
  assessments!: Dexie.Table<Assessment, string>;

  constructor() {
    super('talentflowDB');
    this.version(1).stores({
      jobs: 'id,slug,order,status',
      candidates: 'id,name,email,stage,jobId',
      assessments: 'jobId'
    });

    this.jobs = this.table('jobs');
    this.candidates = this.table('candidates');
    this.assessments = this.table('assessments');
  }
}

export const db = new AppDB();
