
import React from 'react';
import { Link } from 'react-router-dom';
import { UserTier } from '../types';
import { Scale, CreditCard, LayoutDashboard, Compass } from 'lucide-react';

interface HeaderProps {
  tier: UserTier;
}

const Header: React.FC<HeaderProps> = ({ tier }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <Scale className="w-6 h-6 text-black group-hover:rotate-12 transition-transform" />
        <span className="text-xl font-bold tracking-tight uppercase">Decisão Difícil</span>
      </Link>
      
      <nav className="flex items-center gap-8 text-sm font-medium">
        <Link to="/decide" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
          <Compass className="w-4 h-4" /> Nova Decisão
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Histórico
        </Link>
        <Link to="/pricing" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
          <CreditCard className="w-4 h-4" /> {tier === UserTier.PREMIUM ? 'Premium' : 'Upgrade'}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
