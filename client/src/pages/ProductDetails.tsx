import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addViewedProduct } from "@/lib/api";
import { ArrowLeft, MessageCircle, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Lead, Product } from "@shared/schema";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isAdded, setIsAdded] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user_profile");
    if (userStr && product) {
      const user: Lead = JSON.parse(userStr);
      const viewedKey = `viewed_${user.id}_${product.id}`;
      if (!localStorage.getItem(viewedKey)) {
        addViewedProduct(user.id, product.id).then(() => {
          localStorage.setItem(viewedKey, "true");
        }).catch(() => {});
      }
    }
  }, [product]);

  const handleAddToInterests = () => {
    const userStr = localStorage.getItem("user_profile");
    if (!userStr) {
      return;
    }
    const user: Lead = JSON.parse(userStr);
    if (product) {
      addViewedProduct(user.id, product.id).then(() => {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }).catch(() => {});
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Olá! Tenho interesse no perfume ${product.name} (${product.category}). Pode me ajudar?`;
    window.open(`https://wa.me/5564996432476?text=${encodeURIComponent(message)}`, '_blank');
  };

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

  if (!product) {
    return (
      <main className="min-h-screen bg-background pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-foreground">Produto não encontrado</h1>
          <Button variant="outline" className="mt-8" onClick={() => setLocation('/')}>
            Voltar ao início
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const promoPrice = product.promoPrice ? (typeof product.promoPrice === 'string' ? parseFloat(product.promoPrice) : product.promoPrice) : null;
  const isOutOfStock = product.stock === 0;

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

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square overflow-hidden bg-card"
          >
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isPromotion && (
                <Badge className="bg-red-600 text-white no-default-hover-elevate">
                  PROMOÇÃO
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  Esgotado
                </Badge>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <Badge variant="secondary" className="w-fit mb-4 bg-secondary/50">
              {product.category}
            </Badge>

            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </p>

            <h1 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl" data-testid="text-product-name">
              {product.name}
            </h1>

            <p className="mb-8 text-lg text-muted-foreground italic" data-testid="text-product-notes">
              Notas: {product.notes}
            </p>

            <div className="mb-8">
              {product.isPromotion && promoPrice ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl text-muted-foreground line-through">
                    R$ {price.toFixed(2)}
                  </span>
                  <span className="text-4xl font-bold text-red-500" data-testid="text-product-price">
                    R$ {promoPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-primary" data-testid="text-product-price">
                  R$ {price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                disabled={isOutOfStock}
                className="w-full rounded-none bg-[#25D366] text-white text-sm uppercase tracking-widest"
                data-testid="button-whatsapp-buy"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Indisponível' : 'Comprar via WhatsApp'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToInterests}
                disabled={isAdded}
                className="w-full rounded-none text-sm uppercase tracking-widest"
                data-testid="button-add-interests"
              >
                <Heart className={`mr-2 h-5 w-5 ${isAdded ? 'fill-current' : ''}`} />
                {isAdded ? 'Adicionado!' : 'Salvar nos Interesses'}
              </Button>
            </div>

            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="mb-4 font-serif text-lg font-bold text-foreground">Sobre o produto</h3>
              <p className="text-muted-foreground">
                Este perfume foi selecionado especialmente para nossa coleção, garantindo qualidade, 
                originalidade e fixação excepcional. Entre em contato via WhatsApp para saber mais 
                sobre disponibilidade e condições de pagamento.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
