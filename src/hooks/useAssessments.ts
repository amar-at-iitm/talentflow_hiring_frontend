import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAssessment(jobId: string) {
  return useQuery({
    queryKey: ['assessment', jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const res = await fetch(`/api/assessments/${jobId}`);
      if (!res.ok) throw new Error('Failed to fetch assessment');
      return res.json();
    },
  });
}

export function useSaveAssessment(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save assessment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', jobId] });
    },
  });
}

export function useSubmitAssessment(jobId: string) {
  return useMutation({
    mutationFn: async (data: { candidateId: string; response: any }) => {
      const res = await fetch(`/api/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit assessment');
      return res.json();
    },
  });
}
