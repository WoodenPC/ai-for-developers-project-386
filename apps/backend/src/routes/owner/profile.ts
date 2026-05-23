import { contractSchemas } from "../../generated/contractSchemas.js";
import type { RoutePlugin } from "../routeTypes.js";

export const ownerProfileRoutes: RoutePlugin = async (app) => {
  app.get("/owner", { schema: contractSchemas.OwnerApi_getOwner }, async () => app.calendarService.getOwner());
};
