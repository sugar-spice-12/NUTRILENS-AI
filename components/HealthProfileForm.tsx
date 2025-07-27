import React, { useState } from 'react';
import { HealthProfile } from '../types';
import { HEALTH_CONDITIONS } from '../constants';
import Card from './common/Card';
import Button from './common/Button';
import { Icon } from './common/Icon';

interface HealthProfileFormProps {
  onSave: (profile: HealthProfile) => void;
}

const HealthProfileForm: React.FC<HealthProfileFormProps> = ({ onSave }) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleToggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ conditions: selectedConditions.length > 0 ? selectedConditions : ["None"] });
  };

  return (
    <Card className="max-w-lg mx-auto">
      <div className="text-center">
        <Icon name="logo" className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Welcome to NutriLens AI</h2>
        <p className="mt-2 text-sm text-slate-600">
          To personalize your experience, please select any health conditions that apply to you. This will help us tailor your recommendations.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HEALTH_CONDITIONS.map(condition => {
            const isSelected = selectedConditions.includes(condition);
            return (
              <label
                key={condition}
                className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200'
                    : 'bg-white border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleCondition(condition)}
                  className="sr-only" // Hide the default checkbox
                />
                <span className="flex-grow text-sm font-medium text-slate-800">{condition}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      <Icon name="check" className="h-3 w-3" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
        <Button type="submit">
          Save and Continue
        </Button>
      </form>
    </Card>
  );
};

export default HealthProfileForm;