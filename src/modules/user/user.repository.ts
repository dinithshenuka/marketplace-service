import { and, eq, ne } from "drizzle-orm";
import { db } from "@/database/pgConnection";
import { users } from "@/database/schemas/user";
import type { User } from "@/modules/user/user.model";

export class UserRepository {
  private mapDbRowToUser(row: typeof users.$inferSelect): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async findAll(): Promise<User[]> {
    const result = await db.select().from(users).orderBy(users.createdAt);
    return result.map((row) => this.mapDbRowToUser(row));
  }

  async findById(id: number): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result.length > 0 ? this.mapDbRowToUser(result[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result.length > 0 ? this.mapDbRowToUser(result[0]) : null;
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        name,
        email,
        password,
      })
      .returning();
    return this.mapDbRowToUser(result[0]);
  }

  async update(
    id: number,
    name?: string,
    email?: string,
  ): Promise<User | null> {
    const updateData: Partial<typeof users.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? this.mapDbRowToUser(result[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    const conditions = [eq(users.email, email)];
    if (excludeId) {
      conditions.push(ne(users.id, excludeId));
    }

    const result = await db
      .select({ count: users.id })
      .from(users)
      .where(and(...conditions))
      .limit(1);
    return result.length > 0;
  }
}

export const userRepository = new UserRepository();
