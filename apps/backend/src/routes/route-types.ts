import type { FastifyInstance } from "fastify";

export type RoutePlugin = (app: FastifyInstance) => Promise<void>;
