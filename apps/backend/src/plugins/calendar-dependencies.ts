import type { FastifyPluginAsync } from "fastify";
import { createDefaultRepository } from "../repositories/create-repository.js";
import type { CalendarRepository } from "../repositories/calendar-repository.js";
import { CalendarService } from "../services/calendar-service.js";
import { registerRoutes } from "../routes/register-routes.js";

type Clock = () => Date;

interface CalendarDependenciesOptions {
  clock?: Clock;
}

declare module "fastify" {
  interface FastifyInstance {
    calendarRepository: CalendarRepository;
    calendarService: CalendarService;
  }
}

export const calendarDependenciesPlugin: FastifyPluginAsync<CalendarDependenciesOptions> = async (app, { clock }) => {
  app.decorate("calendarRepository", createDefaultRepository());
  app.decorate("calendarService", new CalendarService(app.calendarRepository, clock));

  registerRoutes(app);
};
