import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BlogPost, Product } from "@shared/schema";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", id],
    enabled: !!id,
  });

  const { data: linkedProduct } = useQuery<Product>({
    queryKey: ["/api/products", post?.productId?.toString()],
    enabled: !!post?.productId,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-foreground">Post não encontrado</h1>
          <Button variant="outline" className="mt-8" onClick={() => setLocation('/blog')}>
            Voltar ao blog
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-16">
      <Navbar />

      <article className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/blog')}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao blog
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-6 md:text-5xl" data-testid="text-post-title">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground italic mb-8">
            {post.excerpt}
          </p>

          <div className="aspect-[16/9] overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {linkedProduct && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                Produto Relacionado
              </h3>
              <div
                className="flex items-center gap-6 bg-card p-4 cursor-pointer hover-elevate"
                onClick={() => setLocation(`/produto/${linkedProduct.id}`)}
              >
                <img
                  src={linkedProduct.image}
                  alt={linkedProduct.name}
                  className="w-24 h-24 object-cover"
                />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {linkedProduct.brand}
                  </p>
                  <h4 className="font-serif text-lg font-medium text-foreground">
                    {linkedProduct.name}
                  </h4>
                  <p className="text-primary font-semibold">
                    R$ {typeof linkedProduct.price === 'string' ? parseFloat(linkedProduct.price).toFixed(2) : linkedProduct.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}
