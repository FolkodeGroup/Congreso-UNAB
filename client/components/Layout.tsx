import { ReactNode, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import CongressLogo from './CongressLogo';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSobreElCongresoActive = () => {
    return ['/programa', '/ponentes', '/empresas', '/sobre-el-congreso'].includes(location.pathname);
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-congress-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex-shrink-0">
              <img src="/images/LogoUnab.png" alt="UNaB Logo" className="h-20 w-auto" />
            </div>

            {/* Navigation */}
            {/* Navegación de escritorio (visible en pantallas grandes) */}
            <nav className="hidden lg:flex flex-wrap gap-2 lg:gap-4 items-center">
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'secondary' : 'ghost'}
                  className={isActive('/') ? 'bg-white text-congress-blue' : 'hover:bg-congress-blue-dark text-congress-white'}
                >
                  Inicio
                </Button>
              </Link>
              {/* Dropdown para "Sobre el Congreso" */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Button
                  variant={isSobreElCongresoActive() ? 'secondary' : 'ghost'}
                  className={`${isSobreElCongresoActive() ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'} flex items-center gap-1`}
                >
                  Sobre el Congreso
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/programa"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-congress-blue hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Programa
                    </Link>
                    <Link
                      to="/ponentes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-congress-blue hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Ponentes
                    </Link>
                    <Link
                      to="/empresas"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-congress-blue hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Empresas
                    </Link>
                    <Link
                      to="/sobre-el-congreso"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-congress-blue hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Información General
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/registro">
                <Button
                  variant={isActive('/registro') ? 'secondary' : 'ghost'}
                  className={isActive('/registro') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Registro
                </Button>
              </Link>
              <Link to="/generar-qrs">
                <Button
                  variant={isActive('/generar-qrs') ? 'secondary' : 'ghost'}
                  className={isActive('/generar-qrs') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Generar QRs
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
              <Link to="/historia-campus">
                <Button
                  variant={isActive('/historia-campus') ? 'secondary' : 'ghost'}
                  className={isActive('/historia-campus') ? 'bg-white text-congress-blue' : 'text-white hover:bg-congress-blue-dark'}
                >
                  Historia del Campus
                </Button>
              </Link>
              <div className="flex items-center justify-end space-x-3 mb-4">
                <img src="/images/folkode-blanco.jpeg" alt="Logo de Folkode" className="h-24 w-auto bg-white p-2 rounded" />
              </div>
            </nav>

            {/* Navigation (Mobile) - Solo visible en móviles, alineado a la derecha */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
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