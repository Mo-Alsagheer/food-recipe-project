import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { HomePage } from "@/pages/HomePage";
import { RecipeListPage } from "@/pages/RecipeListPage";

// Pages — filled in subsequent phases
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/recipes/:id" element={<PlaceholderPage title="Recipe Detail" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin/recipes" element={<PlaceholderPage title="Admin — Recipes" />} />
              </Route>
            </Routes>
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
