import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChefHat } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  breakfast: "🥞",
  lunch: "🥗",
  dinner: "🍽️",
  dessert: "🍰",
  snack: "🥨",
  beverage: "🥤",
};

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((r) => setCategories(r.data ?? []))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/recipes?search=${encodeURIComponent(search.trim())}`);
  };

  const handleCategory = (cat: string) => {
    navigate(`/recipes?category=${cat}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="container mx-auto text-center space-y-6 max-w-2xl">
          <div className="flex justify-center">
            <ChefHat className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Discover Delicious <span className="text-primary">Recipes</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore thousands of recipes crafted by food lovers around the world.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search recipes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategory(cat._id)}
                className="flex flex-col items-center gap-1 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all p-4 min-w-[100px]"
              >
                <span className="text-3xl">{CATEGORY_EMOJI[cat.name.toLowerCase()] ?? "🍴"}</span>
                <span className="capitalize font-medium text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(CATEGORY_EMOJI).map(([cat, emoji]) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="flex flex-col items-center gap-1 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all p-4 min-w-[100px]"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="capitalize font-medium text-sm">{cat}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 px-4">
        <div className="container mx-auto text-center space-y-4 max-w-lg">
          <h2 className="text-2xl font-bold">Ready to explore?</h2>
          <p className="text-muted-foreground">Browse our full collection of recipes.</p>
          <Button size="lg" onClick={() => navigate("/recipes")}>
            View all recipes
          </Button>
        </div>
      </section>
    </div>
  );
}
