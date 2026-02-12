import { z } from "zod";

export const LoginDtoSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

export const RegisterDtoSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name too long"),
	email: z.string().email("Invalid email format").max(255, "Email too long"),
	password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password too long"),
});

export const AuthUserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export interface AuthResponse {
	token: string;
	user: AuthUser;
}
export interface AuthUser {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}
