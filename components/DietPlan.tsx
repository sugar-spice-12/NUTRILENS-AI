
import React, { useState, useEffect } from 'react';
import { HealthProfile } from '../types';
import * as geminiService from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface DietPlanProps {
  healthProfile: HealthProfile;
}

// A simple markdown parser that handles ### headings and **bold** text.
const SimpleMarkdown = ({ text }: { text: string }): React.ReactNode => {
  // Function to render inline formatting like **bold**
  const renderWithInlineFormatting = (line: string): React.ReactNode => {
    // Split by the bold markdown syntax, keeping the delimiters
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // If the part is bold, render it as a <strong> element
        return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
      }
      // Otherwise, return the text as is
      return part;
    });
  };

  const elements = text.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('###')) {
      return (
        <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-2">
          {renderWithInlineFormatting(trimmedLine.replace(/###/g, '').trim())}
        </h3>
      );
    }
    if (trimmedLine.length > 0) {
      return <p key={index} className="text-slate-700 my-2">{renderWithInlineFormatting(line)}</p>;
    }
    return null;
  }).filter(Boolean); // Filter out any null elements from empty lines

  return <div className="prose prose-slate max-w-none">{elements}</div>;
};


const DietPlan = ({ healthProfile }: DietPlanProps): React.ReactNode => {
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDietPlan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const plan = await geminiService.generateDietPlan(healthProfile);
        setDietPlan(plan);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDietPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthProfile]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Your AI-Generated Diet Plan</h2>
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner />
          <p className="mt-4 text-slate-600">Generating your personalized plan...</p>
        </div>
      )}
      {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</div>}
      {dietPlan && (
        <div className="mt-4 p-4 bg-slate-50/70 rounded-lg">
            <SimpleMarkdown text={dietPlan} />
        </div>
      )}
    </Card>
  );
};

export default DietPlan;