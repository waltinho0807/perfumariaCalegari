import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [, setLocation] = useLocation();

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <main className="min-h-screen bg-background pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
            Nosso Blog
          </h1>
          <div className="mx-auto h-1 w-24 bg-primary mb-6"></div>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Dicas, novidades e curiosidades sobre o mundo dos perfumes. 
            Descubra como escolher a fragrância perfeita para cada ocasião.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Nenhum post publicado ainda. Volte em breve!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className="overflow-hidden rounded-none border-none bg-card cursor-pointer hover-elevate"
                  onClick={() => setLocation(`/blog/${post.id}`)}
                  data-testid={`blog-card-${post.id}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      Ler mais
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
