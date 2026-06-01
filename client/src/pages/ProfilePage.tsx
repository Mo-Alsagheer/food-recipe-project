import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface FavoriteEntry {
  _id: string;
  recipeId: Recipe;
}

interface FavoritesResponse {
  data: FavoriteEntry[];
  total: number;
  page: number;
  pages: number;
}

export function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const { data } = await api.get<FavoritesResponse>("/favorites", {
          params: { page, limit: 8 },
        });
        setFavorites(data.data);
        setMeta({ page: data.page, pages: data.pages, total: data.total });
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Failed to load favorites" });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchFavorites(1);
  }, [fetchFavorites]);

  const removeFavorite = async (recipeId: string) => {
    try {
      await api.delete(`/favorites/${recipeId}`);
      toast({ title: "Removed from favorites" });
      fetchFavorites(meta.page);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not remove favorite" });
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-10">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Favorites section */}
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">My Favorites</h2>
        <span className="text-sm text-muted-foreground">({meta.total})</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          You haven't saved any recipes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <div key={fav._id} className="relative group">
              <RecipeCard recipe={fav.recipeId} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                onClick={() => removeFavorite(fav.recipeId._id)}
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            size="icon"
            disabled={meta.page <= 1}
            onClick={() => fetchFavorites(meta.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={meta.page >= meta.pages}
            onClick={() => fetchFavorites(meta.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
