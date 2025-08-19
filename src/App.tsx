import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreatePost from "./pages/CreatePost";
import CreateCarousel from "./pages/CreateCarousel";
import CreateReel from "./pages/CreateReel";
import GenerateCopy from "./pages/GenerateCopy";
import GenerateImage from "./pages/GenerateImage";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          {/* Rotas de criação */}
          <Route path="/criar/publicacao" element={
            <MainLayout>
              <CreatePost />
            </MainLayout>
          } />
          <Route path="/criar/carrossel" element={
            <MainLayout>
              <CreateCarousel />
            </MainLayout>
          } />
          <Route path="/criar/reel" element={
            <MainLayout>
              <CreateReel />
            </MainLayout>
          } />
          {/* Rotas do gerador IA */}
          <Route path="/gerador/copys" element={
            <MainLayout>
              <GenerateCopy />
            </MainLayout>
          } />
          <Route path="/gerador/imagens" element={
            <MainLayout>
              <GenerateImage />
            </MainLayout>
          } />
          {/* Outras rotas */}
          <Route path="/calendario" element={
            <MainLayout>
              <Calendar />
            </MainLayout>
          } />
          <Route path="/configuracoes" element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
