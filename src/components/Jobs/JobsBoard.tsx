import React, { useState } from 'react';
import { useJobs, useCreateJob, useReorderJob } from '../../hooks/useJobs';
import JobCard from './JobCard';
import JobForm from './JobForm';
import { DragEndEvent, DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

export default function JobsBoard() {
  const [params, setParams] = useState({ page: 1, pageSize: 10, search: '', status: '' });
  const { data, isLoading } = useJobs(params);
  const create = useCreateJob();
  const reorderMut = useReorderJob();
  const [showForm, setShowForm] = useState(false);

  const handleReorder = (event: DragEndEvent) => {
    // dnd kit sortable returns indexes normally; this is a placeholder: just call API with toIndex
    // in the actual sortable items you'd compute from active/id and over/index
    // Here we keep it simple and assume client reorders UI and we call toIndex
    const activeId = (event.active?.id as string | undefined);
    const overId = (event.over?.id as string | undefined);
    if (!activeId || !overId || !data) return;
    const fromIndex = data?.items?.findIndex((i:any) => i.id === activeId);
    const toIndex = data.items.findIndex((i:any) => i.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;
    // optimistic reorder is handled in useReorderJob
    reorderMut.mutate({ id: activeId, toIndex });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <input placeholder="Search title" className="border p-2 rounded" value={params.search} onChange={e => setParams({...params, search: e.target.value, page:1})}/>
          <select value={params.status} onChange={e => setParams({...params, status: e.target.value})} className="border p-2 rounded">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Create job</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading && <div>Loading...</div>}
        {!isLoading && data?.items?.map((job:any) => <JobCard key={job.id} job={job} />)}
      </div>

      {showForm && <JobForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
