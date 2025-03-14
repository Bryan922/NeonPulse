import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-light mb-4 neon-text">NeonPulse</h3>
            <p className="text-gray-400">
              Créez l'ambiance parfaite avec nos néons personnalisés de haute qualité.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Panier
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/mentions-legales"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link 
                  to="/cgv"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link 
                  to="/confidentialite"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/neonpulseofficiel/"
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                aria-label="Suivez-nous sur Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2020 NeonPulse. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;