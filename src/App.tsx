import React from 'react';
import { Navigate } from "react-router-dom";
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './routes/HomePage';
import JobsRoute from './routes/JobsRoute';
import CandidatesRoute from './routes/CandidatesRoute';
import AssessmentsRoute from './routes/AssessmentsRoute';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NotFound from './routes/NotFound';

export default function App() {
  return (
    <div>
      <header className="bg-white shadow">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Talentflow</h1>
          <nav className="space-x-4">
            <Link to="/jobs" className="text-slate-600 hover:text-slate-900">Jobs</Link>
            <Link to="/candidates" className="text-slate-600 hover:text-slate-900">Candidates</Link>
            <Link to="/assessments" className="text-slate-600 hover:text-slate-900">Assessments</Link>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsRoute />} />
          <Route path="/candidates" element={<CandidatesRoute />} />
          <Route path="/assessments" element={<AssessmentsRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </main>

      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
