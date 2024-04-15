import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/createEvent";
import { registerForEvent } from "./routes/registerForEvent";
import { getEvent } from "./routes/getEvent";
import { getAttendeeBadge } from "./routes/getAttendeeBadge";
import { checkIn } from "./routes/checkIn";
import { getEventAttendees } from "./routes/getEventAttendees";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./errorHandler";
import fastifyCors from "@fastify/cors";

const app = fastify({
  // logger: true,
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description:
        "Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP server running!");
  });
