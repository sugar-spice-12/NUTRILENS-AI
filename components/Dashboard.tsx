import React from 'react';
import { Meal, HealthProfile, Nutrients, View } from '../types';
import Card from './common/Card';
import { Icon } from './common/Icon';
import Button from './common/Button';

interface DashboardProps {
  mealLog: Meal[];
  healthProfile: HealthProfile;
  navigateTo: (view: View) => void;
}

const NutrientCard: React.FC<{ icon: string; label: string; value: string; colorClass: string }> = ({ icon, label, value, colorClass }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl text-center">
        <Icon name={icon} className={`h-7 w-7 mb-2 ${colorClass}`}/>
        <p className="text-xl font-semibold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ mealLog, navigateTo }) => {
  const dailyTotals = React.useMemo<Nutrients>(() => {
    return mealLog.reduce(
      (totals, meal) => {
        return {
          calories: totals.calories + meal.totalNutrients.calories,
          protein: totals.protein + meal.totalNutrients.protein,
          carbohydrates: totals.carbohydrates + meal.totalNutrients.carbohydrates,
          fats: totals.fats + meal.totalNutrients.fats,
        };
      },
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );
  }, [mealLog]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NutrientCard icon="calories" label="Calories" value={`${Math.round(dailyTotals.calories)}`} colorClass="text-red-500" />
          <NutrientCard icon="protein" label="Protein" value={`${Math.round(dailyTotals.protein)}g`} colorClass="text-blue-500" />
          <NutrientCard icon="carbs" label="Carbs" value={`${Math.round(dailyTotals.carbohydrates)}g`} colorClass="text-yellow-500" />
          <NutrientCard icon="fat" label="Fats" value={`${Math.round(dailyTotals.fats)}g`} colorClass="text-purple-500" />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Button onClick={() => navigateTo(View.SCANNER)} variant="primary">Scan a New Meal</Button>
         <Button onClick={() => navigateTo(View.DIET_PLAN)} variant="secondary">
            Get AI Diet Plan
         </Button>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-900">Meal Log</h2>
        {mealLog.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="logo" className="mx-auto h-12 w-12 text-slate-300"/>
            <p className="mt-4 font-semibold text-slate-600">You haven't logged any meals yet.</p>
            <p className="text-sm text-slate-400 mt-1">Click "Scan a New Meal" to get started!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {mealLog.slice().reverse().map(meal => (
              <div key={meal.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">
                  Meal logged at {meal.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
                <ul className="mt-2 text-sm text-slate-600 list-disc list-inside">
                  {meal.items.map(item => (
                    <li key={item.name}>
                      <span className="font-medium">{item.name}</span>: {Math.round(item.calories)} kcal
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;