import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertLeadSchema, loginLeadSchema, insertBlogPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Products routes
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Leads routes
  app.post("/api/leads/register", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const existingLead = await storage.getLeadByPhone(data.phone);
      if (existingLead) {
        return res.status(400).json({ message: "Telefone já cadastrado. Faça login." });
      }
      const lead = await storage.createLead(data);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao cadastrar" });
    }
  });

  app.post("/api/leads/login", async (req, res) => {
    try {
      const data = loginLeadSchema.parse(req.body);
      const lead = await storage.getLeadByPhone(data.phone);
      if (!lead) {
        return res.status(404).json({ message: "Telefone não encontrado. Cadastre-se primeiro." });
      }
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao fazer login" });
    }
  });

  // Viewed products routes
  app.get("/api/viewed-products/:leadId", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const viewed = await storage.getViewedProductsByLead(leadId);
      res.json(viewed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch viewed products" });
    }
  });

  app.post("/api/viewed-products", async (req, res) => {
    try {
      const { leadId, productId } = req.body;
      if (!leadId || !productId) {
        return res.status(400).json({ message: "leadId and productId are required" });
      }
      const viewedProduct = await storage.addViewedProduct({ leadId, productId });
      res.status(201).json(viewedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to add viewed product" });
    }
  });

  app.delete("/api/viewed-products/:leadId/:productId", async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const productId = parseInt(req.params.productId);
      const deleted = await storage.removeViewedProduct(leadId, productId);
      if (!deleted) {
        return res.status(404).json({ message: "Viewed product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove viewed product" });
    }
  });

  // Blog posts routes
  app.get("/api/blog", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const result = await storage.getAllBlogPosts(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  return httpServer;
}
