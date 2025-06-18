import React from 'react';
import { AnalysisResult } from '../types/conversation';
import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp, TrendingDown, AlertCircle, Sparkles, Brain } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Score */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mr-3">Conversation Analysis</h2>
          {result.analysisMethod === 'llm' && (
            <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Powered
            </div>
          )}
          {result.analysisMethod === 'local' && (
            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <Brain className="w-4 h-4 mr-1" />
              Local Analysis
            </div>
          )}
        </div>
        
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBackground(result.overallScore)} mb-4`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
        </div>

        {/* AI Summary */}
        {result.summary && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 italic">"{result.summary}"</p>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          {result.overallScore >= 80 
            ? "This conversation went relatively well! There are just a few minor areas for improvement."
            : result.overallScore >= 60
            ? "The conversation had some challenges, but with a few adjustments, future interactions could go much better."
            : "This conversation had several significant issues that likely contributed to the outcome. The good news is that these are all learnable skills."
          }
        </p>

        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Analyze Another Conversation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issues Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingDown className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Areas for Improvement</h3>
          </div>

          {result.issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No major issues detected! You handled the conversation well.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {result.issues.map((issue, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {getSeverityIcon(issue.severity)}
                      <h4 className="font-semibold text-gray-800 ml-2">{issue.title}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{issue.description}</p>
                  
                  {issue.examples.length > 0 && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {issue.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span className="italic">"{example}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strengths Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">What You Did Well</h3>
          </div>

          {result.strengths.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>While there were challenges, every conversation is a learning opportunity.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.strengths.map((strength, index) => (
                <div key={index} className="flex items-start bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Actionable Suggestions</h3>
        </div>

        {result.suggestions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            You're doing great! Keep up the good work in your conversations.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h4>
                    <p className="text-gray-600 text-sm">{suggestion.description}</p>
                    {suggestion.actionable && (
                      <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Factors Section */}
      {result.riskFactors.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Important Considerations</h3>
          </div>

          <div className="space-y-4">
            {result.riskFactors.map((factor, index) => (
              <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-red-800">{factor.type}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    factor.impact === 'high' ? 'bg-red-200 text-red-800' :
                    factor.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {factor.impact} impact
                  </span>
                </div>
                <p className="text-red-700">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Remember</h3>
        <p className="text-blue-100">
          Every conversation is a learning opportunity. The fact that you're here analyzing and wanting to improve 
          shows emotional intelligence and growth mindset. These skills can be developed with practice and awareness.
        </p>
      </div>
    </div>
  );
};