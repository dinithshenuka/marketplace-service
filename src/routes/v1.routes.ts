import type { Express } from "express";
import { openAPIRouter } from "@/modules/api-docs/openAPI.route";
import { authRouter } from "@/modules/auth/auth.route";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.route";
import { userRouter } from "@/modules/user/user.route";

export function setupV1Routes(app: Express): void {
	// V1 API Routes
	app.use("/api/v1/health-check", healthCheckRouter);
	app.use("/api/v1/api-docs", openAPIRouter);
	app.use("/api/v1/users", userRouter);
	app.use("/api/v1/auth", authRouter);
}
