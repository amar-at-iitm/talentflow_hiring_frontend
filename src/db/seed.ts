import { db } from './index';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

export async function seedIfEmpty() {
  const cnt = await db.jobs.count();
  if (cnt > 0) return;

  // create 25 jobs
  const jobs = Array.from({ length: 25 }).map((_, i) => ({
    id: crypto.randomUUID(),
    title: `Job ${i + 1}`,
    slug: `job-${i + 1}`,
    status: (i % 2 ? "active" : "archived") as "active" | "archived",
    tags: ["frontend", "react"],
    order: i,
  }));
  
  await db.jobs.bulkAdd(jobs);

  // create 1000 candidates, assigned randomly to jobs and stages
  const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;
  const candidates = Array.from({ length: 1000 }).map(() => {
    const job = faker.helpers.arrayElement(jobs);
    return {
      id: uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      jobId: Math.random() < 0.7 ? job.id : null,
      stage: faker.helpers.arrayElement(stages) as any,
      timeline: [{ at: Date.now(), to: 'applied' }]
    };
  });
  await db.candidates.bulkAdd(candidates);

  // create at least 3 assessments with 10+ questions each
  for (let i = 0; i < 3; i++) {
    const job = faker.helpers.arrayElement(jobs);
    const questions = Array.from({ length: 12 }).map((_, qIdx) => ({
      id: `q${qIdx + 1}`,
      type: faker.helpers.arrayElement(['single', 'multi', 'short', 'long', 'numeric', 'file']),
      title: faker.lorem.sentence(),
      required: Math.random() < 0.7,
      meta: {}
    }));
    await db.assessments.add({ jobId: job.id, builderState: { title: `Assessment for ${job.title}`, questions }, submissions: {} });
  }
}
