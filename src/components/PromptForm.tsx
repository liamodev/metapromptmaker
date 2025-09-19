'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PackSelector } from './PackSelector';
import { Loader2 } from 'lucide-react';

interface PromptFormProps {
  onOptimize: (rawPrompt: string, packKey?: string) => void;
  isLoading?: boolean;
}

export function PromptForm({ onOptimize, isLoading = false }: PromptFormProps) {
  const [rawPrompt, setRawPrompt] = useState('');
  const [selectedPack, setSelectedPack] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawPrompt.trim()) {
      onOptimize(rawPrompt.trim(), selectedPack || undefined);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Meta Prompt Maker
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Turn rough ideas into precise prompts—built for investment teams.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Paste your initial prompt here (one line or long form)..."
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pack" className="text-sm font-medium">
              Use-Case Pack (Optional)
            </label>
            <p className="text-xs text-muted-foreground">
              Select a pack to bias clarifiers toward specific investment use cases
            </p>
            <PackSelector
              value={selectedPack}
              onValueChange={setSelectedPack}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!rawPrompt.trim() || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing prompt...
              </>
            ) : (
              'Optimize'
            )}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">What is meta-prompting?</h3>
          <p className="text-sm text-muted-foreground">
            Instead of wrestling with the perfect wording, let AI ask you the 5–6 questions that matter. 
            You answer quickly; it returns a cleaner, more targeted prompt you can copy or run.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
