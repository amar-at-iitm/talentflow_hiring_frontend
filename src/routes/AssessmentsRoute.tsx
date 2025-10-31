import React from 'react';
import AssessmentBuilder from '../components/Assessments/AssessmentBuilder';

export default function AssessmentsRoute() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Assessments</h2>
      <AssessmentBuilder />
    </div>
  );
}
