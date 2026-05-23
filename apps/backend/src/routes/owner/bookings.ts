import { contractSchemas } from "../../generated/contractSchemas.js";
import type { RoutePlugin } from "../route-types.js";

export const ownerBookingsRoutes: RoutePlugin = async (app) => {
  app.get("/owner/bookings/upcoming", { schema: contractSchemas.OwnerApi_listUpcomingBookings }, async () =>
    app.calendarService.listUpcomingBookings(),
  );
};
