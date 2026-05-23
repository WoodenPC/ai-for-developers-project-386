import type { FastifyInstance } from "fastify";
import { ownerBookingsRoutes } from "./owner/bookings.js";
import { ownerEventTypesRoutes } from "./owner/event-types.js";
import { ownerProfileRoutes } from "./owner/profile.js";
import { publicBookingsRoutes } from "./public/bookings.js";
import { publicEventTypesRoutes } from "./public/event-types.js";

export function registerRoutes(app: FastifyInstance) {
  app.register(ownerProfileRoutes);
  app.register(ownerEventTypesRoutes);
  app.register(ownerBookingsRoutes);
  app.register(publicEventTypesRoutes);
  app.register(publicBookingsRoutes);
}
