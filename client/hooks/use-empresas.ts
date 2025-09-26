import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';

export interface EmpresaAPI {
  id: number;
  nombre_empresa: string;
  logo: string;
  sitio_web?: string;
  descripcion?: string;
}

export interface LogoItem {
  src: string;
  alt: string;
  heightClass?: string;
}

// API base normalizada (siempre termina en /api)
const API_BASE_URL = API_BASE;

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<EmpresaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
  const response = await fetch(`${API_BASE_URL}/empresas/`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setEmpresas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar empresas');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // Convertir empresas de la API al formato LogoItem esperado por los componentes
  const logosForCarousel: LogoItem[] = empresas.map(empresa => ({
    src: empresa.logo,
    alt: empresa.nombre_empresa,
    heightClass: "h-12" // Clase por defecto, se puede personalizar según la empresa
  }));

  return {
    empresas,
    logosForCarousel,
    loading,
    error
  };
};