import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const categories = ["Todos", "Masculino", "Feminino", "Unissex"];

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:justify-between">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar perfume ou nota..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-none border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          data-testid="input-search"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat)}
            className="rounded-none text-xs font-medium uppercase tracking-widest"
            data-testid={`filter-${cat.toLowerCase()}`}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
