import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Eye } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá! Gostaria de saber mais sobre o perfume ${product.name} (${product.category}).`;
    window.open(`https://wa.me/5564996432476?text=${encodeURIComponent(message)}`, '_blank');
  };

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const promoPrice = product.promoPrice ? (typeof product.promoPrice === 'string' ? parseFloat(product.promoPrice) : product.promoPrice) : null;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={() => setLocation(`/produto/${product.id}`)}
      className="cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      <Card className="relative overflow-hidden rounded-none border-none bg-card shadow-lg hover-elevate">
        <div className="relative aspect-[3/4] overflow-hidden">
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

          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/80 text-foreground backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </p>
          <h3 className="mb-2 font-serif text-xl font-medium text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 italic">
            {product.notes}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 pb-6">
          <div className="flex h-12 flex-col items-center justify-center">
            {product.isPromotion && promoPrice ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  R$ {price.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-red-500">
                  R$ {promoPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-primary">
                R$ {price.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            variant={isOutOfStock ? "secondary" : "outline"}
            className="w-full rounded-none text-xs font-medium uppercase tracking-widest"
            disabled={isOutOfStock}
            data-testid={`button-details-${product.id}`}
          >
            {isOutOfStock ? 'Indisponível' : 'Ver Detalhes'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
