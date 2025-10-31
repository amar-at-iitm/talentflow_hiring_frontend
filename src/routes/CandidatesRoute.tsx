import React from 'react';
import CandidatesList from '../components/Candidates/CandidatesList';

export default function CandidatesRoute() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
      <CandidatesList />
    </div>
  );
}

