// import { StatusCodes } from "http-status-codes";
// import jwt from "jsonwebtoken";
// import request from "supertest";

// import type { ServiceResponse } from "@/common/models/serviceResponse";
// import { pool } from "@/database/pgConnection";
// import type { User } from "@/modules/user/user.model";
// import { app } from "@/server";

// const generateTestToken = (userId: number = 1): string => {
// 	return jwt.sign({ id: userId, email: "test@example.com" }, "your-secret-key", { expiresIn: "1h" });
// };

// describe("User API endp,oints", () => {
// 	beforeEach(async () => {
// 		// Clean up the database before each test
// 		await pool.query("DELETE FROM users");
// 	});

// 	describe("GET /users", () => {
// 		it("should return user when user exists", async () => {
// 			// Create a user first
// 			const userData = {
// 				name: "Test User",
// 				email: "test@example.com",
// 				password: "password123",
// 			};
// 			await request(app).post("/users").send(userData);

// 			const token = generateTestToken();
// 			const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse<User[]> = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.OK);
// 			expect(result.success).toBeTruthy();
// 			expect(result.responseObject).toHaveLength(1);
// 			expect(result.responseObject?.[0]).toMatchObject({
// 				name: userData.name,
// 				email: userData.email,
// 			});
// 			expect(result.message).toEqual("Users retrieved successfully");
// 		});
// 	});

// 	describe("POST /users", () => {
// 		it("should create a new user", async () => {
// 			const userData = {
// 				name: "John Doe",
// 				email: "john.doe@example.com",
// 				password: "password123",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse<User> = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.CREATED);
// 			expect(result.success).toBeTruthy();
// 			expect(result.responseObject).toMatchObject({
// 				name: userData.name,
// 				email: userData.email,
// 			});
// 			expect(result.responseObject?.id).toBeDefined();
// 			expect(result.responseObject?.password).toBeUndefined();
// 			expect(result.message).toEqual("User created successfully");
// 		});

// 		it("should return validation error for invalid email", async () => {
// 			const userData = {
// 				name: "John Doe",
// 				email: "invalid-email",
// 				password: "password123",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 			expect(result.message).toContain("Invalid email");
// 		});

// 		it("should return validation error for missing name", async () => {
// 			const userData = {
// 				email: "john.doe@example.com",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 			expect(result.message).toContain("expected string");
// 		});
// 	});

// 	describe("GET /users/:id", () => {
// 		it("should return user by id", async () => {
// 			// First create a user
// 			const userData = {
// 				name: "Jane Doe",
// 				email: "jane.doe@example.com",
// 			};

// 			const createResponse = await request(app).post("/users").send(userData);
// 			const createdUser: User = createResponse.body.responseObject;

// 			// Then get the user by id
// 			const token = generateTestToken();
// 			const response = await request(app).get(`/users/${createdUser.id}`).set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse<User> = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.OK);
// 			expect(result.success).toBeTruthy();
// 			expect(result.responseObject).toMatchObject(userData);
// 			expect(result.message).toEqual("User retrieved successfully");
// 		});

// 		it("should return 404 for non-existent user", async () => {
// 			const token = generateTestToken();
// 			const response = await request(app).get("/users/99999").set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toEqual("User not found");
// 		});
// 	});

// 	describe("PUT /users/:id", () => {
// 		it("should update user", async () => {
// 			// First create a user
// 			const userData = {
// 				name: "Bob Smith",
// 				email: "bob.smith@example.com",
// 			};

// 			const createResponse = await request(app).post("/users").send(userData);
// 			const createdUser: User = createResponse.body.responseObject;

// 			// Then update the user
// 			const updateData = {
// 				name: "Bob Updated",
// 				email: "bob.updated@example.com",
// 			};

// 			const token = generateTestToken();
// 			const response = await request(app)
// 				.put(`/users/${createdUser.id}`)
// 				.set("Authorization", `Bearer ${token}`)
// 				.send(updateData);
// 			const result: ServiceResponse<User> = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.OK);
// 			expect(result.success).toBeTruthy();
// 			expect(result.responseObject).toMatchObject(updateData);
// 			expect(result.message).toEqual("User updated successfully");
// 		});

// 		it("should return 404 when updating non-existent user", async () => {
// 			const updateData = {
// 				name: "Non-existent User",
// 			};

// 			const token = generateTestToken();
// 			const response = await request(app).put("/users/99999").set("Authorization", `Bearer ${token}`).send(updateData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toEqual("User not found");
// 		});
// 	});

// 	describe("DELETE /users/:id", () => {
// 		it("should delete user", async () => {
// 			// First create a user
// 			const userData = {
// 				name: "Alice Johnson",
// 				email: "alice.johnson@example.com",
// 			};

// 			const createResponse = await request(app).post("/users").send(userData);
// 			const createdUser: User = createResponse.body.responseObject;

