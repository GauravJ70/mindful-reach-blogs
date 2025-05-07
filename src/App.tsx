
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import AuthorPage from "./pages/Author";
import AuthPage from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:id" element={<BlogPostPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="author" element={<AuthorPage />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
