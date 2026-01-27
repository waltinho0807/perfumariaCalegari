import { type User, type InsertUser, type Product, type InsertProduct, type Lead, type InsertLead, type BlogPost, type InsertBlogPost, type ViewedProduct, type InsertViewedProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByPhone(phone: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;

  getViewedProducts(leadId: number): Promise<Product[]>;
  addViewedProduct(viewedProduct: InsertViewedProduct): Promise<ViewedProduct>;
  removeViewedProduct(leadId: number, productId: number): Promise<boolean>;

  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<number, Product>;
  private leads: Map<number, Lead>;
  private viewedProducts: Map<number, ViewedProduct>;
  private blogPosts: Map<number, BlogPost>;
  private productIdCounter: number = 1;
  private leadIdCounter: number = 1;
  private viewedProductIdCounter: number = 1;
  private blogPostIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.leads = new Map();
    this.viewedProducts = new Map();
    this.blogPosts = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Invictus",
        brand: "Paco Rabanne",
        price: "399.90",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=700&fit=crop",
        category: "Masculino",
        notes: "Madeira, Âmbar, Couro",
        stock: 15,
        isPromotion: true,
        promoPrice: "329.90",
      },
      {
        name: "La Vie Est Belle",
        brand: "Lancôme",
        price: "549.00",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=700&fit=crop",
        category: "Feminino",
        notes: "Íris, Pralinê, Patchouli",
        stock: 8,
        isPromotion: false,
        promoPrice: null,
      },
      {
        name: "Bleu de Chanel",
        brand: "Chanel",
        price: "899.00",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=700&fit=crop",
        category: "Masculino",
        notes: "Cítrico, Menta, Cedro",
        stock: 5,
        isPromotion: false,
        promoPrice: null,
      },
      {
        name: "Good Girl",
        brand: "Carolina Herrera",
        price: "629.00",
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=700&fit=crop",
        category: "Feminino",
        notes: "Jasmin, Cacau, Tonka",
        stock: 12,
        isPromotion: true,
        promoPrice: "499.00",
      },
      {
        name: "Eros",
        brand: "Versace",
        price: "459.00",
        image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&h=700&fit=crop",
        category: "Masculino",
        notes: "Menta, Baunilha, Cedro",
        stock: 20,
        isPromotion: false,
        promoPrice: null,
      },
      {
        name: "CK One",
        brand: "Calvin Klein",
        price: "289.00",
        image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&h=700&fit=crop",
        category: "Unissex",
        notes: "Bergamota, Cardamomo, Musk",
        stock: 0,
        isPromotion: false,
        promoPrice: null,
      },
    ];

    sampleProducts.forEach((product) => {
      this.createProduct(product);
    });

    const samplePosts: InsertBlogPost[] = [
      {
        title: "Como Escolher o Perfume Ideal para Cada Ocasião",
        excerpt: "Descubra como selecionar a fragrância perfeita para trabalho, encontros e eventos especiais.",
        content: "Escolher o perfume certo pode transformar completamente uma ocasião. Para o ambiente de trabalho, opte por fragrâncias mais sutis e frescas. Em encontros românticos, aposte em notas mais sensuais e envolventes. Já para eventos noturnos, perfumes intensos e marcantes são a escolha ideal.\n\nLembre-se: a concentração do perfume também importa. Eau de Toilette é mais leve e ideal para o dia-a-dia, enquanto Eau de Parfum oferece maior fixação para ocasiões especiais.",
        image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=500&fit=crop",
        productId: 1,
      },
      {
        title: "Os Segredos da Fixação Perfeita",
        excerpt: "Aprenda técnicas para fazer seu perfume durar o dia todo sem precisar reaplicar.",
        content: "A fixação do perfume depende de vários fatores. Primeiro, aplique sempre na pele hidratada - use um creme sem fragrância antes. Segundo, evite esfregar os pulsos depois de aplicar, pois isso quebra as moléculas do perfume.\n\nOs melhores pontos de aplicação são: pulsos, atrás das orelhas, na nuca e no interior dos cotovelos. Esses pontos de pulsação ajudam a difundir a fragrância ao longo do dia.",
        image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&h=500&fit=crop",
        productId: null,
      },
    ];

    samplePosts.forEach((post) => {
      this.createBlogPost(post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = {
      id,
      name: insertProduct.name,
      brand: insertProduct.brand,
      price: insertProduct.price,
      image: insertProduct.image,
      category: insertProduct.category,
      notes: insertProduct.notes,
      stock: insertProduct.stock ?? 0,
      isPromotion: insertProduct.isPromotion ?? false,
      promoPrice: insertProduct.promoPrice ?? null,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = {
      ...product,
      ...updates,
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    return Array.from(this.leads.values()).find(
      (lead) => lead.phone === phone,
    );
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadIdCounter++;
    const lead: Lead = {
      id,
      name: insertLead.name,
      phone: insertLead.phone,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getViewedProducts(leadId: number): Promise<Product[]> {
    const viewedProductIds = Array.from(this.viewedProducts.values())
      .filter((vp) => vp.leadId === leadId)
      .map((vp) => vp.productId);
    
    return Array.from(this.products.values()).filter((p) =>
      viewedProductIds.includes(p.id)
    );
  }

  async addViewedProduct(insertViewedProduct: InsertViewedProduct): Promise<ViewedProduct> {
    const existing = Array.from(this.viewedProducts.values()).find(
      (vp) => vp.leadId === insertViewedProduct.leadId && vp.productId === insertViewedProduct.productId
    );
    if (existing) return existing;

    const id = this.viewedProductIdCounter++;
    const viewedProduct: ViewedProduct = {
      id,
      leadId: insertViewedProduct.leadId,
      productId: insertViewedProduct.productId,
      viewedAt: new Date(),
    };
    this.viewedProducts.set(id, viewedProduct);
    return viewedProduct;
  }

  async removeViewedProduct(leadId: number, productId: number): Promise<boolean> {
    const entry = Array.from(this.viewedProducts.entries()).find(
      ([, vp]) => vp.leadId === leadId && vp.productId === productId
    );
    if (entry) {
      return this.viewedProducts.delete(entry[0]);
    }
    return false;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const blogPost: BlogPost = {
      id,
      title: insertPost.title,
      excerpt: insertPost.excerpt,
      content: insertPost.content,
      image: insertPost.image,
      productId: insertPost.productId,
      createdAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();
