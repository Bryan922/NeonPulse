import React, { useState } from 'react';
import { ShoppingCart, Star, Shield, Truck, Check, ArrowRight, Heart, Zap, Sparkles, Type, Palette, Ruler } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const fonts = [
  { id: 'dancing', name: 'Dancing Script', preview: 'Élégant et fluide' },
  { id: 'roboto', name: 'Roboto', preview: 'Modern et épuré' },
  { id: 'playfair', name: 'Playfair Display', preview: 'Classique et raffiné' },
  { id: 'pacifico', name: 'Pacifico', preview: 'Fun et décontracté' },
  { id: 'montserrat', name: 'Montserrat', preview: 'Contemporain' }
];

const colors = {
  purple: { color: '#8B5CF6', glow: '#6D28D9' },
  blue: { color: '#3B82F6', glow: '#1D4ED8' },
  pink: { color: '#EC4899', glow: '#BE185D' },
  red: { color: '#EF4444', glow: '#B91C1C' },
  green: { color: '#10B981', glow: '#047857' },
  yellow: { color: '#F59E0B', glow: '#B45309' },
  white: { color: '#FFFFFF', glow: '#A1A1AA' }
};

const pricePacks = {
  4: 63,
  5: 72,
  6: 81,
  8: 90,
  10: 108
};

function ProductPage() {
  const [text, setText] = useState('Mon Néon');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [selectedColor, setSelectedColor] = useState('purple');
  const addToCart = useCartStore((state) => state.addToCart);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value.slice(0, 10); // Limite à 10 caractères
    setText(newText);
  };

  const getPrice = () => {
    const letterCount = text.length;
    if (letterCount <= 4) return pricePacks[4];
    if (letterCount <= 5) return pricePacks[5];
    if (letterCount <= 6) return pricePacks[6];
    if (letterCount <= 8) return pricePacks[8];
    return pricePacks[10];
  };

  const handleAddToCart = () => {
    const customization = {
      text,
      font: selectedFont.id,
      color: selectedColor,
      letterCount: text.length
    };

    addToCart('neon-custom', 1, customization);
    toast.success('Votre néon personnalisé a été ajouté au panier !');
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Prévisualisation */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black p-1">
                <div className="absolute inset-1 backdrop-blur-xl bg-black/90 rounded-lg flex items-center justify-center">
                  <h1 
                    className={`text-6xl font-${selectedFont.id} transition-all duration-300`}
                    style={{
                      color: colors[selectedColor].color,
                      textShadow: `0 0 10px ${colors[selectedColor].glow}, 
                                 0 0 20px ${colors[selectedColor].glow}, 
                                 0 0 30px ${colors[selectedColor].glow}`
                    }}
                  >
                    {text || 'Mon Néon'}
                  </h1>
                </div>
              </div>
            </div>

            {/* Configurateur */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Personnalisez votre néon</h2>
                <div className="space-y-6">
                  {/* Texte */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Type className="w-4 h-4 inline-block mr-2" />
                      Votre texte (max. 10 caractères)
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={handleTextChange}
                      maxLength={10}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Entrez votre texte..."
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      {10 - text.length} caractères restants
                    </p>
                  </div>

                  {/* Police */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Type className="w-4 h-4 inline-block mr-2" />
                      Police d'écriture
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {fonts.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFont(font)}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left
                            ${selectedFont.id === font.id 
                              ? 'border-purple-500 bg-purple-500/20' 
                              : 'border-white/10 bg-white/5 hover:border-purple-500/50'}`}
                        >
                          <div className={`text-lg font-${font.id} mb-1`}>{font.name}</div>
                          <div className="text-sm text-gray-400">{font.preview}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Couleur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Palette className="w-4 h-4 inline-block mr-2" />
                      Couleur
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(colors).map(([colorName, { color }]) => (
                        <button
                          key={colorName}
                          onClick={() => setSelectedColor(colorName)}
                          className={`w-12 h-12 rounded-full transition-transform duration-200 hover:scale-110
                            ${selectedColor === colorName ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-110' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Packs de prix */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Nos packs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="text-lg font-bold mb-1">Pack 4</div>
                        <div className="text-sm text-gray-400">Jusqu'à 4 lettres</div>
                        <div className="text-xl font-bold text-purple-400 mt-2">{pricePacks[4]}€</div>
                      </div>
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="text-lg font-bold mb-1">Pack 5</div>
                        <div className="text-sm text-gray-400">Jusqu'à 5 lettres</div>
                        <div className="text-xl font-bold text-purple-400 mt-2">{pricePacks[5]}€</div>
                      </div>
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="text-lg font-bold mb-1">Pack 6</div>
                        <div className="text-sm text-gray-400">Jusqu'à 6 lettres</div>
                        <div className="text-xl font-bold text-purple-400 mt-2">{pricePacks[6]}€</div>
                      </div>
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="text-lg font-bold mb-1">Pack 8</div>
                        <div className="text-sm text-gray-400">Jusqu'à 8 lettres</div>
                        <div className="text-xl font-bold text-purple-400 mt-2">{pricePacks[8]}€</div>
                      </div>
                      <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="text-lg font-bold mb-1">Pack 10</div>
                        <div className="text-sm text-gray-400">Jusqu'à 10 lettres</div>
                        <div className="text-xl font-bold text-purple-400 mt-2">{pricePacks[10]}€</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prix et commande */}
              <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Prix total</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {getPrice()} €
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Délai de fabrication</div>
                    <div className="text-lg font-semibold text-purple-400">5-7 jours</div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                           hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-medium p-4 
                           rounded-xl transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-200"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Commander mon néon
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Paiement sécurisé
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Livraison offerte
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;