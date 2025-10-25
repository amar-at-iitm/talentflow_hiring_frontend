// import React from "react";

// export default function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
//         Tailwind is Working 
//       </button>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

export default function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then(setJobs)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MirageJS API Test</h1>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="p-3 border rounded-md">
            {job.title} — <span className="text-gray-500">{job.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
