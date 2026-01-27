import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

export function PerfumeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todos");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="collection" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Nossa Coleção
          </h2>
          <div className="mx-auto h-1 w-24 bg-primary"></div>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Nenhum perfume encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </section>
  );
}
