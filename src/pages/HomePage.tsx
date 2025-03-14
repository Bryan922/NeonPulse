import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Sparkles, Heart, Zap } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="https://player.vimeo.com/external/492834557.sd.mp4?s=1a0c3961c651346c9af69e926f070566e506b353&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 z-10 pt-32">
          <div className="mb-24">
            <div className="inline-block animate-pulse">
              <div className="text-sm font-medium px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Création française depuis 2020
              </div>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 leading-none">
            NeonPulse
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Donnez vie à vos espaces avec nos néons LED personnalisés,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> créés sur mesure pour vous</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/product" 
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                       hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-medium px-8 py-4 
                       rounded-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <span>Créer mon néon</span>
              <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="#about" 
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 
                       rounded-full transform transition-all duration-200"
            >
              <span>En savoir plus</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-black/50 backdrop-blur-xl border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">2K+</div>
              <p className="text-gray-400">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">500+</div>
              <p className="text-gray-400">Créations uniques</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">48h</div>
              <p className="text-gray-400">Délai de création</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">5★</div>
              <p className="text-gray-400">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/assets/neonpulse-logo.jpeg"
                  alt="5 ans d'expertise"
                  className="w-full h-auto rounded-2xl"
                />
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold mb-1">5 ans</div>
                  <div className="text-sm opacity-90">d'expertise</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                L'art du néon,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  réinventé pour vous
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-12">
                Chez NeonPulse, nous fusionnons l'artisanat traditionnel du néon avec les dernières 
                technologies LED. Notre atelier parisien est un lieu où chaque création est unique, 
                façonnée avec passion et précision pour transformer vos espaces en œuvres d'art lumineuses.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl border border-white/10">
                  <Heart className="w-8 h-8 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Passion & Expertise</h3>
                  <p className="text-gray-400">Chaque projet est une nouvelle aventure créative</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl border border-white/10">
                  <Zap className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-400">Technologies LED dernière génération</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Pourquoi Nous Choisir ?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une expertise unique pour des créations exceptionnelles
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">Qualité Premium</h3>
              <p className="text-gray-400">Matériaux haut de gamme et finitions impeccables pour une durabilité maximale</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-pink-400 transition-colors duration-300">Design Unique</h3>
              <p className="text-gray-400">Chaque création est personnalisée selon vos envies et votre espace</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">Livraison Express</h3>
              <p className="text-gray-400">Production et expédition en 48h pour votre satisfaction</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">Garantie 2 ans</h3>
              <p className="text-gray-400">Service après-vente réactif et professionnel à votre écoute</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&q=80"
            alt="Néon background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-block animate-pulse mb-8">
            <div className="text-sm font-medium px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Offre limitée
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Prêt à illuminer votre espace avec un
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mt-2">
              néon personnalisé ?
            </span>
          </h2>
          <Link 
            to="/product"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                     hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-medium px-8 py-4 
                     rounded-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span>Commander maintenant</span>
            <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;