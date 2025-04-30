interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ExplanationModal({ isOpen, onClose }: ExplanationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 z-10 relative text-white shadow-2xl border border-gray-700">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-green-400 mb-4">Kaip žaisti</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-1">1. Apžiūrėkite aplinką</h3>
            <p className="text-gray-300">Jūs matote gatvės vaizdą. Apsidairykite tempiant pelę.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-1">2. Atspėkite vietą</h3>
            <p className="text-gray-300">Spustelėkite žemėlapyje, kur manote yra šis vaizdas. Žyma bus padėta jūsų pasirinktoje vietoje.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-1">3. Patvirtinkite spėjimą</h3>
            <p className="text-gray-300">Paspauskite mygtuką "Spėti", kad patvirtintumėte savo atsakymą.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-1">4. Rezultatai</h3>
            <p className="text-gray-300">Pamatysite, kur iš tikrųjų buvo vieta (raudona žyma) ir atstumą. Kuo arčiau, tuo daugiau taškų!</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-1">5. Žaidimo tikslas</h3>
            <p className="text-gray-300">Žaiskite penkis turus ir surinkite kuo daugiau taškų. Patobulinkite savo geografijos įgūdžius!</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
        >
          Supratau!
        </button>
      </div>
    </div>
  );
}

export default ExplanationModal;