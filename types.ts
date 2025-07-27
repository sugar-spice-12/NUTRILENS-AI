
export interface HealthProfile {
  conditions: string[];
}

export interface Nutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface FoodItem extends Nutrients {
  name: string;
}

export interface Meal {
  id: string;
  items: FoodItem[];
  timestamp: Date;
  totalNutrients: Nutrients;
}

export enum View {
  PROFILE,
  DASHBOARD,
  SCANNER,
  DIET_PLAN,
}
