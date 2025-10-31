import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateJob } from '../../hooks/useJobs';
import { slugify } from '../../utils/slugify';
import { db } from "../../db";

export async function isSlugUnique(slug: string, excludeId?: string) {
  const found = await db.jobs.where('slug').equals(slug).first();
  return !found || found.id === excludeId;
}

export default function JobForm({ onClose }: { onClose: () => void }) {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { title: '', tags: '' } });
  const create = useCreateJob();
  const title = watch('title');

  const onSubmit = (data:any) => {
    const job = {
      title: data.title,
      slug: slugify(data.title),
      tags: data.tags ? data.tags.split(',').map((s:string)=>s.trim()) : []
    };
    create.mutate(undefined, { 
      onSuccess: () => onClose(),
      variables: job 
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow w-[480px]">
        <h3 className="text-lg font-semibold mb-3">Create job</h3>
        <div className="mb-3">
          <label className="block text-sm">Title</label>
          <input {...register('title', { required: true })} className="border p-2 w-full rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-sm">Tags (comma separated)</label>
          <input {...register('tags')} className="border p-2 w-full rounded" />
        </div>
        <div className="mb-4 text-sm text-slate-500">Slug: {slugify(title || '')}</div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">Create</button>
        </div>
      </form>
    </div>
  );
}
