// 🔄 AUTO-UPDATE: Registry Index
// When you create a new module with routes, add its registry import here
// This file centralizes all OpenAPI registries for easy management

export { authRegistry } from "@/modules/auth/auth.route";
export { healthCheckRegistry } from "@/modules/healthCheck/healthCheck.route";
export { userRegistry } from "@/modules/user/user.route";

// Add new module registries here:
// export { newModuleRegistry } from "@/modules/newModule/newModule.route";
