import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { env } from "@/common/utils/envConfig";

// Import all registries from the central registry index
import * as registries from "./registries";

// Auto-collect all registries from the index
const apiRegistries = Object.values(registries).filter(
	(registry): registry is OpenAPIRegistry => registry instanceof OpenAPIRegistry,
);

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry(apiRegistries);

	// Register JWT security scheme
	registry.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
	});

	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		servers: [
			{
				url: env.BASE_URL,
			},
		],
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/api/v1/api-docs/swagger.json",
		},
	});
}
