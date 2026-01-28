import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, products, leads, viewedProducts, blogPosts,
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Lead, type InsertLead,
  type ViewedProduct, type InsertViewedProduct,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values({
      name: insertProduct.name,
      brand: insertProduct.brand,
      price: insertProduct.price,
      image: insertProduct.image,
      category: insertProduct.category,
      notes: insertProduct.notes,
      stock: insertProduct.stock ?? 0,
      isPromotion: insertProduct.isPromotion ?? false,
      promoPrice: insertProduct.promoPrice ?? null,
    }).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.phone, phone));
    return lead;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      name: insertLead.name,
      phone: insertLead.phone,
    }).returning();
    return lead;
  }

  async getViewedProducts(leadId: number): Promise<Product[]> {
    const viewed = await db.select({ productId: viewedProducts.productId })
      .from(viewedProducts)
      .where(eq(viewedProducts.leadId, leadId));
    
    if (viewed.length === 0) return [];
    
    const productIds = viewed.map(v => v.productId).filter((id): id is number => id !== null);
    if (productIds.length === 0) return [];
    
    const result: Product[] = [];
    for (const id of productIds) {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      if (product) result.push(product);
    }
    return result;
  }

  async addViewedProduct(insertViewedProduct: InsertViewedProduct): Promise<ViewedProduct> {
    const existing = await db.select()
      .from(viewedProducts)
      .where(and(
        eq(viewedProducts.leadId, insertViewedProduct.leadId!),
        eq(viewedProducts.productId, insertViewedProduct.productId!)
      ));
    
    if (existing.length > 0) return existing[0];

    const [vp] = await db.insert(viewedProducts).values({
      leadId: insertViewedProduct.leadId,
      productId: insertViewedProduct.productId,
    }).returning();
    return vp;
  }

  async removeViewedProduct(leadId: number, productId: number): Promise<boolean> {
    await db.delete(viewedProducts)
      .where(and(
        eq(viewedProducts.leadId, leadId),
        eq(viewedProducts.productId, productId)
      ));
    return true;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values({
      title: insertPost.title,
      excerpt: insertPost.excerpt,
      content: insertPost.content,
      image: insertPost.image,
      productId: insertPost.productId,
    }).returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }
}
