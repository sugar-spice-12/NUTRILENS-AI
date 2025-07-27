import React, { useState, useCallback } from 'react';
import { FoodItem, Meal, Nutrients } from '../types';
import * as geminiService from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { Icon } from './common/Icon';
import NutritionReport from './NutritionReport';

interface MealScannerProps {
  onMealLogged: (meal: Meal) => void;
}

const MealScanner: React.FC<MealScannerProps> = ({ onMealLogged }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await geminiService.analyzeFoodImage(imageFile);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleLogMeal = useCallback(() => {
    if (!analysis) return;
    const totalNutrients = analysis.reduce(
        (totals: Nutrients, item: FoodItem) => ({
            calories: totals.calories + item.calories,
            protein: totals.protein + item.protein,
            carbohydrates: totals.carbohydrates + item.carbohydrates,
            fats: totals.fats + item.fats,
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );

    const newMeal: Meal = {
      id: new Date().toISOString(),
      items: analysis,
      timestamp: new Date(),
      totalNutrients,
    };
    onMealLogged(newMeal);
  }, [analysis, onMealLogged]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Scan Your Meal</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-2">Upload a photo of your food:</label>
          <div className="mt-1 flex justify-center p-6 border-2 border-slate-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Icon name="upload" className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {imagePreview && (
          <div className="text-center bg-slate-50 p-4 rounded-lg">
            <img src={imagePreview} alt="Meal preview" className="mx-auto max-h-60 rounded-lg shadow-md" />
          </div>
        )}

        {imageFile && !analysis && (
            <Button onClick={handleAnalyze} isLoading={isLoading}>
              {isLoading ? 'Analyzing Meal...' : 'Analyze Meal'}
            </Button>
        )}

        {isLoading && !analysis && (
          <div className="flex items-center justify-center space-x-2 text-slate-600 py-4">
            <Spinner /> <span>Analyzing your meal with AI...</span>
          </div>
        )}
        
        {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</div>}

        {analysis && (
            <>
                <NutritionReport analysis={analysis} />
                <Button onClick={handleLogMeal}>
                    Add to Daily Log
                </Button>
            </>
        )}
      </div>
    </Card>
  );
};

export default MealScanner;