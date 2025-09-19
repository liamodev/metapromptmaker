export interface ClarifierOption {
  value: string;
  label: string;
}

export interface PackClarifier {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'multiselect';
  options?: ClarifierOption[];
  required?: boolean;
  placeholder?: string;
}

export interface UseCasePack {
  key: string;
  name: string;
  description: string;
  seedClarifiers: PackClarifier[];
}

export const USE_CASE_PACKS: UseCasePack[] = [
  {
    key: 'linkedin_post',
    name: 'LinkedIn Post',
    description: 'Professional social media content for investment firms',
    seedClarifiers: [
      {
        id: 'audience',
        label: 'Who is your primary audience?',
        type: 'multiselect',
        options: [
          { value: 'cio', label: 'CIO' },
          { value: 'coo', label: 'COO' },
          { value: 'fo_principal', label: 'FO Principal' },
          { value: 'lps', label: 'LPs' },
          { value: 'pms', label: 'Portfolio Managers' },
          { value: 'ic', label: 'Investment Committee' }
        ],
        required: true
      },
      {
        id: 'goal',
        label: 'What action should the reader take?',
        type: 'dropdown',
        options: [
          { value: 'download', label: 'Download resource' },
          { value: 'book_call', label: 'Book a call' },
          { value: 'follow', label: 'Follow/Connect' },
          { value: 'reply', label: 'Reply/Comment' },
          { value: 'visit_url', label: 'Visit URL' }
        ],
        required: true
      },
      {
        id: 'tone',
        label: 'Preferred tone',
        type: 'dropdown',
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'concise', label: 'Concise' },
          { value: 'expert', label: 'Expert' },
          { value: 'persuasive', label: 'Persuasive' }
        ],
        required: false
      },
      {
        id: 'compliance',
        label: 'Any compliance or legal constraints to honor?',
        type: 'checkbox',
        required: false
      },
      {
        id: 'key_insight',
        label: 'Single key insight to emphasize',
        type: 'text',
        required: false
      }
    ]
  },
  {
    key: 'investment_memo',
    name: 'Investment Memo',
    description: 'Structured investment analysis and recommendations',
    seedClarifiers: [
      {
        id: 'strategy_type',
        label: 'Strategy type',
        type: 'dropdown',
        options: [
          { value: 'long_short_equity', label: 'L/S Equity' },
          { value: 'credit', label: 'Credit' },
          { value: 'macro', label: 'Macro' },
          { value: 'vc', label: 'VC' },
          { value: 'pe', label: 'PE' }
        ],
        required: true
      },
      {
        id: 'time_horizon',
        label: 'Time horizon & benchmark',
        type: 'text',
        placeholder: 'e.g., 3-5 years vs S&P 500',
        required: false
      },
      {
        id: 'risk_constraints',
        label: 'Risk constraints',
        type: 'text',
        placeholder: 'e.g., VaR bands, max drawdown',
        required: false
      },
      {
        id: 'evidence_type',
        label: 'Evidence type required',
        type: 'multiselect',
        options: [
          { value: 'data', label: 'Data/Statistics' },
          { value: 'citations', label: 'Citations' },
          { value: 'charts', label: 'Charts/Graphs' },
          { value: 'case_studies', label: 'Case Studies' }
        ],
        required: false
      },
      {
        id: 'memo_audience',
        label: 'Primary audience',
        type: 'dropdown',
        options: [
          { value: 'ic', label: 'Investment Committee' },
          { value: 'pms', label: 'Portfolio Managers' },
          { value: 'risk', label: 'Risk Team' },
          { value: 'board', label: 'Board' }
        ],
        required: true
      }
    ]
  },
  {
    key: 'rfp_response',
    name: 'RFP Response',
    description: 'Request for Proposal responses',
    seedClarifiers: [
      {
        id: 'rfp_type',
        label: 'RFP type',
        type: 'text',
        placeholder: 'e.g., Institutional mandate, consultant search',
        required: true
      },
      {
        id: 'key_requirements',
        label: 'Key requirements to address',
        type: 'textarea',
        placeholder: 'List the main requirements from the RFP',
        required: true
      }
    ]
  },
  {
    key: 'compliance_note',
    name: 'Compliance Note',
    description: 'Regulatory and compliance communications',
    seedClarifiers: [
      {
        id: 'regulation_type',
        label: 'Regulation/rule type',
        type: 'text',
        placeholder: 'e.g., SEC, FINRA, MiFID II',
        required: true
      },
      {
        id: 'urgency',
        label: 'Urgency level',
        type: 'dropdown',
        options: [
          { value: 'immediate', label: 'Immediate' },
          { value: 'urgent', label: 'Urgent' },
          { value: 'normal', label: 'Normal' },
          { value: 'low', label: 'Low' }
        ],
        required: true
      }
    ]
  },
  {
    key: 'client_email',
    name: 'Client Email',
    description: 'Professional client communications',
    seedClarifiers: [
      {
        id: 'client_type',
        label: 'Client type',
        type: 'dropdown',
        options: [
          { value: 'institutional', label: 'Institutional' },
          { value: 'family_office', label: 'Family Office' },
          { value: 'consultant', label: 'Consultant' },
          { value: 'prospect', label: 'Prospect' }
        ],
        required: true
      },
      {
        id: 'email_purpose',
        label: 'Email purpose',
        type: 'dropdown',
        options: [
          { value: 'update', label: 'Update/Report' },
          { value: 'request', label: 'Request' },
          { value: 'response', label: 'Response' },
          { value: 'follow_up', label: 'Follow-up' }
        ],
        required: true
      }
    ]
  },
  {
    key: 'portfolio_commentary',
    name: 'Portfolio Commentary',
    description: 'Investment performance and market commentary',
    seedClarifiers: [
      {
        id: 'time_period',
        label: 'Time period',
        type: 'dropdown',
        options: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'annual', label: 'Annual' },
          { value: 'custom', label: 'Custom Period' }
        ],
        required: true
      },
      {
        id: 'performance_context',
        label: 'Performance context',
        type: 'text',
        placeholder: 'e.g., +2.3% vs benchmark -1.1%',
        required: false
      },
      {
        id: 'key_themes',
        label: 'Key market themes to address',
        type: 'textarea',
        placeholder: 'List main themes or events that impacted performance',
        required: false
      }
    ]
  }
];

export function getPackByKey(key: string): UseCasePack | undefined {
  return USE_CASE_PACKS.find(pack => pack.key === key);
}
