import { sql } from "drizzle-orm";
import { pgTable, text, integer, decimal, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  notes: text("notes").notNull(),
  stock: integer("stock").default(0).notNull(),
  isPromotion: boolean("is_promotion").default(false).notNull(),
  promoPrice: decimal("promo_price", { precision: 10, scale: 2 }),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.string(),
  image: z.string().min(1),
  category: z.string().min(1),
  notes: z.string().min(1),
  stock: z.number().int().min(0).optional(),
  isPromotion: z.boolean().optional(),
  promoPrice: z.string().optional().nullable(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const leads = pgTable("leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
});

export const loginLeadSchema = z.object({
  phone: z.string().min(8),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export const viewedProducts = pgTable("viewed_products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  leadId: integer("lead_id").references(() => leads.id),
  productId: integer("product_id").references(() => products.id),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export type ViewedProduct = typeof viewedProducts.$inferSelect;
export type InsertViewedProduct = { leadId: number | null; productId: number | null; };

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  productId: integer("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().min(1),
  productId: z.number().nullable(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
