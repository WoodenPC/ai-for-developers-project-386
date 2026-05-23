import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(currentDir, "..");
const repoRoot = path.resolve(backendDir, "..", "..");
const openApiPath = path.join(repoRoot, "packages", "api-dto", "dist", "openapi", "openapi.yaml");
const outputPath = path.join(backendDir, "src", "generated", "contractSchemas.ts");

const implementedOperationIds = [
  "OwnerApi_getOwner",
  "OwnerApi_listEventTypes",
  "OwnerApi_getEventType",
  "OwnerApi_createEventType",
  "OwnerApi_updateEventType",
  "OwnerApi_listUpcomingBookings",
  "Public_listEventTypes",
  "Public_getEventType",
  "Public_listSlots",
  "Public_createBooking",
];

const openApi = YAML.parse(await readFile(openApiPath, "utf8"));
const operationsById = new Map();

for (const pathItem of Object.values(openApi.paths ?? {})) {
  for (const operation of Object.values(pathItem ?? {})) {
    if (operation && typeof operation === "object" && operation.operationId) {
      operationsById.set(operation.operationId, operation);
    }
  }
}

const contractSchemas = Object.fromEntries(
  implementedOperationIds.map((operationId) => [operationId, buildFastifySchema(operationId)]),
);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `/* eslint-disable */\n` +
    `// This file is generated from packages/api-dto/dist/openapi/openapi.yaml.\n` +
    `// Run pnpm --filter @calls-calendar/backend generate:contract-schemas to update it.\n\n` +
    `export const contractSchemas = ${JSON.stringify(contractSchemas, null, 2)} as const;\n\n` +
    `export type ContractOperationId = keyof typeof contractSchemas;\n`,
  "utf8",
);

function buildFastifySchema(operationId) {
  const operation = operationsById.get(operationId);

  if (!operation) {
    throw new Error(`OpenAPI document does not include operationId: ${operationId}`);
  }

  const schema = {};
  const querystring = buildQuerystringSchema(operation.parameters ?? []);
  const body = buildRequestBodySchema(operation.requestBody);
  const responses = buildResponseSchemas(operation.responses ?? {});

  if (querystring) {
    schema.querystring = querystring;
  }

  if (body) {
    schema.body = body;
  }

  if (Object.keys(responses).length > 0) {
    schema.response = responses;
  }

  return schema;
}

function buildQuerystringSchema(parameters) {
  const queryParameters = parameters.filter((parameter) => parameter.in === "query");

  if (queryParameters.length === 0) {
    return undefined;
  }

  const properties = {};
  const required = [];

  for (const parameter of queryParameters) {
    properties[parameter.name] = normalizeSchema(parameter.schema ?? {});

    if (parameter.required) {
      required.push(parameter.name);
    }
  }

  return {
    additionalProperties: false,
    properties,
    required,
    type: "object",
  };
}

function buildRequestBodySchema(requestBody) {
  const jsonSchema = requestBody?.content?.["application/json"]?.schema;
  return jsonSchema ? normalizeSchema(jsonSchema) : undefined;
}

function buildResponseSchemas(responses) {
  const result = {};

  for (const [statusCode, response] of Object.entries(responses)) {
    const jsonSchema = response?.content?.["application/json"]?.schema;

    if (jsonSchema) {
      result[statusCode] = normalizeSchema(jsonSchema);
    }
  }

  return result;
}

function normalizeSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  if (schema.$ref) {
    return normalizeSchema(resolveRef(schema.$ref));
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => normalizeSchema(item));
  }

  const result = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === "description" && typeof value === "string") {
      continue;
    }

    if (key === "format" && schema.type === "integer") {
      continue;
    }

    if (key === "nullable") {
      continue;
    }

    result[key] = normalizeSchema(value);
  }

  if (schema.nullable) {
    result.type = Array.isArray(result.type) ? [...result.type, "null"] : [result.type ?? "object", "null"];
  }

  return result;
}

function resolveRef(ref) {
  if (!ref.startsWith("#/")) {
    throw new Error(`Unsupported OpenAPI ref: ${ref}`);
  }

  const pathParts = ref
    .slice(2)
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
  let current = openApi;

  for (const part of pathParts) {
    current = current?.[part];
  }

  if (!current) {
    throw new Error(`OpenAPI ref not found: ${ref}`);
  }

  return current;
}
