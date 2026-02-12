import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { ServiceResponse } from "@/common/models/serviceResponse";
import type { AuthResponse, AuthUser, RegisterDto } from "@/modules/auth/auth.dto";
import type { User } from "@/modules/user";
import { userRepository } from "@/modules/user/user.repository";

export class AuthService {
	async register(registerDto: RegisterDto): Promise<ServiceResponse<AuthResponse | null>> {
		try {
			const existingUser = await userRepository.findByEmail(registerDto.email);
			if (existingUser) {
				return ServiceResponse.failure("Email already exists", null, StatusCodes.CONFLICT);
			}

			const hashedPassword = await bcrypt.hash(registerDto.password, 10);
			const user = await userRepository.create(registerDto.name, registerDto.email, hashedPassword);

			const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
				expiresIn: "1h",
			});

			const userResponse: AuthUser = {
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};

			return ServiceResponse.success("Registration successful", { token, user: userResponse }, StatusCodes.CREATED);
		} catch (_error) {
			return ServiceResponse.failure("Registration failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async generateToken(user: User): Promise<string> {
		return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
			expiresIn: "1h",
		});
	}
}

export const authService = new AuthService();
