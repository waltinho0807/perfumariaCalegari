import type { Product, Lead, BlogPost, InsertProduct, InsertBlogPost } from "@shared/schema";

const API_BASE = "/api";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

export async function registerLead(name: string, phone: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to register");
  }
  return res.json();
}

export async function loginLead(phone: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to login");
  }
  return res.json();
}

export async function addViewedProduct(leadId: number, productId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/viewed-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId, productId }),
  });
  if (!res.ok) throw new Error("Failed to add viewed product");
}

export async function getViewedProducts(leadId: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/viewed-products/${leadId}`);
  if (!res.ok) throw new Error("Failed to fetch viewed products");
  return res.json();
}

export async function removeViewedProduct(leadId: number, productId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/viewed-products/${leadId}/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove viewed product");
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/blog`);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function fetchBlogPost(id: number): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/blog/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog post");
  return res.json();
}

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error("Failed to create blog post");
  return res.json();
}

export async function deleteBlogPost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/blog/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete blog post");
}
