import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Recipe, PaginatedResponse } from "@/types/recipe";

interface Category {
  _id: string;
  name: string;
}

interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  cookingTime: string;
  difficulty: string;
  rating: string;
  tags: string;
  ingredients: string[];
  steps: string[];
}

const emptyForm = (): RecipeFormData => ({
  title: "",
  description: "",
  category: "",
  cookingTime: "",
  difficulty: "",
  rating: "",
  tags: "",
  ingredients: [""],
  steps: [""],
});

function recipeToForm(r: Recipe): RecipeFormData {
  return {
    title: r.title,
    description: r.description,
    category: r.category,
    cookingTime: String(r.cookingTime ?? ""),
    difficulty: r.difficulty ?? "",
    rating: String(r.rating ?? ""),
    tags: (r.tags ?? []).join(", "),
    ingredients: r.ingredients.length ? r.ingredients : [""],
    steps: r.steps.length ? r.steps : [""],
  };
}

export function AdminRecipesPage() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [form, setForm] = useState<RecipeFormData>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Category[]>("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<Recipe>>("/admin/recipes", {
        params: { page, limit: 10 },
      });
      setRecipes(data.recipes ?? []);
      setPages(data.pages);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to load recipes" });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setImageFile(null);
    setOpen(true);
  };

  const openEdit = (r: Recipe) => {
    setEditing(r);
    setForm(recipeToForm(r));
    setImageFile(null);
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (form.cookingTime) fd.append("cookingTime", form.cookingTime);
      if (form.difficulty) fd.append("difficulty", form.difficulty);
      if (form.rating) fd.append("rating", form.rating);
      form.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append("tags[]", t));
      form.ingredients.filter(Boolean).forEach((ing) => fd.append("ingredients[]", ing));
      form.steps.filter(Boolean).forEach((s) => fd.append("steps[]", s));
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/admin/recipes/${editing._id}`, fd);
        toast({ title: "Recipe updated" });
      } else {
        await api.post("/admin/recipes", fd);
        toast({ title: "Recipe created" });
      }
      setOpen(false);
      fetchRecipes();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Save failed";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: Recipe) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    try {
      await api.delete(`/admin/recipes/${r._id}`);
      toast({ title: "Deleted" });
      fetchRecipes();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Delete failed" });
    }
  };

  const updateListItem = (field: "ingredients" | "steps", i: number, value: string) => {
    const arr = [...form[field]];
    arr[i] = value;
    setForm({ ...form, [field]: arr });
  };

  const addListItem = (field: "ingredients" | "steps") =>
    setForm({ ...form, [field]: [...form[field], ""] });

  const removeListItem = (field: "ingredients" | "steps", i: number) => {
    const arr = form[field].filter((_, idx) => idx !== i);
    setForm({ ...form, [field]: arr.length ? arr : [""] });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin — Recipes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> New Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Recipe" : "New Recipe"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description *</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={categories.length ? "Select…" : "No categories yet"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id} className="capitalize">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cooking Time (min)</Label>
                  <Input type="number" min={1} value={form.cookingTime} onChange={(e) => setForm({ ...form, cookingTime: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Rating (0–5)</Label>
                  <Input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input placeholder="italian, quick, healthy" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <Label>Ingredients *</Label>
                {form.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={ing} onChange={(e) => updateListItem("ingredients", i, e.target.value)} placeholder={`Ingredient ${i + 1}`} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem("ingredients", i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addListItem("ingredients")}>
                  <Plus className="h-3 w-3 mr-1" /> Add ingredient
                </Button>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <Label>Steps *</Label>
                {form.steps.map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={step} onChange={(e) => updateListItem("steps", i, e.target.value)} placeholder={`Step ${i + 1}`} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem("steps", i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addListItem("steps")}>
                  <Plus className="h-3 w-3 mr-1" /> Add step
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((r) => (
            <Card key={r._id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CardTitle className="text-base truncate">{r.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize shrink-0">
                      {typeof r.category === "object" ? (r.category as unknown as Category).name : r.category}
                    </Badge>
                    {r.difficulty && (
                      <Badge variant="outline" className="capitalize shrink-0">{r.difficulty}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
          <Button variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
