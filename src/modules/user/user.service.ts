import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import type { User } from "@/modules/user";
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from "@/modules/user/user.dto";
import { userRepository } from "@/modules/user/user.repository";

export class UserService {
	private mapUserToResponse(user: User): UserResponseDto {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
	async findAll(): Promise<ServiceResponse<UserResponseDto[] | null>> {
		try {
			const users = await userRepository.findAll();
			return ServiceResponse.success("Users retrieved successfully", users.map(this.mapUserToResponse));
		} catch (_error) {
			return ServiceResponse.failure("Failed to retrieve users", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async findById(id: number): Promise<ServiceResponse<UserResponseDto | null>> {
		try {
			const user = await userRepository.findById(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("User retrieved successfully", this.mapUserToResponse(user));
		} catch (_error) {
			return ServiceResponse.failure("Failed to retrieve user", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async create(createUserDto: CreateUserDto): Promise<ServiceResponse<UserResponseDto | null>> {
		try {
			// Check if email already exists
			const existingUser = await userRepository.findByEmail(createUserDto.email);
			if (existingUser) {
				return ServiceResponse.failure("Email already exists", null, StatusCodes.CONFLICT);
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

			const user = await userRepository.create(createUserDto.name, createUserDto.email, hashedPassword);

			return ServiceResponse.success("User created successfully", this.mapUserToResponse(user), StatusCodes.CREATED);
		} catch (_error) {
			return ServiceResponse.failure("Failed to create user", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<ServiceResponse<UserResponseDto | null>> {
		try {
			// Check if email is being updated and if it already exists
			if (updateUserDto.email) {
				const existingUserWithEmail = await userRepository.findByEmail(updateUserDto.email);
				if (existingUserWithEmail && existingUserWithEmail.id !== id) {
					return ServiceResponse.failure("Email already exists", null, StatusCodes.CONFLICT);
				}
			}

			const updatedUser = await userRepository.update(id, updateUserDto.name, updateUserDto.email);
			if (!updatedUser) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("User updated successfully", this.mapUserToResponse(updatedUser));
		} catch (_error) {
			return ServiceResponse.failure("Failed to update user", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(id: number): Promise<ServiceResponse<null>> {
		try {
			const deleted = await userRepository.delete(id);
			if (!deleted) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("User deleted successfully", null);
		} catch (_error) {
			return ServiceResponse.failure("Failed to delete user", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
