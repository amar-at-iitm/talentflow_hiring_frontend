// src/components/JobsList.jsx
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import JobItem from "./JobItem";

function SortableItem({ job, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: String(job.id)});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobItem job={job} />
    </div>
  );
}

export default function JobsList({ jobs = [], loading, onEdit, reorderMutation, patchJob }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // compute fromOrder and toOrder based on current list
    const fromIndex = jobs.findIndex(j => String(j.id) === String(active.id));
    const toIndex = jobs.findIndex(j => String(j.id) === String(over.id));
    const fromOrder = jobs[fromIndex].order;
    const toOrder = toIndex + 1; // orders are 1-based
    // call mutation
    reorderMutation.mutate({ id: active.id, fromOrder, toOrder });
  };

  if (loading) return <div>Loading jobs...</div>;
  if (!jobs.length) return <div>No jobs</div>;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={jobs.map(j=>String(j.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {jobs.slice().sort((a,b)=>a.order-b.order).map((job, idx) => (
            <SortableItem key={job.id} job={job} index={idx} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
