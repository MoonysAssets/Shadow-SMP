import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users as authUsers } from "./models/auth";

// Export auth models so they are available
export * from "./models/auth";

// Extend the auth users table with app-specific fields if needed, 
// but since we can't easily ALTER the auth table in this flow without migration complexity,
// we'll use the authUsers table as is and maybe assume 'isAdmin' is checked via specific usernames 
// or we can add a separate 'profiles' table if we really need strictly typed extensions.
// For this MVP, we'll check admin status via a hardcoded list or a simple setting.
// OR, we can try to add columns to the auth table if we are sure it won't break.
// The Replit Auth blueprint provided `users` table. 
// Let's create a separate `user_data` table to link to `users.id` for extra fields like keys/balance if needed.
// However, the user request is mostly about *displaying* info and *selling* things. 
// "make me a website for my minecraft server" -> usually a landing page + store.

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // In cents or server currency? Assuming USD cents for now or just a number.
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // 'rank' | 'crate'
  category: text("category").default('misc'), // 'ranks', 'keys', etc.
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'server_ip', 'discord_link'
  value: text("value").notNull(),
});

// Schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type ProductInput = InsertProduct;
export type SettingInput = InsertSetting;
