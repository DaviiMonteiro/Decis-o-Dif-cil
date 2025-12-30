
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Brain, Target } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <div className="mb-12 animate-fade-in">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-gray-500 bg-gray-100 rounded-full uppercase">
          Estratégia & Análise
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          O peso da escolha,<br />aliviado pela clareza.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          Transformamos dilemas emocionais em dados estruturados. Use nosso motor de decisão analítico para mapear cenários e agir com convicção.
        </p>
        <Link 
          to="/decide" 
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-sm font-medium hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl"
        >
          Começar Análise <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mt-20 text-left border-t border-gray-100 pt-20">
        <div>
          <Brain className="w-10 h-10 mb-6 text-gray-400" />
          <h3 className="text-xl font-bold mb-3">Motor Racional</h3>
          <p className="text-gray-500 leading-relaxed">Pese prós e contras usando algoritmos de utilidade esperada, removendo o ruído da ansiedade imediata.</p>
        </div>
        <div>
          <Target className="w-10 h-10 mb-6 text-gray-400" />
          <h3 className="text-xl font-bold mb-3">Simulação de Cenários</h3>
          <p className="text-gray-500 leading-relaxed">Visualize o futuro de cada opção em horizontes de 1, 5 e 10 anos antes de comprometer seus recursos.</p>
        </div>
        <div>
          <ShieldCheck className="w-10 h-10 mb-6 text-gray-400" />
          <h3 className="text-xl font-bold mb-3">Sóbrio e Direto</h3>
          <p className="text-gray-500 leading-relaxed">Sem promessas vazias. Entregamos uma análise fria e necessária para quem carrega grandes responsabilidades.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
