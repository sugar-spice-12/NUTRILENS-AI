import React from 'react';
import { FoodItem, Nutrients } from '../types';

interface NutritionReportProps {
  analysis: FoodItem[];
}

const NutritionReport: React.FC<NutritionReportProps> = ({ analysis }) => {
  const totalNutrients = React.useMemo<Nutrients>(() => {
    return analysis.reduce(
      (totals, item) => {
        return {
          calories: totals.calories + item.calories,
          protein: totals.protein + item.protein,
          carbohydrates: totals.carbohydrates + item.carbohydrates,
          fats: totals.fats + item.fats,
        };
      },
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );
  }, [analysis]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-slate-800">Nutritional Analysis</h3>
      {analysis.length === 0 && <p className="text-slate-500 mt-2">No food items were recognized in the image.</p>}
      {analysis.length > 0 && (
         <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-slate-300">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Food Item</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Calories</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Protein (g)</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Carbs (g)</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Fat (g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {analysis.map((item, index) => (
                      <tr key={item.name} className={index % 2 === 0 ? undefined : 'bg-slate-50'}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-0">{item.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{Math.round(item.calories)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.protein.toFixed(1)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.carbohydrates.toFixed(1)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.fats.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                   <tfoot className="bg-slate-50">
                        <tr>
                            <th scope="row" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Total</th>
                            <td className="px-3 py-3.5 text-sm font-semibold text-slate-900">{Math.round(totalNutrients.calories)}</td>
                            <td className="px-3 py-3.5 text-sm font-semibold text-slate-900">{totalNutrients.protein.toFixed(1)}</td>
                            <td className="px-3 py-3.5 text-sm font-semibold text-slate-900">{totalNutrients.carbohydrates.toFixed(1)}</td>
                            <td className="px-3 py-3.5 text-sm font-semibold text-slate-900">{totalNutrients.fats.toFixed(1)}</td>
                        </tr>
                    </tfoot>
                </table>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default NutritionReport;