import type { NextFunction, Request, Response } from "express";
import passport from "@/common/config/passport";
import type { AuthUser } from "@/modules/auth";
import type { User } from "@/modules/user";

export interface AuthRequest extends Request {
	user?: AuthUser;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
	passport.authenticate("jwt", { session: false }, (err: Error | null, user: User | false) => {
		if (err) {
			return res.status(500).json({ message: "Authentication error" });
		}
		if (!user) {
			return res.status(401).json({ message: "Invalid token" });
		}
		req.user = {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
		next();
	})(req, res, next);
};
