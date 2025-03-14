import React from 'react';

interface LegalPageProps {
  type: 'mentions-legales' | 'cgv' | 'confidentialite';
}

const COMPANY_INFO = {
  name: 'NeonPulse',
  address: '60 route de Luxembourg',
  city: 'Bous',
  postalCode: '5402',
  capital: '1,400,000€',
};

function LegalPage({ type }: LegalPageProps) {
  const renderLegalNotice = () => (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Informations légales</h2>
          <p className="text-gray-300">
            Le site {COMPANY_INFO.name} est édité par la société {COMPANY_INFO.name}, société au capital de {COMPANY_INFO.capital}, 
            dont le siège social est situé au {COMPANY_INFO.address}, {COMPANY_INFO.postalCode} {COMPANY_INFO.city}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
          <p className="text-gray-300">
            Le site est hébergé par Netlify Inc., situé au 2325 3rd Street, Suite 215, San Francisco, California 94107.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-300">
            L'ensemble du site, y compris sa structure et son contenu (textes, images, photos, logos, etc.), 
            est protégé par le droit d'auteur et le droit des marques. Toute reproduction, représentation, 
            modification ou adaptation totale ou partielle du site ou de son contenu, par quelque procédé 
            que ce soit et sur quelque support que ce soit, est interdite sans autorisation expresse et 
            préalable de {COMPANY_INFO.name}.
          </p>
        </section>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div>
      <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
          <p className="text-gray-300">
            Les présentes conditions générales de vente régissent les relations contractuelles entre 
            {COMPANY_INFO.name} et ses clients dans le cadre de la vente de néons LED personnalisés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Prix et paiement</h2>
          <p className="text-gray-300">
            Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire. 
            La commande sera traitée dès réception du paiement intégral.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Livraison</h2>
          <p className="text-gray-300">
            Les délais de livraison sont de 5 à 7 jours ouvrés. Les frais de livraison sont offerts 
            en France métropolitaine.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Garantie</h2>
          <p className="text-gray-300">
            Nos produits sont garantis 2 ans contre tout défaut de fabrication. Cette garantie ne 
            couvre pas les dommages résultant d'une mauvaise utilisation du produit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Droit de rétractation</h2>
          <p className="text-gray-300">
            Le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer 
            son droit de rétractation. Les frais de retour sont à la charge du client.
          </p>
        </section>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div>
      <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
          <p className="text-gray-300">
            Nous collectons les données personnelles suivantes : nom, prénom, adresse email, adresse 
            postale et numéro de téléphone. Ces informations sont nécessaires pour le traitement de 
            vos commandes et la livraison de vos produits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
          <p className="text-gray-300">
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
            <li>Le traitement de vos commandes</li>
            <li>La gestion de votre compte client</li>
            <li>L'amélioration de nos services</li>
            <li>L'envoi de newsletters (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Protection des données</h2>
          <p className="text-gray-300">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
            protéger vos données personnelles contre toute perte, altération ou accès non autorisé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Vos droits</h2>
          <p className="text-gray-300">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement 
            et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en nous 
            contactant par email.
          </p>
        </section>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          {type === 'mentions-legales' && renderLegalNotice()}
          {type === 'cgv' && renderTerms()}
          {type === 'confidentialite' && renderPrivacy()}
        </div>
      </div>
    </div>
  );
}

export default LegalPage;