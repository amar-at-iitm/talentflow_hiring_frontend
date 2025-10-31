import { http, HttpResponse } from 'msw';
import { db } from '../../db';

function randomLatency() {
  return 200 + Math.floor(Math.random() * 1000);
}

export const assessmentsHandlers = [
  http.get('/api/assessments/:jobId', async ({ params }) => {
    const { jobId } = params as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const a = await db.assessments.get(jobId);
    if (!a) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(a);
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    const { jobId } = params as any;
    const body = await request.json() as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    // create or update
    const existing = await db.assessments.get(jobId);
    if (existing) {
      const updated = { ...existing, builderState: body.builderState };
      await db.assessments.put(updated);
      return HttpResponse.json(updated);
    } else {
      const newA = { jobId, builderState: body.builderState, submissions: {} };
      await db.assessments.add(newA);
      return HttpResponse.json(newA, { status: 201 });
    }
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    const { jobId } = params as any;
    const body = await request.json() as any; // { candidateId, response }
    await new Promise(r => setTimeout(r, randomLatency()));
    const existing = await db.assessments.get(jobId);
    if (!existing) return new HttpResponse(null, { status: 404 });
    existing.submissions = existing.submissions || {};
    existing.submissions[body.candidateId] = body.response;
    await db.assessments.put(existing);
    return HttpResponse.json({ success: true });
  })
];
