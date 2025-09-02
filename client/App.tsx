import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Programa from "./pages/Programa";
import SeleccionRegistro from "./pages/SeleccionRegistro";
import Registro from "./pages/Registro";
import RegistroGrupal from "./pages/RegistroGrupal";
import EscaneoQR from "./pages/EscaneoQR";
import Ponentes from "./pages/Ponentes";
import Contacto from "././pages/Contacto";
import Empresas from "./pages/Empresas";
import VerificarDNI from "./pages/VerificarDNI";
import RegistroRapido from "./pages/RegistroRapido";
import GenerarQRs from "./pages/GenerarQRs";
import HistoriaCampus from "./pages/HistoriaCampus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/programa" element={<Programa />} />
          <Route path="/registro" element={<SeleccionRegistro />} />
          <Route path="/registro/individual" element={<Registro />} />
          <Route path="/registro-grupal" element={<RegistroGrupal />} />
          <Route path="/escaneo-qr" element={<EscaneoQR />} />
          <Route path="/ponentes" element={<Ponentes />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/historia-campus" element={<HistoriaCampus />} />
          <Route path="/verificar-dni" element={<VerificarDNI />} />
          <Route path="/registro-rapido" element={<RegistroRapido />} />
          <Route path="/generar-qrs" element={<GenerarQRs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
