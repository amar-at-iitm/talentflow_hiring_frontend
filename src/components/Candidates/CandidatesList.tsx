import React, { useMemo, useState } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import { FixedSizeList as List } from 'react-window';
import CandidateProfile from './CandidateProfile';

export default function CandidatesList() {
  const [params, setParams] = useState({ page: 1, pageSize: 50, search: '', stage: '' });
  const { data, isLoading } = useCandidates();
  const [selected, setSelected] = useState<string | null>(null);

  const items = data?.items || [];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="flex gap-2 mb-3">
          <input placeholder="Search name/email" value={params.search} onChange={e => setParams({...params, search: e.target.value, page:1})} className="border p-2 rounded w-1/2"/>
          <select value={params.stage} onChange={e=> setParams({...params, stage: e.target.value})} className="border p-2 rounded">
            <option value="">All stages</option>
            <option value="applied">Applied</option>
            <option value="screen">Screen</option>
            <option value="tech">Tech</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <List
            height={700}
            itemCount={items.length}
            itemSize={72}
            width="100%"
          >
            {({ index, style }) => {
              const c = items[index];
              return (
                <div style={style} key={c.id} className="p-2">
                  <div onClick={() => setSelected(c.id)} className="bg-white p-3 rounded shadow flex justify-between cursor-pointer">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-slate-500">{c.email}</div>
                    </div>
                    <div className="text-sm px-2 py-1 rounded bg-slate-100">{c.stage}</div>
                  </div>
                </div>
              );
            }}
          </List>
        )}
      </div>

      <div className="col-span-1">
        {selected ? <CandidateProfile id={selected} /> : <div className="text-slate-500">Select a candidate</div>}
      </div>
    </div>
  );
}
