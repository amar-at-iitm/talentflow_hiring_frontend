// src/hooks/useJobs.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const fetchJobs = async ({ queryKey }) => {
  const [_key, { page = 1, pageSize = 10, search = "", status = "", sort = "" }] = queryKey;
  const params = { page, pageSize };
  if (search) params.search = search;
  if (status) params.status = status;
  if (sort) params.sort = sort;
  const res = await axios.get("/api/jobs", { params });
  return res.data; // { jobs, meta }
};

export function useJobs(params = { page:1, pageSize:10, search:'', status:'' }) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => (await axios.get('/api/jobs', { params })).data,
    keepPreviousData: true,
  });
}

// CREATE JOB
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (job) => axios.post("/api/jobs", job).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

// PATCH JOB
export function usePatchJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => axios.patch(`/api/jobs/${id}`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

// REORDER JOB (optimistic update + rollback)
export function useReorderJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; toIndex: number }) =>
      (await axios.patch(`/api/jobs/${payload.id}/reorder`, { toIndex: payload.toIndex })).data,
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: ['jobs'] });
      const previous = qc.getQueryData(['jobs']);
      qc.setQueryData(['jobs'], (old:any) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        const items = copy.items;
        const idx = items.findIndex((i:any) => i.id === variables.id);
        if (idx === -1) return old;
        const [moved] = items.splice(idx, 1);
        items.splice(variables.toIndex, 0, moved);
        items.forEach((it:any, i:number)=> it.order = i+1);
        copy.items = items;
        return copy;
      });
      return { previous };
    },
    onError: (err, variables, context:any) => {
      if (context?.previous) qc.setQueryData(['jobs'], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['jobs'] })
  });
}