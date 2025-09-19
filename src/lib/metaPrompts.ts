import { UseCasePack } from './packs';

export const CLARIFIER_GENERATION_PROMPT = `You are designing exactly 5–6 clarifying questions to improve a user's prompt for an enterprise LLM.

Context:
- The user works in/with investment firms.
- The raw prompt is provided below.
- If a Use-Case Pack is provided, prefer finance-relevant phrasing and hints.

Return JSON only with this exact structure:
{
  "questions": [
    {
      "id": "unique_id",
      "label": "Question text",
      "type": "text|textarea|dropdown|checkbox|multiselect",
      "options": ["option1", "option2"] // only for dropdown/multiselect
      "required": true|false
    }
  ]
}

Types to use:
- text: Short single-line input
- textarea: Multi-line text input
- dropdown: Single selection from options
- checkbox: Yes/no or enable/disable
- multiselect: Multiple selections from options

Guidelines:
- Pick types that minimize typing while improving specificity
- Use dropdown for tone, multiselect for audience
- Avoid hype and jargon
- Be concise and precise
- Focus on information that would materially improve the prompt's effectiveness
- Prefer finance-relevant terminology
- Return exactly 5-6 questions

RAW_PROMPT:
"""
{{rawPrompt}}
"""

USE_CASE_PACK:
{{packJSON}}`;

export const PROMPT_OPTIMIZATION_PROMPT = `You are optimizing a user's prompt to be more specific, actionable, and effective for enterprise LLM use.

Context:
- The user works in investment/finance
- You have their raw prompt and their answers to clarifying questions
- Create a single, copy-ready optimized prompt

Requirements:
- Include clear task definition
- Specify audience when provided
- Include constraints verbatim
- Add style/tone guidance (minimal but concrete)
- Include any provided facts; do not fabricate
- End with: "If any detail is unclear, ask 1–2 clarifying questions before answering."

Structure the optimized prompt clearly with:
1. Task/objective
2. Context and audience (if provided)
3. Specific requirements from answers
4. Tone/style guidance
5. Constraints
6. The clarification clause

RAW_PROMPT:
"""
{{rawPrompt}}
"""

USER_ANSWERS:
{{answers}}

USE_CASE_PACK:
{{packKey}}

Return only the optimized prompt text, nothing else.`;

export function buildClarifierPrompt(rawPrompt: string, pack?: UseCasePack): string {
  const packJSON = pack ? JSON.stringify(pack, null, 2) : 'None';
  
  return CLARIFIER_GENERATION_PROMPT
    .replace('{{rawPrompt}}', rawPrompt)
    .replace('{{packJSON}}', packJSON);
}

export function buildOptimizationPrompt(
  rawPrompt: string, 
  answers: Record<string, any>, 
  packKey?: string
): string {
  const answersJSON = JSON.stringify(answers, null, 2);
  
  return PROMPT_OPTIMIZATION_PROMPT
    .replace('{{rawPrompt}}', rawPrompt)
    .replace('{{answers}}', answersJSON)
    .replace('{{packKey}}', packKey || 'None');
}
