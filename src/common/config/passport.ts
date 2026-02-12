import bcrypt from "bcrypt";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { userRepository } from "@/modules/user/user.repository";

// Local Strategy for login
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const user = await userRepository.findByEmail(email);
				if (!user) {
					return done(null, false, { message: "Invalid credentials" });
				}

				const isPasswordValid = await bcrypt.compare(password, user.password);
				if (!isPasswordValid) {
					return done(null, false, { message: "Invalid credentials" });
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		},
	),
);

// JWT Strategy for token verification
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || "secret",
		},
		async (payload, done) => {
			try {
				const user = await userRepository.findById(payload.id);
				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		},
	),
);

export default passport;
