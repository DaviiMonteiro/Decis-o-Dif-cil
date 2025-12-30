
import React from 'react';
import { UserTier } from '../types';
import { Check, Shield, Zap, Sparkles } from 'lucide-react';

interface PricingProps {
  currentTier: UserTier;
  onSelect: (tier: UserTier) => void;
}

const Pricing: React.FC<PricingProps> = ({ currentTier, onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Escolha seu nível de clareza</h2>
        <p className="text-gray-500">Decisões simples exigem lógica básica. Decisões de vida exigem profundidade.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className={`p-10 border-2 rounded-lg transition-all ${currentTier === UserTier.FREE ? 'border-black' : 'border-gray-100 hover:border-gray-200'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Zap className="w-10 h-10 mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold">Grátis</h3>
              <p className="text-gray-400 text-sm">Para dilemas cotidianos</p>
            </div>
            <span className="text-2xl font-bold">R$ 0</span>
          </div>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500" /> Decisões simples</li>
            <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500" /> Resultado resumido</li>
            <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500" /> Até 3 fatores de análise</li>
            <li className="text-gray-300 flex items-center gap-3 text-sm"><Check className="w-4 h-4" /> Sem histórico salvo</li>
          </ul>
          <button 
            onClick={() => onSelect(UserTier.FREE)}
            className={`w-full py-4 rounded-sm font-bold transition-all ${currentTier === UserTier.FREE ? 'bg-black text-white' : 'border border-black text-black hover:bg-black hover:text-white'}`}
          >
            {currentTier === UserTier.FREE ? 'Plano Atual' : 'Selecionar'}
          </button>
        </div>

        <div className={`p-10 border-2 rounded-lg relative transition-all shadow-xl bg-white ${currentTier === UserTier.PREMIUM ? 'border-black' : 'border-gray-100 hover:border-gray-200'}`}>
          <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-black text-white text-[10px] font-bold px-4 py-1 uppercase tracking-widest rounded-full">
            Mais Vendido
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Sparkles className="w-10 h-10 mb-4 text-black" />
              <h3 className="text-2xl font-bold">Premium</h3>
              <p className="text-gray-400 text-sm">Para momentos cruciais</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">R$ 49</span>
              <span className="text-xs block text-gray-400 font-medium">pagamento único</span>
            </div>
          </div>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-green-500" /> Análise profunda (Gemini 3 Pro)</li>
            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-green-500" /> Relatórios detalhados em PDF</li>
            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-green-500" /> Histórico completo de decisões</li>
            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-green-500" /> Consultor IA exclusivo 24/7</li>
            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check className="w-4 h-4 text-green-500" /> Simulações de 10 anos</li>
          </ul>
          <button 
            onClick={() => onSelect(UserTier.PREMIUM)}
            className={`w-full py-4 rounded-sm font-bold transition-all shadow-lg ${currentTier === UserTier.PREMIUM ? 'bg-black text-white cursor-default' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {currentTier === UserTier.PREMIUM ? 'Assinante Premium' : 'Adquirir Agora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
