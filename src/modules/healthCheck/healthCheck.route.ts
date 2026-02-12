import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { createApiResponse } from "@/modules/api-docs/openAPIResponseBuilders";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
	method: "get",
	path: "/api/v1/health-check",
	tags: ["Health Check"],
	responses: createApiResponse(z.null(), "Success"),
});

healthCheckRouter.get("/", (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success("Service is healthy", null);
	res.status(serviceResponse.statusCode).send(serviceResponse);
});
