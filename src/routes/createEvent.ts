import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prima";
import { generateSlug } from "../utils/generateSlug";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/api/events",
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, response) => {
      const data = request.body;

      const slug = generateSlug(data.title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug: slug,
        },
      });

      if (eventWithSameSlug) {
        throw new Error("Event with same title already exists");
      }

      const event = await prisma.event.create({
        data: {
          title: data.title,
          details: data.details,
          maximumAttendees: data.maximumAttendees,
          slug: slug,
        },
      });

      return response.status(201).send({ eventId: event.id });
    }
  );
}
