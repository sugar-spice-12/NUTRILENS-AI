import React, { useState, useCallback, useMemo } from 'react';
import { HealthProfile, Meal, View } from './types';
import HealthProfileForm from './components/HealthProfileForm';
import Dashboard from './components/Dashboard';
import MealScanner from './components/MealScanner';
import DietPlan from './components/DietPlan';
import Header from './components/common/Header';

export default function App(): React.ReactNode {
  const [view, setView] = useState<View>(View.PROFILE);
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [mealLog, setMealLog] = useState<Meal[]>([]);

  const handleProfileSave = useCallback((profile: HealthProfile) => {
    setHealthProfile(profile);
    setView(View.DASHBOARD);
  }, []);

  const handleLogMeal = useCallback((meal: Meal) => {
    setMealLog(prevLog => [...prevLog, meal]);
    setView(View.DASHBOARD);
  }, []);

  const navigateTo = (newView: View) => {
    setView(newView);
  };
  
  const mainContent = useMemo(() => {
    if (!healthProfile) {
      return <HealthProfileForm onSave={handleProfileSave} />;
    }

    switch (view) {
      case View.DASHBOARD:
        return <Dashboard mealLog={mealLog} healthProfile={healthProfile} navigateTo={navigateTo} />;
      case View.SCANNER:
        return <MealScanner onMealLogged={handleLogMeal} />;
      case View.DIET_PLAN:
        return <DietPlan healthProfile={healthProfile} />;
      default:
        return <Dashboard mealLog={mealLog} healthProfile={healthProfile} navigateTo={navigateTo} />;
    }
  }, [view, healthProfile, mealLog, handleProfileSave, handleLogMeal]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header healthProfile={healthProfile} currentView={view} navigateTo={navigateTo} />
      <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        {mainContent}
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        NutriLens AI &copy; 2024. All dietary information is AI-generated and should be verified with a healthcare professional.
      </footer>
    </div>
  );
}