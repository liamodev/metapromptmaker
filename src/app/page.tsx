'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PromptForm } from '@/components/PromptForm';
import { ClarifierForm } from '@/components/ClarifierForm';
import { OptimizedPromptCard } from '@/components/OptimizedPromptCard';
import { ModelRunner } from '@/components/ModelRunner';

interface ClarifierQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'multiselect';
  options?: string[];
  required?: boolean;
}

interface ModelResults {
  results: {
    openai?: string | null;
    anthropic?: string | null;
    google?: string | null;
  };
  timings: Record<string, number>;
  errors?: Record<string, string>;
}

export default function HomePage() {
  const [step, setStep] = useState<'prompt' | 'clarifiers' | 'optimized'>('prompt');
  const [sessionId, setSessionId] = useState<string>('');
  const [rawPrompt, setRawPrompt] = useState<string>('');
  const [packKey, setPackKey] = useState<string | undefined>();
  const [clarifiers, setClarifiers] = useState<ClarifierQuestion[]>([]);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [promptRecordId, setPromptRecordId] = useState<string>('');
  const [modelResults, setModelResults] = useState<ModelResults | undefined>();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isRunningModels, setIsRunningModels] = useState(false);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    // Log page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        kind: 'page_view',
        data: { page: 'home' }
      })
    }).catch(console.error);
  }, []);

  const handleOptimize = async (prompt: string, selectedPack?: string) => {
    setIsOptimizing(true);
    setRawPrompt(prompt);
    setPackKey(selectedPack);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: prompt,
          packKey: selectedPack,
          sessionId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClarifiers(data.clarifiers);
        setStep('clarifiers');
      } else {
        console.error('Optimization failed:', data.error);
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Optimization error:', error);
      // TODO: Show error toast
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleFinalize = async (answers: Record<string, any>) => {
    setIsFinalizing(true);

    try {
      const response = await fetch('/api/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt,
          packKey,
          clarifiers,
          clarifierAnswers: answers,
          sessionId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOptimizedPrompt(data.optimizedPrompt);
        setPromptRecordId(data.promptRecordId);
        setStep('optimized');
      } else {
        console.error('Finalization failed:', data.error);
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Finalization error:', error);
      // TODO: Show error toast
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleRunModels = async (models: { openai?: boolean; anthropic?: boolean; google?: boolean }) => {
    setIsRunningModels(true);

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optimizedPrompt,
          promptRecordId,
          models,
          sessionId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setModelResults({
          results: data.results,
          timings: data.timings,
          errors: data.errors,
        });
      } else {
        console.error('Model run failed:', data.error);
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Model run error:', error);
      // TODO: Show error toast
    } finally {
      setIsRunningModels(false);
    }
  };

  const handleStartOver = () => {
    setStep('prompt');
    setRawPrompt('');
    setPackKey(undefined);
    setClarifiers([]);
    setOptimizedPrompt('');
    setPromptRecordId('');
    setModelResults(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 space-y-8">
        {step === 'prompt' && (
          <PromptForm onOptimize={handleOptimize} isLoading={isOptimizing} />
        )}
        
        {step === 'clarifiers' && (
          <ClarifierForm 
            questions={clarifiers} 
            onSubmit={handleFinalize} 
            isLoading={isFinalizing}
          />
        )}
        
        {step === 'optimized' && (
          <>
            <OptimizedPromptCard optimizedPrompt={optimizedPrompt} />
            <ModelRunner
              optimizedPrompt={optimizedPrompt}
              promptRecordId={promptRecordId}
              onRun={handleRunModels}
              results={modelResults}
              isLoading={isRunningModels}
            />
            <div className="flex justify-center">
              <button
                onClick={handleStartOver}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Start over with a new prompt
              </button>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}