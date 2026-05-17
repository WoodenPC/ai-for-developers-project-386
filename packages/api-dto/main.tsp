import "@typespec/http";
import "@typespec/openapi3";

import "./models.tsp";
import "./operations/common.tsp";
import "./operations/public.tsp";
import "./operations/owner.tsp";

using TypeSpec.Http;

@service(#{
  title: "Calls Calendar API",
})
@server("http://localhost:3000", "Local development server")
namespace CallsCalendar;
