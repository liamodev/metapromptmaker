import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function callGoogle(prompt: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Google API error:', error);
    throw new Error('Failed to call Google API');
  }
}
