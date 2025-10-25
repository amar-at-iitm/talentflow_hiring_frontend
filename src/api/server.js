import { createServer, Model, Factory, Response } from "miragejs";
import { faker } from "@faker-js/faker";

export function makeServer() {
  let server = createServer({
    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
    },

    factories: {
      job: Factory.extend({
        title() {
          return faker.person.jobTitle();
        },
        slug(i) {
          return `job-${i + 1}`;
        },
        status() {
          return faker.helpers.arrayElement(["active", "archived"]);
        },
        tags() {
          return faker.helpers.arrayElements(
            ["remote", "urgent", "full-time", "internship", "contract"],
            2
          );
        },
        order(i) {
          return i + 1;
        },
      }),
    },

    seeds(server) {
      // create 25 jobs
      server.createList("job", 25);
    },

    routes() {
      this.namespace = "api";
      this.timing = faker.number.int({ min: 200, max: 1200 }); // simulate latency

      // GET /jobs
      this.get("/jobs", (schema, request) => {
        let { search, status } = request.queryParams;
        let jobs = schema.jobs.all().models;

        if (status) {
          jobs = jobs.filter((job) => job.status === status);
        }
        if (search) {
          jobs = jobs.filter((job) =>
            job.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        return jobs;
      });

      // POST /jobs
      this.post("/jobs", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = faker.string.uuid();
        return schema.jobs.create(attrs);
      });

      // PATCH /jobs/:id
      this.patch("/jobs/:id", (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const job = schema.jobs.find(id);
        return job.update(newAttrs);
      });

      // PATCH /jobs/:id/reorder
      this.patch("/jobs/:id/reorder", (schema, request) => {
        if (Math.random() < 0.1) {
          return new Response(500, {}, { error: "Simulated reorder error" });
        }
        const { fromOrder, toOrder } = JSON.parse(request.requestBody);
        const job = schema.jobs.find(request.params.id);
        job.update({ order: toOrder });
        return { success: true };
      });
    },
  });

  return server;
}
