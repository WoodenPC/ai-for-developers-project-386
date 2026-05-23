import { contractSchemas } from "../../generated/contractSchemas.js";
import type { PublicCreateBookingRequest } from "../../types.js";
import type { RoutePlugin } from "../route-types.js";

export const publicBookingsRoutes: RoutePlugin = async (app) => {
  app.post<{ Body: PublicCreateBookingRequest }>(
    "/bookings",
    { schema: contractSchemas.Public_createBooking },
    async (request, reply) => {
      const booking = app.calendarService.createBooking(request.body);
      return reply.code(201).send(booking);
    },
  );
};
