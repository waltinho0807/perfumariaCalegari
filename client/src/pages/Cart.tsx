import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { removeViewedProduct } from "@/lib/api";
import { ArrowLeft, MessageCircle, Trash2, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Lead, Product } from "@shared/schema";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<Lead | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const userStr = localStorage.getItem("user_profile");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/viewed-products", currentUser?.id?.toString()],
    enabled: !!currentUser,
  });

  const handleRemove = async (productId: number) => {
    if (!currentUser) return;
    try {
      await removeViewedProduct(currentUser.id, productId);
      queryClient.invalidateQueries({ queryKey: ["/api/viewed-products", currentUser.id.toString()] });
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const handleWhatsAppAll = () => {
    if (products.length === 0) return;
    const productNames = products.map((p) => `- ${p.name}`).join("\n");
    const message = `Olá! Tenho interesse nos seguintes perfumes:\n\n${productNames}\n\nPode me passar mais informações?`;
    window.open(`https://wa.me/5564996432476?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h1 className="font-serif text-3xl text-foreground mb-4">Meus Interesses</h1>
          <p className="text-muted-foreground mb-8">
            Faça login para salvar e visualizar seus perfumes favoritos.
          </p>
          <Button
            onClick={() => setLocation('/')}
            className="rounded-none"
            data-testid="button-explore"
          >
            Explorar Coleção
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/')}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à coleção
        </Button>

        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Meus Interesses
          </h1>
          <div className="mx-auto h-1 w-24 bg-primary"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <p className="text-lg text-muted-foreground mb-4">
              Você ainda não salvou nenhum perfume.
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="rounded-none"
            >
              Explorar Coleção
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product, index: number) => {
                const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                const promoPrice = product.promoPrice ? (typeof product.promoPrice === 'string' ? parseFloat(product.promoPrice) : product.promoPrice) : null;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden rounded-none border-none bg-card" data-testid={`interest-card-${product.id}`}>
                      <div className="flex">
                        <div
                          className="w-32 h-32 flex-shrink-0 cursor-pointer"
                          onClick={() => setLocation(`/produto/${product.id}`)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            {product.brand}
                          </p>
                          <h3
                            className="font-serif text-lg font-medium text-foreground cursor-pointer"
                            onClick={() => setLocation(`/produto/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-primary font-semibold">
                            {product.isPromotion && promoPrice
                              ? `R$ ${promoPrice.toFixed(2)}`
                              : `R$ ${price.toFixed(2)}`}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(product.id)}
                            className="mt-3 text-xs text-destructive"
                            data-testid={`button-remove-${product.id}`}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 border-t border-white/10 pt-8 text-center">
              <Button
                size="lg"
                onClick={handleWhatsAppAll}
                className="rounded-none bg-[#25D366] text-white text-sm uppercase tracking-widest"
                data-testid="button-whatsapp-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar todos via WhatsApp
              </Button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
