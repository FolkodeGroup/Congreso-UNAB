import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import CongressLogo from './CongressLogo';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-congress-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Logo and Title */}
            <div className="mb-4 lg:mb-0">
              <img src="/images/LogoUnab.png" alt="UNaB Logo" className="h-20 w-auto" />
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap gap-2 lg:gap-4">
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'secondary' : 'ghost'}
                  className={isActive('/') ? 'bg-white text-congress-blue' : 'hover:bg-congress-blue-dark text-congress-white'}
                >
                  Inicio
                </Button>
              </Link>
              <Link to="/programa">
                <Button
                  variant={isActive('/programa') ? 'secondary' : 'ghost'}
                  className={isActive('/programa') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Programa
                </Button>
              </Link>
              <Link to="/registro">
                <Button
                  variant={isActive('/registro') ? 'secondary' : 'ghost'}
                  className={isActive('/registro') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Registro
                </Button>
              </Link>
              <Link to="/ponentes">
                <Button
                  variant={isActive('/ponentes') ? 'secondary' : 'ghost'}
                  className={isActive('/ponentes') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Ponentes
                </Button>
              </Link>
              <Link to="/empresas">
                <Button
                  variant={isActive('/empresas') ? 'secondary' : 'ghost'}
                  className={isActive('/empresas') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Empresas
                </Button>
              </Link>
              <Link to="/escaneo-qr">
                <Button
                  variant={isActive('/escaneo-qr') ? 'secondary' : 'ghost'}
                  className={isActive('/escaneo-qr') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Escanear QR
                </Button>
              </Link>
              <Link to="/contacto">
                <Button
                  variant={isActive('/contacto') ? 'secondary' : 'ghost'}
                  className={isActive('/contacto') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Contacto
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Congreso de Logística y Transporte</h3>
              <p className="text-gray-300">
                Moviendo el futuro - Innovación y desafíos en la logística y el transporte
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Información del Evento</h3>
              <p className="text-gray-300 mb-2">📅 15 de Noviembre 2025</p>
              <p className="text-gray-300 mb-2">📍 Campus UNaB, Blas Parera 132</p>
              <p className="text-gray-300">✉️ congresologisticaytransporte@unab.edu.ar</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Universidad Nacional Guillermo Brown</h3>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/images/LogoUnab.png" alt="UNaB Logo" className="h-16 w-auto" />
                <div>
                  <div className="text-white font-semibold">UNaB</div>
                  <div className="text-gray-300 text-sm">Universidad Nacional</div>
                </div>
              </div>
              <p className="text-gray-300">
                Comprometida con la educación y la investigación en logística y transporte.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Universidad Nacional Guillermo Brown. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
