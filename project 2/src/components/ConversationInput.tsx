import React, { useState } from 'react';
import { Upload, MessageSquare, Mic, FileText, Settings, Sparkles } from 'lucide-react';
import { LLMConfigModal } from './LLMConfigModal';
import { LLMConfig } from '../types/conversation';

interface ConversationInputProps {
  onAnalyze: (text: string, type: 'transcript' | 'description' | 'recording', useLLM?: boolean) => void;
  isAnalyzing: boolean;
}

export const ConversationInput: React.FC<ConversationInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState<'transcript' | 'description' | 'recording'>('description');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  const [llmConfig, setLLMConfig] = useState<LLMConfig | null>(null);
  const [useLLM, setUseLLM] = useState(false);

  // Load LLM config from localStorage on component mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('llm-config');
    if (savedConfig) {
      try {
        setLLMConfig(JSON.parse(savedConfig));
        setUseLLM(true);
      } catch (error) {
        console.error('Failed to load LLM config:', error);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAnalyze(inputText, inputType, useLLM && llmConfig ? true : false);
    }
  };

  const handleLLMConfigSave = (config: LLMConfig) => {
    setLLMConfig(config);
    localStorage.setItem('llm-config', JSON.stringify(config));
    setUseLLM(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => file.type === 'text/plain');
    
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setInputType('transcript');
      };
      reader.readAsText(textFile);
    }
  };

  const inputTypes = [
    { value: 'description', label: 'Describe what happened', icon: MessageSquare },
    { value: 'transcript', label: 'Paste conversation', icon: FileText },
    { value: 'recording', label: 'Audio summary', icon: Mic }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Conversation</h2>
          <p className="text-gray-600">
            Help us understand what happened so we can provide insights and suggestions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Analysis Method Selection */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium text-gray-800">Analysis Method</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLLMConfig(true)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Settings className="w-4 h-4 mr-1" />
                Configure AI
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="radio"
                  name="analysisMethod"
                  checked={!useLLM}
                  onChange={() => setUseLLM(false)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800">Local Analysis</div>
                  <div className="text-sm text-gray-600">Fast, private, rule-based analysis</div>
                </div>
              </label>
              
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors ${
                !llmConfig ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <input
                  type="radio"
                  name="analysisMethod"
                  checked={useLLM}
                  onChange={() => setUseLLM(true)}
                  disabled={!llmConfig}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800 flex items-center">
                    AI Analysis
                    <Sparkles className="w-4 h-4 ml-1 text-purple-500" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {llmConfig ? 'Advanced AI-powered insights' : 'Configure AI to enable'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Input Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inputTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setInputType(type.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    inputType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium text-sm">{type.label}</div>
                </button>
              );
            })}
          </div>

          {/* Text Input Area */}
          <div className="relative">
            <div
              className={`border-2 border-dashed rounded-lg transition-colors duration-200 ${
                isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  inputType === 'description'
                    ? "Describe the conversation that didn't go well. What was said? How did it unfold? Include as many details as you remember..."
                    : inputType === 'transcript'
                    ? "Paste the conversation text here (you can also drag and drop a text file)..."
                    : "Describe what was said in the audio conversation. Include tone, pauses, and context..."
                }
                className="w-full h-64 p-4 border-0 resize-none focus:outline-none bg-transparent text-gray-700 placeholder-gray-500"
                disabled={isAnalyzing}
              />
              
              {!inputText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Type your story or drag a text file here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{inputText.length} characters</span>
            <span className="text-xs">
              {inputText.length < 100 && "More details will help provide better insights"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing || (useLLM && !llmConfig)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {useLLM ? 'AI is analyzing...' : 'Analyzing conversation...'}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {useLLM && <Sparkles className="w-5 h-5 mr-2" />}
                {useLLM ? 'Analyze with AI' : 'Analyze Conversation'}
              </div>
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Your privacy is protected</h3>
              <p className="mt-1 text-sm text-green-700">
                {useLLM 
                  ? "When using AI analysis, your conversation is sent securely to your chosen AI provider. Local analysis happens entirely in your browser."
                  : "All analysis happens locally in your browser. Your conversation details are never sent to any server."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <LLMConfigModal
        isOpen={showLLMConfig}
        onClose={() => setShowLLMConfig(false)}
        onSave={handleLLMConfigSave}
        currentConfig={llmConfig || undefined}
      />
    </>
  );
};