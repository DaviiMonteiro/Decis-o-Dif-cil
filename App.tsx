
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import DecisionWizard from './components/DecisionWizard';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import { UserTier } from './types';

const App: React.FC = () => {
  const [tier, setTier] = useState<UserTier>(UserTier.FREE);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#1a1a1a]">
        <Header tier={tier} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/decide" element={<DecisionWizard tier={tier} />} />
            <Route path="/pricing" element={<Pricing currentTier={tier} onSelect={setTier} />} />
            <Route path="/dashboard" element={<Dashboard tier={tier} />} />
          </Routes>
        </main>
        <footer className="py-12 px-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Decisão Difícil. O rigor da lógica, o respeito à emoção.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
