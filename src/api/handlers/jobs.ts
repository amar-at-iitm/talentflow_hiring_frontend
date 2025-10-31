import { http, HttpResponse } from 'msw';
import { db } from '../../db';


function randomLatency() {
  return 200 + Math.floor(Math.random() * 1000);
}



export const jobsHandlers = [
  http.get('/api/jobs', async ({ request }) => {
    await new Promise(r => setTimeout(r, randomLatency()));
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    let items = await db.jobs.orderBy('order').toArray();
    if (status) items = items.filter(j => j.status === status);
    if (search) items = items.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
    const total = items.length;
    const slice = items.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ items: slice, total, page, pageSize });
  }),

  http.post('/api/jobs', async ({ request }) => {
    const body = await request.json() as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const id = crypto.randomUUID();
    const job = { id, title: body.title, slug: body.slug, status: 'active' as const, tags: body.tags || [], order: body.order ?? Date.now() };
    await db.jobs.add(job);
    return HttpResponse.json(job, { status: 201 });
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    const { id } = params as any;
    const body = await request.json() as any;
    await new Promise(r => setTimeout(r, randomLatency()));
    const existing = await db.jobs.get(id);
    if (!existing) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const updated = { ...existing, ...body };
    await db.jobs.put(updated);
    return HttpResponse.json(updated);
  }),

  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    await new Promise(r => setTimeout(r, randomLatency()));
    // 7% chance of failure to test rollback
    if (Math.random() < 0.07) {
      return HttpResponse.json({ message: 'Simulated server reorder error' }, { status: 500 });
    }
    const { id } = params as any;
    const body = await request.json() as any;
    const { toIndex } = body;

    const jobs = await db.jobs.orderBy('order').toArray();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const [moving] = jobs.splice(idx, 1);
    jobs.splice(toIndex, 0, moving);
    for (let i = 0; i < jobs.length; i++) {
      jobs[i].order = i + 1;
      await db.jobs.put(jobs[i]);
    }
    return HttpResponse.json({ success: true });
  }),


  http.patch('/api/jobs/:id/reorder', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json();
    // your logic
    return HttpResponse.json({ success: true });
  })
  
  
];
