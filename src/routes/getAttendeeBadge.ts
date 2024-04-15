import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prima";
import { BadRequest } from "./_errors/badRequest";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/api/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, response) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      if (attendee === null) {
        throw new BadRequest("Attendee not found");
      }

      const baseUrl = `${request.protocol}://${request.hostname}`;
      const checkInUrl = new URL(
        `/api/attendees/${attendeeId}/checkIn`,
        baseUrl
      );

      return response.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString(),
        },
      });
    }
  );
}
