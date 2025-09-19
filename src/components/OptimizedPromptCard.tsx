'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';

interface OptimizedPromptCardProps {
  optimizedPrompt: string;
}

export function OptimizedPromptCard({ optimizedPrompt }: OptimizedPromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Optimized Prompt
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="ml-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </CardTitle>
        <p className="text-muted-foreground">
          Your optimized, copy-ready prompt is ready to use.
        </p>
      </CardHeader>
      <CardContent>
        <Textarea
          value={optimizedPrompt}
          readOnly
          className="min-h-[200px] font-mono text-sm"
        />
      </CardContent>
    </Card>
  );
}
