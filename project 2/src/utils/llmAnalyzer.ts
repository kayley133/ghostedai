import { AnalysisResult, LLMConfig } from '../types/conversation';

export class LLMAnalyzer {
  private static readonly ANALYSIS_PROMPT = `
You are an expert communication coach and relationship advisor. Analyze the following conversation that didn't go well and provide detailed, empathetic feedback.

Please analyze the conversation for:
1. Communication patterns and issues
2. Timing and pacing problems
3. Boundary violations or inappropriate behavior
4. Signs of disinterest or disengagement
5. Missed social cues
6. Oversharing or undersharing
7. Tone and emotional intelligence issues

Provide your analysis in the following JSON format:
{
  "overallScore": number (0-100),
  "summary": "A compassionate 2-3 sentence summary of what happened",
  "issues": [
    {
      "category": "communication|timing|boundaries|interest|social-cues|oversharing",
      "title": "Brief issue title",
      "description": "Detailed explanation of the issue",
      "severity": "low|medium|high",
      "examples": ["specific examples from the conversation"]
    }
  ],
  "strengths": ["things they did well"],
  "suggestions": [
    {
      "category": "category name",
      "title": "suggestion title",
      "description": "detailed actionable advice",
      "actionable": true
    }
  ],
  "riskFactors": [
    {
      "type": "risk type",
      "description": "explanation of concerning pattern",
      "impact": "low|medium|high"
    }
  ]
}

Be honest but kind. Focus on growth and learning. Avoid being judgmental.

Conversation to analyze:
`;

  static async analyzeWithLLM(text: string, config: LLMConfig): Promise<AnalysisResult> {
    try {
      const response = await this.callLLMAPI(text, config);
      const analysis = JSON.parse(response);
      
      return {
        ...analysis,
        analysisMethod: 'llm' as const
      };
    } catch (error) {
      console.error('LLM analysis failed:', error);
      throw new Error('Failed to analyze conversation with AI. Please check your API configuration.');
    }
  }

  private static async callLLMAPI(text: string, config: LLMConfig): Promise<string> {
    const prompt = this.ANALYSIS_PROMPT + text;

    switch (config.provider) {
      case 'openai':
        return this.callOpenAI(prompt, config);
      case 'anthropic':
        return this.callAnthropic(prompt, config);
      case 'custom':
        return this.callCustomAPI(prompt, config);
      default:
        throw new Error('Unsupported LLM provider');
    }
  }

  private static async callOpenAI(prompt: string, config: LLMConfig): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful communication coach. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callAnthropic(prompt: string, config: LLMConfig): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private static async callCustomAPI(prompt: string, config: LLMConfig): Promise<string> {
    if (!config.endpoint) {
      throw new Error('Custom API endpoint is required');
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        prompt,
        model: config.model
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.content || data.text;
  }
}