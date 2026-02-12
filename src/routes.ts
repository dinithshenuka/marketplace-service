import type { Express } from "express";
import { openAPIRouter } from "@/modules/api-docs/openAPI.route";
import { authRegistry, authRouter } from "@/modules/auth/auth.route";
import { healthCheckRegistry, healthCheckRouter } from "@/modules/healthCheck/healthCheck.route";
import { userRegistry, userRouter } from "@/modules/user/user.route";

export const apiRegistries = [healthCheckRegistry, userRegistry, authRegistry];

export function setupRoutes(app: Express): void {
	// Routes
	app.use("/health-check", healthCheckRouter);
	app.use("/api-docs", openAPIRouter);
	app.use("/users", userRouter);
	app.use("/auth", authRouter);
}
