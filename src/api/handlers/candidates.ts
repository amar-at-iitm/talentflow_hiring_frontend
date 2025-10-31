import { http, HttpResponse } from 'msw';
import { db } from '../../db';

function randomLatency() {
  return 200 + Math.floor(Math.random() * 1000);
}

export const candidatesHandlers = [
  http.get('/api/candidates', async ({ request }) => {
    await new Promise(r => setTimeout(r, randomLatency()));
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 20);
    let items = await db.candidates.toArray();
    if (stage) items = items.filter(c => c.stage === stage);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    const total = items.length;
    const slice = items.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ items: slice, total, page, pageSize });
  }),

  http.post('/api/candidates', async ({ request }) => {
    const body = await request.json() as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const id = crypto.randomUUID();
    const candidate = { id, name: body.name, email: body.email, jobId: body.jobId || null, stage: body.stage || 'applied', timeline: [{ at: Date.now(), to: 'applied' }] };
    await db.candidates.add(candidate);
    return HttpResponse.json(candidate, { status: 201 });
  }),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    const { id } = params as any;
    const body = await request.json() as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const existing = await db.candidates.get(id);
    if (!existing) return new HttpResponse(null, { status: 404 });
    const updated = { ...existing, ...body };
    if (body.stage && body.stage !== existing.stage) {
      updated.timeline = updated.timeline || [];
      updated.timeline.push({ at: Date.now(), from: existing.stage, to: body.stage });
    }
    await db.candidates.put(updated);
    return HttpResponse.json(updated);
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    const { id } = params as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const c = await db.candidates.get(id);
    if (!c) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ timeline: c.timeline || [] });
  })
];
