import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  ChefHat,
  Heart,
  ArrowLeft,
  Star,
  ListOrdered,
  ShoppingBasket,
} from "lucide-react";
import type { Recipe } from "@/types/recipe";

const DIFFICULTY_COLOR = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ data: Recipe }>(`/recipes/${id}`)
      .then((r) => setRecipe(r.data.data))
      .catch(() => navigate("/recipes"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    api
      .get<{ data: { recipeId: string }[] }>("/favorites")
      .then((r) => setIsFav(r.data.data.some((f) => f.recipeId === id)))
      .catch(() => {});
  }, [user, id]);

  const toggleFav = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFavLoading(true);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        setIsFav(false);
        toast({ title: "Removed from favorites" });
      } else {
        await api.post("/favorites", { recipeId: id });
        setIsFav(true);
        toast({ title: "Added to favorites" });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not update favorites" });
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="aspect-video bg-muted rounded-xl" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      {/* Hero image */}
      <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-6">
        {recipe.image ? (
          <img
            src={`/uploads/${recipe.image}`}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Title + actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <Button
          variant={isFav ? "default" : "outline"}
          size="icon"
          onClick={toggleFav}
          disabled={favLoading}
          className="shrink-0"
        >
          <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="capitalize">{recipe.category}</Badge>
        {recipe.difficulty && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        )}
        {recipe.cookingTime && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground border rounded-full px-2 py-1">
            <Clock className="h-3 w-3" /> {recipe.cookingTime} min
          </span>
        )}
        {recipe.rating !== undefined && recipe.rating > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground border rounded-full px-2 py-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {recipe.rating}
          </span>
        )}
      </div>

      <p className="text-muted-foreground mb-6">{recipe.description}</p>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
          ))}
        </div>
      )}

      <Separator className="my-6" />

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <ShoppingBasket className="h-5 w-5 text-primary" /> Ingredients
        </h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      </section>

      <Separator className="my-6" />

      {/* Steps */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <ListOrdered className="h-5 w-5 text-primary" /> Instructions
        </h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Separator className="my-6" />

      <p className="text-xs text-muted-foreground">
        By {recipe.createdBy.name} · {new Date(recipe.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
