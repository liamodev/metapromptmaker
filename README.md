# Meta Prompt Maker

Turn rough ideas into precise prompts—built for investment teams.

## Overview

Meta Prompt Maker is a web application that helps users optimize their prompts through an AI-powered clarification process. Instead of struggling with prompt wording, the AI asks 5-6 targeted questions and returns a polished, copy-ready prompt that can optionally be run across multiple AI models (OpenAI GPT-4o, Anthropic Claude, Google Gemini) for comparison.

## Features

- **Smart Prompt Optimization**: AI analyzes your prompt and asks clarifying questions
- **Use-Case Packs**: Pre-built templates for investment industry scenarios
- **Multi-Model Runner**: Compare outputs across GPT-4o, Claude, and Gemini
- **Analytics & Tracking**: Anonymous usage analytics and performance metrics
- **Rate Limiting**: Built-in protection against abuse
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Server Actions
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **AI Providers**: OpenAI, Anthropic, Google Generative AI
- **Validation**: Zod
- **Styling**: Tailwind CSS with Inter font

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```bash
   # Database
   DATABASE_URL="your-neon-database-url"

   # API Keys
   OPENAI_API_KEY="your-openai-key"
   ANTHROPIC_API_KEY="your-anthropic-key"
   GOOGLE_API_KEY="your-google-key"

   # Security
   RATE_LIMIT_SALT="your-random-salt"

   # Branding
   ALTITUDE_BRAND_COLOR="#0F2B5B"
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Use Case Packs

The application includes pre-built use-case packs for investment firms:

- **LinkedIn Post**: Professional social media content
- **Investment Memo**: Structured investment analysis
- **RFP Response**: Request for proposal responses
- **Compliance Note**: Regulatory communications
- **Client Email**: Professional client communications
- **Portfolio Commentary**: Investment performance commentary

## API Endpoints

- `POST /api/optimize` - Generate clarifying questions
- `POST /api/finalize` - Create optimized prompt
- `POST /api/run` - Run prompt across selected AI models
- `POST /api/analytics` - Log usage events

## Rate Limits

- General API: 60 requests/hour
- Optimization: 20 requests/hour
- Model runs: 10 requests/hour

## Database Schema

- **Session**: User sessions with IP hashing
- **PromptRecord**: Complete prompt optimization records
- **Event**: Analytics and usage tracking

## Security Features

- IP address hashing for privacy
- Rate limiting by IP
- Input validation with Zod
- CORS protection
- Environment variable protection

## Deployment

1. Deploy to Vercel
2. Configure environment variables
3. Set up Neon database connection
4. Configure custom domain (e.g., meta.altitude7.com)

## Built by

Altitude Global Advisors

## Disclaimer

Outputs may contain errors. Review before use. Nothing here is investment advice.