import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import type { Recipe, Category } from "@/types/recipe";

const categoryName = (c: Recipe["category"]): string => {
  if (typeof c === "string") return c;
  if (c && "name" in c) return c.name;
  return "";
};

const DIFFICULTY_COLOR = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${recipe._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-video bg-muted overflow-hidden">
          {recipe.image ? (
            <img
              src={`/${recipe.image}`}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 leading-snug">{recipe.title}</h3>
            {recipe.difficulty && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">{categoryName(recipe.category)}</Badge>
          {recipe.cookingTime && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recipe.cookingTime} min
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
