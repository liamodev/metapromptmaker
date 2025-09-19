import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callAnthropic(prompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Latest Claude model
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to call Anthropic API');
  }
}
