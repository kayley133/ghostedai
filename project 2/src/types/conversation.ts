export interface ConversationInput {
  id: string;
  text: string;
  type: 'transcript' | 'description' | 'recording';
  timestamp: Date;
}

export interface AnalysisResult {
  overallScore: number;
  issues: Issue[];
  strengths: string[];
  suggestions: Suggestion[];
  riskFactors: RiskFactor[];
  summary: string;
  analysisMethod: 'local' | 'llm';
}

export interface Issue {
  category: 'communication' | 'timing' | 'boundaries' | 'interest' | 'social-cues' | 'oversharing';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  examples: string[];
}

export interface Suggestion {
  category: string;
  title: string;
  description: string;
  actionable: boolean;
}

export interface RiskFactor {
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model?: string;
  endpoint?: string;
}