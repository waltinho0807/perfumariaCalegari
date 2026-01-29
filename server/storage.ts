import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import { 
  products, leads, viewedProducts, blogPosts,
  type Product, type InsertProduct,
  type Lead, type InsertLead,
  type ViewedProduct, type InsertViewedProduct,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Leads
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  getLeadByPhone(phone: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;

  // Viewed Products
  addViewedProduct(data: InsertViewedProduct): Promise<ViewedProduct>;
  getViewedProductsByLead(leadId: number): Promise<ViewedProduct[]>;
  removeViewedProduct(leadId: number, productId: number): Promise<boolean>;

  // Blog Posts
  getAllBlogPosts(page?: number, limit?: number): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      category: product.category,
      notes: product.notes,
      stock: product.stock ?? 0,
      isPromotion: product.isPromotion ?? false,
      promoPrice: product.promoPrice ?? null,
    }).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.phone, phone));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values({
      name: lead.name,
      phone: lead.phone,
    }).returning();
    return newLead;
  }

  // Viewed Products
  async addViewedProduct(data: InsertViewedProduct): Promise<ViewedProduct> {
    if (data.leadId && data.productId) {
      const [existing] = await db.select().from(viewedProducts)
        .where(and(
          eq(viewedProducts.leadId, data.leadId),
          eq(viewedProducts.productId, data.productId)
        ));
      if (existing) {
        return existing;
      }
    }
    const [viewed] = await db.insert(viewedProducts).values({
      leadId: data.leadId,
      productId: data.productId,
    }).returning();
    return viewed;
  }

  async getViewedProductsByLead(leadId: number): Promise<ViewedProduct[]> {
    return await db.select().from(viewedProducts).where(eq(viewedProducts.leadId, leadId));
  }

  async removeViewedProduct(leadId: number, productId: number): Promise<boolean> {
    const result = await db.delete(viewedProducts)
      .where(and(
        eq(viewedProducts.leadId, leadId),
        eq(viewedProducts.productId, productId)
      ))
      .returning();
    return result.length > 0;
  }

  // Blog Posts
  async getAllBlogPosts(page: number = 1, limit: number = 6): Promise<{ posts: BlogPost[]; total: number }> {
    const offset = (page - 1) * limit;
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    return { posts, total: Number(count) };
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      productId: post.productId,
    }).returning();
    return newPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
