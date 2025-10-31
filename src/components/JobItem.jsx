// src/components/JobItem.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function JobItem({ job }) {
  return (
    <div className="p-3 border rounded flex items-center justify-between bg-white">
      <div>
        <Link to={`/jobs/${job.id}`} className="font-semibold">{job.title}</Link>
        <div className="text-sm text-gray-500">{job.slug} • {job.tags?.join(", ")}</div>
      </div>
      <div className="flex gap-2 items-center">
        <div className={`text-sm ${job.status==="archived" ? "text-red-500":"text-green-600"}`}>{job.status}</div>
      </div>
    </div>
  );
}
