import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CandidateProfile({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async function() {
      const res = await axios.get(`/api/candidates?search=&page=1&pageSize=1000`);
      const candidate = res.data.items.find((c:any)=>c.id === id);
      if (mounted) setData(candidate);
      const tl = await axios.get(`/api/candidates/${id}/timeline`);
      if (mounted) setTimeline(tl.data.timeline || []);
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!data) return <div>Loading candidate...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{data.name}</h3>
      <div className="text-sm text-slate-500 mb-3">{data.email}</div>

      <div className="mb-3">
        <div className="font-medium">Current stage</div>
        <div className="text-sm">{data.stage}</div>
      </div>

      <div>
        <div className="font-medium mb-2">Timeline</div>
        <div className="space-y-2">
          {timeline.map((t:any, i:number) => (
            <div key={i} className="text-sm p-2 border rounded">
              <div className="text-slate-500 text-xs">{new Date(t.at).toLocaleString()}</div>
              <div>{t.from ? `${t.from} → ${t.to}` : `${t.to}`}</div>
              {t.note && <div className="text-slate-600 text-sm">{t.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
