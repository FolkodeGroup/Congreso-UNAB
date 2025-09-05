import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre el Congreso', path: '/sobre-el-congreso' },
    { name: 'Registro', path: '/registro' },
    { name: 'Generar QRs', path: '/generar-qrs' },
    { name: 'Contacto', path: '/contacto' },
    { name: 'Historia del Campus', path: '/historia-campus' },
  ];

  return (
    <div className="md:hidden">
      {/* Botón de hamburguesa */}
      <button onClick={toggleMenu} className="text-white p-2 focus:outline-none">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Menú móvil (superposición) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-congress-blue z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in-down">
          <button onClick={closeMenu} className="absolute top-4 right-4 text-white p-2">
            <FiX size={24} />
          </button>
          <nav className="flex flex-col space-y-4 text-2xl font-semibold">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className="text-white hover:text-congress-cyan transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}