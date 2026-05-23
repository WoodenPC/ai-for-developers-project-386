import type { FastifyPluginAsync } from "fastify";
import { createDefaultRepository } from "../repositories/create-repository.js";
import type { CalendarRepository } from "../repositories/calendar-repository.js";
import { BookingScheduleService } from "../services/booking-schedule-service.js";
import { CalendarService } from "../services/calendar-service.js";
import { registerRoutes } from "../routes/register-routes.js";

declare module "fastify" {
  interface FastifyInstance {
    calendarRepository: CalendarRepository;
    calendarService: CalendarService;
    bookingScheduleService: BookingScheduleService;
  }
}

export const calendarDependenciesPlugin: FastifyPluginAsync = async (app) => {
  app.decorate("calendarRepository", createDefaultRepository());
  app.decorate("bookingScheduleService", new BookingScheduleService());
  app.decorate("calendarService", new CalendarService(app.calendarRepository, app.bookingScheduleService));

  registerRoutes(app);
};
