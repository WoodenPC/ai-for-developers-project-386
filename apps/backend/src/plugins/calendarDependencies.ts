import type { FastifyPluginAsync } from "fastify";
import { createDefaultRepository } from "../repositories/createRepository.js";
import type { CalendarRepository } from "../repositories/calendarRepository.js";
import { CalendarService } from "../services/calendarService.js";
import { registerRoutes } from "../routes/registerRoutes.js";

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
