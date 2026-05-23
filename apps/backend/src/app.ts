import Fastify from "fastify";
import ajvFormats from "ajv-formats";
import type { FastifyInstance } from "fastify";
import { ApiError, isApiError } from "./errors.js";
import type { ErrorCode } from "./errors.js";
import { calendarDependenciesPlugin } from "./plugins/calendar-dependencies.js";

export function createApp(): FastifyInstance {
  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
        removeAdditional: false,
      },
      plugins: [ajvFormats as never],
    },
    logger: false,
  }) as FastifyInstance;

  app.addHook("onRequest", async (_request, reply) => {
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
    reply.header("Access-Control-Allow-Origin", "*");
  });

  app.options("/*", async (_request, reply) => reply.code(204).send());

  app.setErrorHandler((error, request, reply) => {
    if (isApiError(error)) {
      return reply.code(error.statusCode).send(error.toResponse());
    }

    if (isValidationError(error)) {
      const code =
        request.method === "GET" && request.url.includes("/slots") ? "invalid_from_date" : inferValidationCode(request.url);
      const apiError = new ApiError(code);
      return reply.code(apiError.statusCode).send(apiError.toResponse());
    }

    request.log.error(error);
    return reply.code(500).send({
      code: "internal_error",
      message: "Internal server error.",
    });
  });

  app.register(calendarDependenciesPlugin);

  return app;
}

function inferValidationCode(url: string): ErrorCode {
  return url.startsWith("/bookings") ? "invalid_booking" : "invalid_event_type";
}

function isValidationError(error: unknown): error is { validation: unknown } {
  return typeof error === "object" && error !== null && "validation" in error;
}
