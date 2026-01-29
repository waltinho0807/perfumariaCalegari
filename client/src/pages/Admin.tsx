import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduct, deleteProduct, createBlogPost, deleteBlogPost } from "@/lib/api";
import { Plus, Trash2, Loader2, Package, FileText } from "lucide-react";
import type { InsertProduct, InsertBlogPost, Product, BlogPost } from "@shared/schema";

export default function Admin() {
  const queryClient = useQueryClient();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);

  const [productForm, setProductForm] = useState<InsertProduct>({
    name: "",
    brand: "",
    price: "",
    image: "",
    category: "Masculino",
    notes: "",
    stock: 10,
    isPromotion: false,
    promoPrice: null,
  });

  const [postForm, setPostForm] = useState<InsertBlogPost>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    productId: null,
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: blogData, isLoading: loadingPosts } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/blog"],
  });
  const posts = blogData?.posts ?? [];

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProduct(true);
    try {
      await createProduct(productForm);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductForm({
        name: "",
        brand: "",
        price: "",
        image: "",
        category: "Masculino",
        notes: "",
        stock: 10,
        isPromotion: false,
        promoPrice: null,
      });
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingPost(true);
    try {
      await createBlogPost(postForm);
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setPostForm({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        productId: null,
      });
    } catch (err) {
      console.error("Error adding post:", err);
    } finally {
      setIsAddingPost(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      await deleteBlogPost(id);
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Painel Administrativo
          </h1>
          <div className="mx-auto h-1 w-24 bg-primary"></div>
        </div>

        <Tabs defaultValue="products" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-card">
            <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card className="rounded-none border-none bg-card mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-foreground">Adicionar Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Nome</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        className="bg-background border-border"
                        data-testid="input-product-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-foreground">Marca</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        required
                        className="bg-background border-border"
                        data-testid="input-product-brand"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-foreground">Preço</Label>
                      <Input
                        id="price"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="199.90"
                        required
                        className="bg-background border-border"
                        data-testid="input-product-price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-foreground">Categoria</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                      >
                        <SelectTrigger className="bg-background border-border" data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                          <SelectItem value="Unissex">Unissex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-foreground">Estoque</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                        className="bg-background border-border"
                        data-testid="input-product-stock"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-foreground">URL da Imagem</Label>
                    <Input
                      id="image"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://..."
                      required
                      className="bg-background border-border"
                      data-testid="input-product-image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground">Notas Olfativas</Label>
                    <Input
                      id="notes"
                      value={productForm.notes}
                      onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })}
                      placeholder="Âmbar, Baunilha, Sândalo..."
                      required
                      className="bg-background border-border"
                      data-testid="input-product-notes"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="promotion"
                        checked={productForm.isPromotion}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, isPromotion: checked })}
                        data-testid="switch-promotion"
                      />
                      <Label htmlFor="promotion" className="text-foreground">Em promoção</Label>
                    </div>
                    {productForm.isPromotion && (
                      <div className="flex-1">
                        <Input
                          placeholder="Preço promocional"
                          value={productForm.promoPrice || ""}
                          onChange={(e) => setProductForm({ ...productForm, promoPrice: e.target.value })}
                          className="bg-background border-border"
                          data-testid="input-promo-price"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isAddingProduct}
                    className="w-full rounded-none"
                    data-testid="button-add-product"
                  >
                    {isAddingProduct ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Adicionar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-foreground">Produtos Cadastrados</h3>
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum produto cadastrado.</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-card p-4"
                      data-testid={`admin-product-${product.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-destructive"
                        data-testid={`button-delete-product-${product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <Card className="rounded-none border-none bg-card mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-foreground">Adicionar Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">Título</Label>
                    <Input
                      id="title"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      required
                      className="bg-background border-border"
                      data-testid="input-post-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-foreground">Resumo</Label>
                    <Input
                      id="excerpt"
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                      required
                      className="bg-background border-border"
                      data-testid="input-post-excerpt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postImage" className="text-foreground">URL da Imagem</Label>
                    <Input
                      id="postImage"
                      value={postForm.image}
                      onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                      placeholder="https://..."
                      required
                      className="bg-background border-border"
                      data-testid="input-post-image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-foreground">Conteúdo</Label>
                    <Textarea
                      id="content"
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      rows={6}
                      required
                      className="bg-background border-border"
                      data-testid="input-post-content"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedProduct" className="text-foreground">Produto Relacionado (opcional)</Label>
                    <Select
                      value={postForm.productId?.toString() || "none"}
                      onValueChange={(value) => setPostForm({ ...postForm, productId: value === "none" ? null : parseInt(value) })}
                    >
                      <SelectTrigger className="bg-background border-border" data-testid="select-linked-product">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isAddingPost}
                    className="w-full rounded-none"
                    data-testid="button-add-post"
                  >
                    {isAddingPost ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Publicar Post
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-foreground">Posts Publicados</h3>
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : posts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum post publicado.</p>
              ) : (
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between bg-card p-4"
                      data-testid={`admin-post-${post.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={post.image} alt={post.title} className="w-12 h-12 object-cover" />
                        <div>
                          <p className="font-medium text-foreground">{post.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive"
                        data-testid={`button-delete-post-${post.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  );
}
