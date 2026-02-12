import type { Request, Response } from "express";
import passport from "@/common/config/passport";
import type { AuthUser } from "@/modules/auth";
import { authService } from "@/modules/auth/auth.service";
import type { User } from "@/modules/user";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    passport.authenticate(
      "local",
      { session: false },
      async (
        err: Error | null,
        user: User | false,
        info: { message: string } | undefined,
      ) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        if (!user) {
          return res
            .status(401)
            .json({ message: info?.message || "Invalid credentials" });
        }
        try {
          const token = await authService.generateToken(user);
          const userResponse: AuthUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          res.json({ token, user: userResponse });
        } catch (_error) {
          res.status(500).json({ message: "Token generation failed" });
        }
      },
    )(req, res);
  }

  async register(req: Request, res: Response): Promise<void> {
    const serviceResponse = await authService.register(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  }
}

export const authController = new AuthController();
