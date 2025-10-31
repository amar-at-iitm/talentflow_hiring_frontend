import React from 'react';
import { Job } from '../../db';

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm flex items-center justify-between">
      <div>
        <div className="font-semibold">{job.title}</div>
        <div className="text-sm text-slate-500">{job.slug} • {job.tags?.join(', ')}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm px-2 py-1 rounded bg-slate-100">{job.status}</div>
      </div>
    </div>
  );
}
