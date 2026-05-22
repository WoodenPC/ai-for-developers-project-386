import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(currentDir, "..");
const repoRoot = path.resolve(backendDir, "..", "..");
const openApiPath = path.join(repoRoot, "packages", "api-dto", "dist", "openapi", "openapi.yaml");
const mocksPath = path.join(backendDir, "prism", "mocks.json");
const outputPath = path.join(backendDir, "dist", "prism", "openapi.mock.yaml");

const openApi = YAML.parse(await readFile(openApiPath, "utf8"));
const mocks = JSON.parse(await readFile(mocksPath, "utf8"));

const operationsById = new Map();

for (const pathItem of Object.values(openApi.paths ?? {})) {
  for (const operation of Object.values(pathItem ?? {})) {
    if (operation && typeof operation === "object" && operation.operationId) {
      operationsById.set(operation.operationId, operation);
    }
  }
}

for (const [operationId, responses] of Object.entries(mocks)) {
  const operation = operationsById.get(operationId);

  if (!operation) {
    throw new Error(`Mock references unknown operationId: ${operationId}`);
  }

  for (const [statusCode, example] of Object.entries(responses)) {
    const response = operation.responses?.[statusCode];

    if (!response) {
      throw new Error(`Mock references unknown response ${operationId} ${statusCode}`);
    }

    response.content ??= {};
    response.content["application/json"] ??= {};
    response.content["application/json"].example = example;
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, YAML.stringify(openApi), "utf8");
