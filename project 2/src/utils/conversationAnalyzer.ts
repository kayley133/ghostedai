import { AnalysisResult, Issue, Suggestion, RiskFactor } from '../types/conversation';

export class ConversationAnalyzer {
  private static readonly PATTERNS = {
    // Communication issues
    excessive_questions: /\?.*\?.*\?/g,
    one_word_responses: /\b(ok|yes|no|maybe|sure|fine)\b\.?\s*$/gim,
    interrupting: /\b(but|however|actually|well actually)\b/gi,
    
    // Timing issues
    rapid_fire_messages: /(.{1,50}\n){3,}/g,
    delayed_responses: /\b(sorry for the late reply|sorry i just saw this|been busy)\b/gi,
    
    // Oversharing indicators
    personal_details: /\b(my ex|my therapist|my medication|my problems|my trauma)\b/gi,
    negative_venting: /\b(hate|horrible|awful|terrible|worst|can't stand)\b/gi,
    
    // Interest level indicators
    enthusiasm_markers: /!{2,}|[A-Z]{3,}|\b(love|amazing|awesome|excited|can't wait)\b/gi,
    disengagement: /\b(busy|swamped|hectic|whatever|don't care|not interested)\b/gi,
    
    // Boundary issues
    pushy_behavior: /\b(you should|you need to|you have to|why don't you)\b/gi,
    inappropriate_questions: /\b(how much do you make|are you single|what's your address)\b/gi
  };

  static analyze(text: string): AnalysisResult {
    const issues: Issue[] = [];
    const suggestions: Suggestion[] = [];
    const riskFactors: RiskFactor[] = [];
    const strengths: string[] = [];

    // Analyze communication patterns
    this.analyzeCommunicationStyle(text, issues, suggestions);
    
    // Analyze timing and pacing
    this.analyzeTimingIssues(text, issues, suggestions);
    
    // Analyze boundaries and appropriateness
    this.analyzeBoundaries(text, issues, riskFactors);
    
    // Analyze interest and engagement
    this.analyzeEngagement(text, issues, strengths, suggestions);
    
    // Calculate overall score
    const overallScore = this.calculateScore(issues, strengths);
    
    return {
      overallScore,
      issues,
      strengths,
      suggestions,
      riskFactors
    };
  }

  private static analyzeCommunicationStyle(text: string, issues: Issue[], suggestions: Suggestion[]) {
    // Check for excessive questioning
    const questionMatches = text.match(this.PATTERNS.excessive_questions);
    if (questionMatches && questionMatches.length > 2) {
      issues.push({
        category: 'communication',
        title: 'Too Many Questions',
        description: 'You may have overwhelmed them with multiple questions at once.',
        severity: 'medium',
        examples: questionMatches.slice(0, 2)
      });
      
      suggestions.push({
        category: 'Communication',
        title: 'Ask one question at a time',
        description: 'Allow them to respond to one question before asking another. This creates a more natural flow.',
        actionable: true
      });
    }

    // Check for one-word responses received
    const oneWordMatches = text.match(this.PATTERNS.one_word_responses);
    if (oneWordMatches && oneWordMatches.length > 3) {
      issues.push({
        category: 'interest',
        title: 'Received Short Responses',
        description: 'They gave mostly brief, low-effort responses indicating decreased interest.',
        severity: 'high',
        examples: oneWordMatches.slice(0, 3)
      });
    }

    // Check for interrupting patterns
    const interruptMatches = text.match(this.PATTERNS.interrupting);
    if (interruptMatches && interruptMatches.length > 2) {
      issues.push({
        category: 'communication',
        title: 'Interrupting or Contradicting',
        description: 'You may have frequently interrupted or contradicted their statements.',
        severity: 'medium',
        examples: interruptMatches.slice(0, 2)
      });
    }
  }

  private static analyzeTimingIssues(text: string, issues: Issue[], suggestions: Suggestion[]) {
    // Check for rapid-fire messaging
    const rapidMessages = text.match(this.PATTERNS.rapid_fire_messages);
    if (rapidMessages && rapidMessages.length > 1) {
      issues.push({
        category: 'timing',
        title: 'Message Flooding',
        description: 'Sending multiple messages in quick succession can feel overwhelming.',
        severity: 'medium',
        examples: ['Multiple consecutive short messages']
      });
      
      suggestions.push({
        category: 'Timing',
        title: 'Give them space to respond',
        description: 'Wait for their response before sending additional messages. Quality over quantity.',
        actionable: true
      });
    }

    // Check for delayed response patterns
    const delayedMatches = text.match(this.PATTERNS.delayed_responses);
    if (delayedMatches && delayedMatches.length > 0) {
      issues.push({
        category: 'timing',
        title: 'Inconsistent Response Times',
        description: 'Delayed responses may indicate conflicting priorities or interest levels.',
        severity: 'low',
        examples: delayedMatches.slice(0, 2)
      });
    }
  }

  private static analyzeBoundaries(text: string, issues: Issue[], riskFactors: RiskFactor[]) {
    // Check for oversharing personal details
    const personalMatches = text.match(this.PATTERNS.personal_details);
    if (personalMatches && personalMatches.length > 1) {
      issues.push({
        category: 'boundaries',
        title: 'Oversharing Personal Information',
        description: 'Sharing very personal details too early can make others uncomfortable.',
        severity: 'high',
        examples: personalMatches.slice(0, 2)
      });
      
      riskFactors.push({
        type: 'Boundary Issues',
        description: 'Oversharing personal information early in relationships',
        impact: 'high'
      });
    }

    // Check for pushy behavior
    const pushyMatches = text.match(this.PATTERNS.pushy_behavior);
    if (pushyMatches && pushyMatches.length > 2) {
      issues.push({
        category: 'boundaries',
        title: 'Pushy or Controlling Language',
        description: 'Using commanding language can feel controlling and push people away.',
        severity: 'high',
        examples: pushyMatches.slice(0, 2)
      });
    }

    // Check for inappropriate questions
    const inappropriateMatches = text.match(this.PATTERNS.inappropriate_questions);
    if (inappropriateMatches && inappropriateMatches.length > 0) {
      riskFactors.push({
        type: 'Inappropriate Questions',
        description: 'Asking personal or invasive questions too early',
        impact: 'high'
      });
    }
  }

  private static analyzeEngagement(text: string, issues: Issue[], strengths: string[], suggestions: Suggestion[]) {
    // Check for enthusiasm markers
    const enthusiasmMatches = text.match(this.PATTERNS.enthusiasm_markers);
    if (enthusiasmMatches && enthusiasmMatches.length > 2) {
      strengths.push('Showed genuine enthusiasm and excitement');
    }

    // Check for disengagement patterns
    const disengagementMatches = text.match(this.PATTERNS.disengagement);
    if (disengagementMatches && disengagementMatches.length > 1) {
      issues.push({
        category: 'interest',
        title: 'Signs of Disengagement',
        description: 'The conversation showed clear signs of decreased interest or availability.',
        severity: 'high',
        examples: disengagementMatches.slice(0, 2)
      });
    }

    // Check for negative venting
    const negativeMatches = text.match(this.PATTERNS.negative_venting);
    if (negativeMatches && negativeMatches.length > 3) {
      issues.push({
        category: 'communication',
        title: 'Excessive Negativity',
        description: 'The conversation may have been dominated by complaints or negative topics.',
        severity: 'medium',
        examples: ['Multiple negative expressions detected']
      });
      
      suggestions.push({
        category: 'Tone',
        title: 'Balance negative topics with positive ones',
        description: 'Try to maintain a more balanced conversation with both challenges and positive aspects.',
        actionable: true
      });
    }

    // Add general engagement suggestions
    if (issues.some(issue => issue.category === 'interest')) {
      suggestions.push({
        category: 'Engagement',
        title: 'Ask engaging, open-ended questions',
        description: 'Focus on questions that invite storytelling and deeper conversation.',
        actionable: true
      });
    }
  }

  private static calculateScore(issues: Issue[], strengths: string[]): number {
    let score = 85; // Start with a good baseline
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });
    
    // Add points for strengths
    score += strengths.length * 5;
    
    // Ensure score stays within bounds
    return Math.max(0, Math.min(100, score));
  }
}