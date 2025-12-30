
import React, { useState } from 'react';
import { UserTier } from '../types';
import { MessageSquare, History, Calendar, Lock, Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithConsultant } from '../services/geminiService';

interface DashboardProps {
  tier: UserTier;
}

const Dashboard: React.FC<DashboardProps> = ({ tier }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'consultant'>('history');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Olá. Sou seu consultor analítico. Em que dilema posso ajudá-lo hoje com lógica e objetividade?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      // Map existing messages to the expected history format for context awareness
      const history = messages.map(m => ({ role: m.role, message: m.content }));
      const response = await chatWithConsultant(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Desculpe, tive um problema na conexão. Pode repetir?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-all ${activeTab === 'history' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <History className="w-4 h-4" /> Histórico
          </button>
          <button 
            onClick={() => setActiveTab('consultant')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-all ${activeTab === 'consultant' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <MessageSquare className="w-4 h-4" /> Consultor IA
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg min-h-[600px] flex flex-col">
          {activeTab === 'history' ? (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center">
              {tier === UserTier.FREE ? (
                <div className="max-w-sm">
                  <Lock className="w-12 h-12 mb-6 text-gray-200 mx-auto" />
                  <h3 className="text-xl font-bold mb-3">Histórico Bloqueado</h3>
                  <p className="text-gray-400 text-sm mb-8">Usuários Free não possuem salvamento de dados. Faça o upgrade para manter um diário estratégico de suas decisões.</p>
                  <button className="bg-black text-white px-6 py-3 text-sm font-bold rounded-sm hover:bg-gray-800 transition-all">
                    Ver Planos
                  </button>
                </div>
              ) : (
                <div className="w-full h-full space-y-6 text-left">
                  <h3 className="text-2xl font-bold mb-6">Suas Análises Passadas</h3>
                  <div className="border border-gray-100 p-6 rounded-sm hover:border-black transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 12 Jan, 2024
                      </span>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 font-bold rounded-full">CARREIRA</span>
                    </div>
                    <h4 className="text-lg font-bold">Aceitar proposta na Google ou continuar na Startup?</h4>
                    <p className="text-sm text-gray-500 mt-2">Recomendação: Google (Score Racional: 88%)</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {tier === UserTier.FREE ? (
                <div className="p-12 flex flex-col items-center justify-center h-full text-center bg-gray-50/30">
                  <div className="max-w-sm">
                    <MessageSquare className="w-12 h-12 mb-6 text-gray-200 mx-auto" />
                    <h3 className="text-xl font-bold mb-3">Consultoria Premium</h3>
                    <p className="text-gray-400 text-sm mb-8">O Consultor IA usa o Gemini 3 Pro para análises profundas de teoria dos jogos e viés cognitivo. Disponível apenas para assinantes.</p>
                    <button className="bg-black text-white px-6 py-3 text-sm font-bold rounded-sm hover:bg-gray-800 transition-all">
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {messages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-lg flex gap-3 ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                          <div className="flex-shrink-0 mt-1">
                            {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-4">
                    <input 
                      type="text" 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Fale sobre sua indecisão..."
                      className="flex-1 border border-gray-200 rounded-sm px-4 py-3 outline-none focus:border-black text-sm"
                    />
                    <button 
                      onClick={sendMessage}
                      className="bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-800 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
