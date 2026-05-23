import type { PublicCreateBookingRequest } from "../../types.js";
import { contractSchemas } from "../../generated/contractSchemas.js";
import { parseEventTypeId } from "../params.js";
import type { RoutePlugin } from "../route-types.js";

export const publicEventTypesRoutes: RoutePlugin = async (app) => {
  app.get("/event-types", { schema: contractSchemas.Public_listEventTypes }, async () =>
    app.calendarService.listEventTypes(),
  );

  app.get<{ Params: { eventTypeId: string } }>(
    "/event-types/:eventTypeId",
    { schema: contractSchemas.Public_getEventType },
    async (request) => app.calendarService.getEventType(parseEventTypeId(request.params)),
  );

  app.get<{ Params: { eventTypeId: string }; Querystring: { fromDate: string } }>(
    "/event-types/:eventTypeId/slots",
    { schema: contractSchemas.Public_listSlots },
    async (request) => app.calendarService.listSlots(parseEventTypeId(request.params), request.query.fromDate),
  );
};

export type CreateBookingBody = PublicCreateBookingRequest;
