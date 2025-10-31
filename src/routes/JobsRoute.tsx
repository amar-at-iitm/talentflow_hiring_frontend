
import React, { useState } from 'react';
import JobsBoard from '../components/Jobs/JobsBoard';

export default function JobsRoute() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
      <JobsBoard />
    </div>
  );
}
