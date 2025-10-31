import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await fetch('/api/candidates');
      if (!res.ok) throw new Error('Failed to fetch candidates');
      return res.json();
    },
  });
}

export function useUpdateCandidateStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; stage: string }) =>
      axios.patch(`/api/candidates/${payload.id}`, { stage: payload.stage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidates'] }),
  });
}

export function useMoveCandidateStage() {
  const qc = useQueryClient();
  return useMutation((payload:{ id:string; stage:string }) => axios.patch(`/api/candidates/${payload.id}`, { stage: payload.stage }), {
    onMutate: async (variables) => {
      await qc.cancelQueries(['candidates']);
      const prev = qc.getQueryData(['candidates']);
      qc.setQueryData(['candidates'], (old:any) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        const items = copy.items;
        const idx = items.findIndex((i:any) => i.id === variables.id);
        if (idx !== -1) items[idx].stage = variables.stage;
        return copy;
      });
      return { prev };
    },
    onError: (err, varz, ctx:any) => {
      if (ctx?.prev) qc.setQueryData(['candidates'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries(['candidates'])
  });
}
export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation((payload: { name: string; email: string; jobId?: string }) => axios.post('/api/candidates', payload), {
    onSuccess: () => qc.invalidateQueries(['candidates'])
  });
}