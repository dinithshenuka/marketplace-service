import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/modules/api-docs/openAPIResponseBuilders";
import { authController } from "@/modules/auth/auth.controller";
import { AuthUserSchema, LoginDtoSchema, RegisterDtoSchema } from "@/modules/auth/auth.dto";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

// Login
authRegistry.registerPath({
	method: "post",
	path: "/api/v1/auth/login",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: LoginDtoSchema,
				},
			},
		},
	},
	responses: createApiResponse(z.object({ token: z.string(), user: AuthUserSchema }), "Success"),
});

authRouter.post("/login", validateRequest(LoginDtoSchema), authController.login.bind(authController));

// Register
authRegistry.registerPath({
	method: "post",
	path: "/api/v1/auth/register",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: RegisterDtoSchema,
				},
			},
		},
	},
	responses: createApiResponse(z.object({ token: z.string(), user: AuthUserSchema }), "Success"),
});

authRouter.post("/register", validateRequest(RegisterDtoSchema), authController.register.bind(authController));
