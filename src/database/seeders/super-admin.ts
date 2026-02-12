import "dotenv/config";

import bcrypt from "bcrypt";
import { eq as eqFn } from "drizzle-orm";

import { db } from "@/database/pgConnection";
import { users } from "@/database/schemas/user";

const SUPER_ADMIN_EMAIL = "admin@ceygate.com";
const SUPER_ADMIN_PASSWORD = "loF7?8P>Jh4P";
const SUPER_ADMIN_NAME = "Super Admin";

async function seedSuperAdmin() {
  console.log("Seeding super admin user...");

  try {
    // Check if super admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eqFn(users.email, SUPER_ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("Super admin already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

    // Create super admin
    await db.insert(users).values({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("Super admin created successfully!");
    console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
    console.log("Please change the default password after first login!");
  } catch (error) {
    console.error("Error seeding super admin:", error);
    process.exit(1);
  }
}

export { seedSuperAdmin };
