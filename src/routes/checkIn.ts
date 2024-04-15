import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prima";
import { BadRequest } from "./_errors/badRequest";

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/api/attendees/:attendeeId/checkIn",
    {
      schema: {
        summary: "Check-in an event",
        tags: ["check-ins"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, response) => {
      const { attendeeId } = request.params;

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId: attendeeId,
        },
      });
      if (attendeeCheckIn !== null) {
        throw new BadRequest("Attendee already checked in");
      }

      await prisma.checkIn.create({
        data: {
          attendeeId: attendeeId,
        },
      });
      return response.status(201).send();
    }
  );
}
