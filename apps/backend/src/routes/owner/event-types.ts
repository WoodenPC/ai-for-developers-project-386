import { contractSchemas } from "../../generated/contractSchemas.js";
import type { OwnerApiCreateEventTypeRequest, OwnerApiUpdateEventTypeRequest } from "../../types.js";
import { parseEventTypeId } from "../params.js";
import type { RoutePlugin } from "../route-types.js";

export const ownerEventTypesRoutes: RoutePlugin = async (app) => {
  app.get("/owner/event-types", { schema: contractSchemas.OwnerApi_listEventTypes }, async () =>
    app.calendarService.listEventTypes(),
  );

  app.get<{ Params: { eventTypeId: string } }>(
    "/owner/event-types/:eventTypeId",
    { schema: contractSchemas.OwnerApi_getEventType },
    async (request) => app.calendarService.getEventType(parseEventTypeId(request.params)),
  );

  app.post<{ Body: OwnerApiCreateEventTypeRequest }>(
    "/owner/event-types",
    { schema: contractSchemas.OwnerApi_createEventType },
    async (request, reply) => {
      const eventType = app.calendarService.createEventType(request.body);
      return reply.code(201).send(eventType);
    },
  );

  app.put<{ Body: OwnerApiUpdateEventTypeRequest; Params: { eventTypeId: string } }>(
    "/owner/event-types/:eventTypeId",
    { schema: contractSchemas.OwnerApi_updateEventType },
    async (request) => app.calendarService.updateEventType(parseEventTypeId(request.params), request.body),
  );
};
