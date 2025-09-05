import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const menuItems = [
    { name: 'Inicio', path: '/' },
    {
      name: 'Sobre el Congreso',
      subItems: [
        { name: 'Programa', path: '/programa' },
        { name: 'Disertantes', path: '/ponentes' },
        { name: 'Empresas', path: '/empresas' },
        { name: 'Información General', path: '/sobre-el-congreso' },
      ],
    },
    { name: 'Registro', path: '/registro' },
    { name: 'Generar QRs', path: '/generar-qrs' },
    { name: 'Contacto', path: '/contacto' },
    { name: 'Historia del Campus', path: '/historia-campus' },
  ];

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button onClick={toggleMenu} className="text-white p-2 focus:outline-none">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-congress-blue z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in-down">
          <button onClick={closeMenu} className="absolute top-4 right-4 text-white p-2">
            <FiX size={24} />
          </button>
          <nav className="flex flex-col space-y-4 text-2xl font-semibold text-center">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center justify-center w-full text-white hover:text-congress-cyan transition-colors"
                    >
                      {item.name}
                      {isDropdownOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                    </button>
                    {isDropdownOpen && (
                      <div className="flex flex-col items-center space-y-2 mt-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={closeMenu}
                            className="text-white text-xl hover:text-congress-cyan transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path!}
                    onClick={closeMenu}
                    className="text-white hover:text-congress-cyan transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}