// 			// Then delete the user
// 			const token = generateTestToken();
// 			const response = await request(app).delete(`/users/${createdUser.id}`).set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.OK);
// 			expect(result.success).toBeTruthy();
// 			expect(result.message).toEqual("User deleted successfully");

// 			// Verify user is deleted
// 			const getResponse = await request(app).get(`/users/${createdUser.id}`).set("Authorization", `Bearer ${token}`);
// 			expect(getResponse.statusCode).toEqual(StatusCodes.NOT_FOUND);
// 		});

// 		it("should return 404 when deleting non-existent user", async () => {
// 			const response = await request(app).delete("/users/99999");
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toEqual("User not found");
// 		});
// 	});

// 	describe("Error Scenarios with Wrong Data", () => {
// 		it("should return 409 CONFLICT when creating user with existing email", async () => {
// 			// First create a user
// 			const userData = {
// 				name: "John Doe",
// 				email: "john.doe@example.com",
// 				password: "password123",
// 			};

// 			await request(app).post("/users").send(userData);

// 			// Try to create another user with same email
// 			const duplicateUserData = {
// 				name: "Jane Smith",
// 				email: "john.doe@example.com", // Same email
// 				password: "password456",
// 			};

// 			const response = await request(app).post("/users").send(duplicateUserData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toEqual("Email already exists");
// 		});

// 		it("should return 409 CONFLICT when updating user email to existing one", async () => {
// 			// Create first user
// 			const user1Data = {
// 				name: "User One",
// 				email: "user1@example.com",
// 			};

// 			const createResponse1 = await request(app).post("/users").send(user1Data);
// 			const user1: User = createResponse1.body.responseObject;

// 			// Create second user
// 			const user2Data = {
// 				name: "User Two",
// 				email: "user2@example.com",
// 			};

// 			await request(app).post("/users").send(user2Data);

// 			// Try to update user1's email to user2's email
// 			const updateData = {
// 				email: "user2@example.com", // Existing email
// 			};

// 			const token = generateTestToken();
// 			const response = await request(app)
// 				.put(`/users/${user1.id}`)
// 				.set("Authorization", `Bearer ${token}`)
// 				.send(updateData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toEqual("Email already exists");
// 		});

// 		it("should return 400 BAD_REQUEST for empty request body on POST", async () => {
// 			const response = await request(app).post("/users").send({});
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for name too long", async () => {
// 			const longName = "a".repeat(101); // Max 100 characters
// 			const userData = {
// 				name: longName,
// 				email: "test@example.com",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 			expect(result.message).toContain("Name too long");
// 		});

// 		it("should return 400 BAD_REQUEST for email too long", async () => {
// 			const longEmail = `${"a".repeat(246)}@example.com`; // Max 255 characters
// 			const userData = {
// 				name: "Test User",
// 				email: longEmail,
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 			expect(result.message).toContain("Email too long");
// 		});

// 		it("should return 400 BAD_REQUEST for invalid ID format", async () => {
// 			const token = generateTestToken();
// 			const response = await request(app).get("/users/invalid-id").set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for negative ID", async () => {
// 			const token = generateTestToken();
// 			const response = await request(app).get("/users/-1").set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for zero ID", async () => {
// 			const token = generateTestToken();
// 			const response = await request(app).get("/users/0").set("Authorization", `Bearer ${token}`);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for malformed JSON", async () => {
// 			const response = await request(app).post("/users").set("Content-Type", "application/json").send("{invalid json");
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 		});

// 		it("should return 400 BAD_REQUEST for SQL injection attempt", async () => {
// 			const maliciousData = {
// 				name: "'; DROP TABLE users; --",
// 				email: "test@example.com",
// 			};

// 			const response = await request(app).post("/users").send(maliciousData);
// 			const result: ServiceResponse = response.body;

// 			// Should not execute SQL injection, should validate as normal
// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for special characters in email", async () => {
// 			const userData = {
// 				name: "Test User",
// 				email: "test@exam ple.com", // Space in email
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 			expect(result.message).toContain("Invalid email");
// 		});

// 		it("should return 400 BAD_REQUEST for empty strings", async () => {
// 			const userData = {
// 				name: "",
// 				email: "",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for null values", async () => {
// 			const userData = {
// 				name: null,
// 				email: null,
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
// 			expect(result.success).toBeFalsy();
// 			expect(result.message).toContain("Validation error");
// 		});

// 		it("should return 400 BAD_REQUEST for extra fields", async () => {
// 			const userData = {
// 				name: "Test User",
// 				email: "test@example.com",
// 				extraField: "should be ignored",
// 				password: "secret123",
// 			};

// 			const response = await request(app).post("/users").send(userData);
// 			const result: ServiceResponse<User> = response.body;

// 			expect(response.statusCode).toEqual(StatusCodes.CREATED);
// 			expect(result.success).toBeTruthy();
// 			expect(result.responseObject?.name).toEqual("Test User");
// 			expect(result.responseObject?.email).toEqual("test@example.com");
// 			// Extra fields should be ignored, not cause validation error
// 		});
// 	});
// });
