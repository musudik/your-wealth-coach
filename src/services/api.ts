/**
 * API service for communicating with the financial advice API
 */
import { API_CONFIG } from '../config';

/**
 * Interface for the request payload
 */
interface FinancialAdviceRequest {
  query: string;
  userId?: string;
  context?: string;
}

/**
 * Interface for the response from the API
 */
interface FinancialAdviceResponse {
  response: string;
  confidence: number;
  sources?: string[];
  relatedTopics?: string[];
}

/**
 * Get financial advice from the API
 * @param query The user's question or request
 * @param userId Optional user ID for personalized responses
 * @param context Optional context from previous conversation
 * @returns Promise with the API response
 */
export const getFinancialAdvice = async (
  query: string,
  userId?: string,
  context?: string
): Promise<FinancialAdviceResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(API_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        query,
        userId,
        context,
      } as FinancialAdviceRequest),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as FinancialAdviceResponse;
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    throw error;
  }
};

/**
 * Mock function for development/testing when API is not available
 * @param query The user's question or request
 * @returns Promise with a mock response
 */
export const getMockFinancialAdvice = async (query: string): Promise<FinancialAdviceResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple keyword matching for demo purposes
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('retirement')) {
    return {
      response: "For retirement planning, I recommend starting early and taking advantage of compound interest. Consider maximizing contributions to tax-advantaged accounts like 401(k)s and IRAs. Aim to save at least 15% of your income for retirement.",
      confidence: 0.95,
      sources: ["Retirement Planning Guide", "IRS Publication 590-A"],
      relatedTopics: ["401(k)", "IRA", "Social Security", "Pension Plans"]
    };
  } else if (lowerQuery.includes('invest') || lowerQuery.includes('stock')) {
    return {
      response: "When investing in stocks, diversification is key to managing risk. Consider a mix of index funds, ETFs, and individual stocks based on your risk tolerance. For most people, a low-cost index fund tracking the S&P 500 is a good foundation.",
      confidence: 0.92,
      sources: ["Investment Fundamentals", "Modern Portfolio Theory"],
      relatedTopics: ["Asset Allocation", "Risk Management", "Dollar-Cost Averaging"]
    };
  } else if (lowerQuery.includes('debt') || lowerQuery.includes('loan')) {
    return {
      response: "To manage debt effectively, prioritize high-interest debt first (like credit cards), then work on lower-interest debts. Consider the debt avalanche method for optimal interest savings or the debt snowball method for psychological wins.",
      confidence: 0.89,
      sources: ["Debt Management Strategies", "Consumer Financial Protection Bureau"],
      relatedTopics: ["Credit Score", "Debt Consolidation", "Refinancing"]
    };
  } else if (lowerQuery.includes('budget') || lowerQuery.includes('saving')) {
    return {
      response: "A solid budget follows the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your spending for a month to identify areas where you can cut back and increase your savings rate.",
      confidence: 0.94,
      sources: ["Personal Finance Basics", "Budgeting Techniques"],
      relatedTopics: ["Emergency Fund", "Expense Tracking", "Financial Goals"]
    };
  } else if (lowerQuery.includes('tax') || lowerQuery.includes('taxes')) {
    return {
      response: "Tax optimization strategies include maximizing retirement contributions, harvesting tax losses, using tax-advantaged accounts, and timing income and deductions. Consider consulting with a tax professional for personalized advice.",
      confidence: 0.87,
      sources: ["Tax Planning Guide", "IRS Publications"],
      relatedTopics: ["Tax Deductions", "Tax Credits", "Capital Gains", "Tax-Loss Harvesting"]
    };
  } else if (lowerQuery.includes('real estate') || lowerQuery.includes('property')) {
    return {
      response: "Real estate can be a valuable part of your investment portfolio. Consider factors like location, market trends, rental income potential, and financing options. For many, starting with a primary residence is the first step into real estate investing.",
      confidence: 0.91,
      sources: ["Real Estate Investment Guide", "Property Market Analysis"],
      relatedTopics: ["Rental Properties", "REITs", "Mortgage Options", "Property Appreciation"]
    };
  } else if (lowerQuery.includes('insurance')) {
    return {
      response: "A comprehensive insurance strategy should include health insurance, life insurance (especially if you have dependents), disability insurance, auto and home insurance, and potentially umbrella liability coverage. Review your policies annually to ensure adequate coverage.",
      confidence: 0.93,
      sources: ["Insurance Planning Basics", "Risk Management Strategies"],
      relatedTopics: ["Life Insurance", "Health Insurance", "Property Insurance", "Liability Coverage"]
    };
  } else {
    return {
      response: "I'd be happy to help with your financial questions. Could you provide more details about what specific aspect of personal finance you're interested in? I can advise on investments, retirement planning, budgeting, debt management, or tax optimization.",
      confidence: 0.75,
      relatedTopics: ["Investing", "Retirement", "Budgeting", "Debt Management", "Tax Planning"]
    };
  }
};

// Export the appropriate function based on configuration
export default API_CONFIG.USE_MOCK_API ? getMockFinancialAdvice : getFinancialAdvice; 