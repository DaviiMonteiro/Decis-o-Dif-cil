
export enum DecisionType {
  CAREER = 'Carreira',
  RELATIONSHIP = 'Relacionamento',
  FINANCIAL = 'Financeiro',
  LIFE_CHANGE = 'Mudança de Vida',
  BUSINESS = 'Negócios'
}

export interface Factor {
  id: string;
  name: string;
  weight: number; // 1 to 10
  type: 'rational' | 'emotional';
  impact: 'positive' | 'negative';
}

export interface Option {
  id: string;
  name: string;
  scores: Record<string, number>; // Factor ID -> Score (1 to 10)
}

export interface Scenario {
  title: string;
  description: string;
  probability: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface AnalysisResult {
  summary: string;
  recommendedOption: string;
  rationalScore: number;
  emotionalScore: number;
  scenarios: Scenario[];
  deepInsight: string;
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}
