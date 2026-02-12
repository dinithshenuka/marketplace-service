import type { Express } from "express";
import { setupV1Routes } from "@/routes/v1.routes";

export function setupRoutes(app: Express): void {
	// V1 API Routes
	setupV1Routes(app);
}
