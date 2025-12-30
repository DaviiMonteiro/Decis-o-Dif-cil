
import React, { useState, useEffect } from 'react';
import { DecisionType, Factor, Option, UserTier, AnalysisResult } from '../types';
import { analyzeDecision } from '../services/geminiService';
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, FileText, Download, CheckCircle2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WizardProps {
  tier: UserTier;
}

const DecisionWizard: React.FC<WizardProps> = ({ tier }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<DecisionType>(DecisionType.CAREER);
  const [description, setDescription] = useState('');
  const [factors, setFactors] = useState<Factor[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const addFactor = () => {
    const newFactor: Factor = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      weight: 5,
      type: 'rational',
      impact: 'positive'
    };
    setFactors([...factors, newFactor]);
  };

  const updateFactor = (id: string, updates: Partial<Factor>) => {
    setFactors(factors.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFactor = (id: string) => setFactors(factors.filter(f => f.id !== id));

  const addOption = () => {
    const newOption: Option = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      scores: {}
    };
    setOptions([...options, newOption]);
  };

  const updateOption = (id: string, name: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, name } : o));
  };

  const removeOption = (id: string) => setOptions(options.filter(o => o.id !== id));

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDecision(
        type,
        description,
        factors,
        options,
        tier === UserTier.PREMIUM
      );
      setResult(analysis);
      setStep(5);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro na análise. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render Logic
  if (step === 5 && result) {
    const chartData = [
      { subject: 'Racional', A: result.rationalScore, fullMark: 100 },
      { subject: 'Emocional', A: result.emotionalScore, fullMark: 100 },
      { subject: 'Sustentabilidade', A: 75, fullMark: 100 },
      { subject: 'Custo Oportunidade', A: 60, fullMark: 100 },
      { subject: 'Alinhamento Valores', A: 85, fullMark: 100 },
    ];

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Relatório de Análise</span>
              <h2 className="text-3xl font-bold mt-1">Conclusão Estratégica</h2>
            </div>
            {tier === UserTier.PREMIUM && (
              <button className="flex items-center gap-2 text-sm border border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
                <Download className="w-4 h-4" /> Exportar PDF
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="p-6 bg-gray-50 rounded-sm mb-6 border-l-4 border-black">
                <h4 className="text-sm font-bold uppercase mb-2 text-gray-500">Recomendação Principal</h4>
                <p className="text-xl font-bold text-black">{result.recommendedOption}</p>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{result.summary}"</p>
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase">Equilíbrio da Decisão</h4>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Decisão" dataKey="A" stroke="#000" fill="#000" fillOpacity={0.1} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-sm uppercase mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Cenários Projetados
                </h4>
                <div className="space-y-4">
                  {result.scenarios.map((s, idx) => (
                    <div key={idx} className="p-4 border border-gray-100 rounded-sm hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{s.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                          s.riskLevel === 'High' ? 'bg-red-50 text-red-600' : 
                          s.riskLevel === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {s.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{s.description}</p>
                      <span className="text-[10px] text-gray-400 font-medium">Probabilidade: {s.probability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h4 className="font-bold text-sm uppercase mb-4">Reflexão Profunda</h4>
            <p className="text-gray-700 leading-relaxed bg-black text-white p-6 rounded-sm shadow-inner">
              {result.deepInsight}
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
             <button 
              onClick={() => setStep(1)}
              className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
            >
              Iniciar Nova Análise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${step >= i ? 'bg-black' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passo {step} de 4</span>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-4xl font-bold mb-8">O que você está decidindo?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Object.values(DecisionType).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`p-6 text-sm border font-medium rounded-sm transition-all ${type === t ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva brevemente o dilema... Ex: Devo aceitar a proposta de emprego em Berlim ou ficar no cargo atual no Brasil?"
            className="w-full h-40 p-6 border border-gray-200 rounded-sm focus:border-black outline-none transition-all resize-none mb-8 text-lg"
          />
          <button 
            disabled={!description}
            onClick={() => setStep(2)}
            className="w-full bg-black text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            Próximo <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-4xl font-bold mb-2">Fatores de Influência</h2>
          <p className="text-gray-500 mb-8">O que importa nesta decisão? Defina os critérios e seus pesos.</p>
          
          <div className="space-y-4 mb-8">
            {factors.map(f => (
              <div key={f.id} className="p-6 border border-gray-200 rounded-sm group relative">
                <button onClick={() => removeFactor(f.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Nome do Fator</label>
                    <input
                      type="text"
                      value={f.name}
                      onChange={e => updateFactor(f.id, { name: e.target.value })}
                      placeholder="Ex: Salário, Tempo com Família, Risco..."
                      className="w-full border-b border-gray-300 focus:border-black outline-none py-1 text-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Peso (1-10)</label>
                      <input
                        type="range" min="1" max="10" step="1"
                        value={f.weight}
                        onChange={e => updateFactor(f.id, { weight: parseInt(e.target.value) })}
                        className="w-full accent-black"
                      />
                    </div>
                    <div className="flex flex-col">
                       <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Tipo</label>
                       <select 
                        value={f.type}
                        onChange={e => updateFactor(f.id, { type: e.target.value as any })}
                        className="text-xs font-bold border-b border-gray-300 outline-none"
                       >
                         <option value="rational">Racional</option>
                         <option value="emotional">Emocional</option>
                       </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addFactor} className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Fator
            </button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" /> Voltar
            </button>
            <button 
              disabled={factors.length === 0}
              onClick={() => setStep(3)}
              className="flex-1 bg-black text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50"
            >
              Próximo <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-4xl font-bold mb-2">Alternativas</h2>
          <p className="text-gray-500 mb-8">Quais são os caminhos possíveis? Liste pelo menos dois.</p>
          
          <div className="space-y-4 mb-8">
            {options.map(o => (
              <div key={o.id} className="p-6 border border-gray-200 rounded-sm relative">
                <button onClick={() => removeOption(o.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Nome da Opção</label>
                <input
                  type="text"
                  value={o.name}
                  onChange={e => updateOption(o.id, e.target.value)}
                  placeholder="Ex: Aceitar Berlim, Ficar no Brasil..."
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-1 text-xl font-medium"
                />
              </div>
            ))}
             <button onClick={addOption} className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Opção
            </button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5" /> Voltar
            </button>
            <button 
              disabled={options.length < 2}
              onClick={() => setStep(4)}
              className="flex-1 bg-black text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50"
            >
              Revisar e Analisar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-4xl font-bold mb-4">Pronto para a verdade?</h2>
          <p className="text-gray-500 mb-12 leading-relaxed">Nossa IA analisará agora o custo de oportunidade, os pesos que você definiu e gerará cenários de curto e longo prazo. Este é um processo rigoroso.</p>
          
          <div className="bg-gray-50 p-8 rounded-sm mb-12 space-y-4 border border-gray-100">
            <h4 className="text-xs font-bold uppercase text-gray-400">Resumo do Setup</h4>
            <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">Tipo:</span> <span className="font-bold">{type}</span>
            </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">Critérios:</span> <span className="font-bold">{factors.length}</span>
            </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">Alternativas:</span> <span className="font-bold">{options.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Nível de Análise:</span> 
              <span className={`font-bold ${tier === UserTier.PREMIUM ? 'text-purple-600' : 'text-gray-600'}`}>
                {tier === UserTier.PREMIUM ? 'Deep Engine (Premium)' : 'Basic Engine (Free)'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={isAnalyzing}
              onClick={() => setStep(3)} 
              className="flex-1 border border-gray-200 py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" /> Ajustar Dados
            </button>
            <button 
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="flex-1 bg-black text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 shadow-xl transition-all disabled:opacity-80"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analisando Vantagens...
                </>
              ) : (
                <>Gerar Relatório Final <CheckCircle2 className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionWizard;
