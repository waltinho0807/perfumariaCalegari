import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Products API
app.get("/api/products", async (_req, res) => {
  const products = await storage.getAllProducts();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await storage.getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const product = await storage.createProduct(req.body);
  res.status(201).json(product);
});

app.delete("/api/products/:id", async (req, res) => {
  await storage.deleteProduct(parseInt(req.params.id));
  res.status(204).end();
});

// Leads API
app.post("/api/leads/register", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "Nome e telefone são obrigatórios" });
  }
  const existingLead = await storage.getLeadByPhone(phone);
  if (existingLead) {
    return res.status(400).json({ message: "Telefone já cadastrado" });
  }
  const lead = await storage.createLead({ name, phone });
  res.status(201).json(lead);
});

app.post("/api/leads/login", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Telefone é obrigatório" });
  }
  const lead = await storage.getLeadByPhone(phone);
  if (!lead) {
    return res.status(404).json({ message: "Telefone não encontrado" });
  }
  res.json(lead);
});

// Blog API
app.get("/api/blog", async (_req, res) => {
  const posts = await storage.getAllBlogPosts();
  res.json(posts);
});

app.get("/api/blog/:id", async (req, res) => {
  const post = await storage.getBlogPost(parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: "Post não encontrado" });
  }
  res.json(post);
});

app.post("/api/blog", async (req, res) => {
  const post = await storage.createBlogPost(req.body);
  res.status(201).json(post);
});

app.delete("/api/blog/:id", async (req, res) => {
  await storage.deleteBlogPost(parseInt(req.params.id));
  res.status(204).end();
});

// Viewed Products API
app.get("/api/viewed/:leadId", async (req, res) => {
  const viewed = await storage.getViewedProducts(parseInt(req.params.leadId));
  res.json(viewed);
});

app.post("/api/viewed", async (req, res) => {
  const { leadId, productId } = req.body;
  await storage.addViewedProduct({ leadId, productId });
  res.status(201).json({ success: true });
});

app.delete("/api/viewed/:leadId/:productId", async (req, res) => {
  await storage.removeViewedProduct(
    parseInt(req.params.leadId),
    parseInt(req.params.productId)
  );
  res.status(204).end();
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erro interno" });
});

export default app;
