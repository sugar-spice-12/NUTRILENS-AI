import React from 'react';
import { HealthProfile, View } from '../../types';
import { Icon } from './Icon';

interface HeaderProps {
  healthProfile: HealthProfile | null;
  currentView: View;
  navigateTo: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ healthProfile, currentView, navigateTo }) => {
  const navLinkClasses = (view: View) => 
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      currentView === view 
        ? 'text-indigo-600 bg-indigo-100' 
        : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Icon name="logo" className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">NutriLens AI</h1>
        </div>
        {healthProfile && (
          <nav className="hidden sm:flex items-center space-x-2">
            <button onClick={() => navigateTo(View.DASHBOARD)} className={navLinkClasses(View.DASHBOARD)}>
              Dashboard
            </button>
            <button onClick={() => navigateTo(View.SCANNER)} className={navLinkClasses(View.SCANNER)}>
              Scan Meal
            </button>
            <button onClick={() => navigateTo(View.DIET_PLAN)} className={navLinkClasses(View.DIET_PLAN)}>
              AI Diet Plan
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;