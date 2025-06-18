import React, { useState } from 'react';
import { MessageCircle, Heart, Brain } from 'lucide-react';
import { ConversationInput } from './components/ConversationInput';
import { AnalysisResults } from './components/AnalysisResults';
import { ConversationAnalyzer } from './utils/conversationAnalyzer';
import { LLMAnalyzer } from './utils/llmAnalyzer';
import { AnalysisResult, LLMConfig } from './types/conversation';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, type: 'transcript' | 'description' | 'recording', useLLM = false) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let result: AnalysisResult;
      
      if (useLLM) {
        // Get LLM config from localStorage
        const savedConfig = localStorage.getItem('llm-config');
        if (!savedConfig) {
          throw new Error('LLM configuration not found. Please configure your AI settings.');
        }
        
        const llmConfig: LLMConfig = JSON.parse(savedConfig);
        result = await LLMAnalyzer.analyzeWithLLM(text, llmConfig);
      } else {
        // Simulate analysis delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = ConversationAnalyzer.analyze(text);
        result.analysisMethod = 'local';
      }
      
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Failed</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <AnalysisResults result={analysisResult} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full mr-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conversation Insights
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Understand what went wrong in your conversations and learn how to improve future interactions.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <Brain className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <Heart className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Empathetic Insights</span>
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Actionable Advice</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <ConversationInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </main>

      {/* How It Works Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Share Your Story</h3>
              <p className="text-gray-600">
                Describe what happened, paste a conversation, or summarize an audio call. 
                Choose between local analysis or advanced AI insights.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Analysis</h3>
              <p className="text-gray-600">
                Our system analyzes communication patterns, timing, boundaries, and engagement 
                to identify what might have gone wrong.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Improve & Grow</h3>
              <p className="text-gray-600">
                Receive actionable suggestions and learn specific techniques to have 
                better conversations in the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            Made with care to help people improve their communication skills and build better relationships.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;