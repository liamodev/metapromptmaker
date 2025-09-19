'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Clock, AlertCircle } from 'lucide-react';

interface ModelRunnerProps {
  optimizedPrompt: string;
  promptRecordId: string;
  onRun: (models: ModelSelection) => void;
  results?: ModelResults;
  isLoading?: boolean;
}

interface ModelSelection {
  openai?: boolean;
  anthropic?: boolean;
  google?: boolean;
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

export function ModelRunner({ 
  optimizedPrompt, 
  promptRecordId, 
  onRun, 
  results,
  isLoading = false 
}: ModelRunnerProps) {
  const [selectedModels, setSelectedModels] = useState<ModelSelection>({
    openai: false,
    anthropic: false,
    google: false,
  });

  const handleModelChange = (model: keyof ModelSelection, checked: boolean) => {
    setSelectedModels(prev => ({
      ...prev,
      [model]: checked
    }));
  };

  const handleRun = () => {
    if (Object.values(selectedModels).some(Boolean)) {
      onRun(selectedModels);
    }
  };

  const hasSelectedModels = Object.values(selectedModels).some(Boolean);
  const hasResults = results && Object.values(results.results).some(result => result !== null);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Multi-Model Runner</CardTitle>
        <p className="text-muted-foreground">
          Optionally run your optimized prompt across multiple AI models to compare outputs.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Models to Run</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="openai"
                checked={selectedModels.openai}
                onCheckedChange={(checked) => handleModelChange('openai', checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="openai" className="text-sm font-medium">
                GPT-4o
              </label>
              <Badge variant="outline" className="text-xs">OpenAI</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anthropic"
                checked={selectedModels.anthropic}
                onCheckedChange={(checked) => handleModelChange('anthropic', checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="anthropic" className="text-sm font-medium">
                Claude 3.5 Sonnet
              </label>
              <Badge variant="outline" className="text-xs">Anthropic</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="google"
                checked={selectedModels.google}
                onCheckedChange={(checked) => handleModelChange('google', checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="google" className="text-sm font-medium">
                Gemini 1.5 Pro
              </label>
              <Badge variant="outline" className="text-xs">Google</Badge>
            </div>
          </div>

          <Button
            onClick={handleRun}
            disabled={!hasSelectedModels || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running models...
              </>
            ) : (
              'Run Selected Models'
            )}
          </Button>
        </div>

        {hasResults && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Results</h3>
            
            <Tabs defaultValue={Object.keys(results.results).find(key => results.results[key as keyof typeof results.results])}>
              <TabsList className="grid w-full grid-cols-3">
                {results.results.openai !== undefined && (
                  <TabsTrigger value="openai" disabled={!results.results.openai}>
                    <div className="flex items-center space-x-1">
                      <span>GPT-4o</span>
                      {results.timings.openai && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {(results.timings.openai / 1000).toFixed(1)}s
                        </div>
                      )}
                      {results.errors?.openai && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </TabsTrigger>
                )}
                
                {results.results.anthropic !== undefined && (
                  <TabsTrigger value="anthropic" disabled={!results.results.anthropic}>
                    <div className="flex items-center space-x-1">
                      <span>Claude</span>
                      {results.timings.anthropic && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {(results.timings.anthropic / 1000).toFixed(1)}s
                        </div>
                      )}
                      {results.errors?.anthropic && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </TabsTrigger>
                )}
                
                {results.results.google !== undefined && (
                  <TabsTrigger value="google" disabled={!results.results.google}>
                    <div className="flex items-center space-x-1">
                      <span>Gemini</span>
                      {results.timings.google && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {(results.timings.google / 1000).toFixed(1)}s
                        </div>
                      )}
                      {results.errors?.google && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </TabsTrigger>
                )}
              </TabsList>

              {results.results.openai !== undefined && (
                <TabsContent value="openai" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">OpenAI GPT-4o</Badge>
                  </div>
                  {results.results.openai ? (
                    <Textarea
                      value={results.results.openai}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                  ) : results.errors?.openai ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error: {results.errors.openai}
                      </div>
                    </div>
                  ) : null}
                </TabsContent>
              )}

              {results.results.anthropic !== undefined && (
                <TabsContent value="anthropic" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Anthropic Claude 3.5 Sonnet</Badge>
                  </div>
                  {results.results.anthropic ? (
                    <Textarea
                      value={results.results.anthropic}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                  ) : results.errors?.anthropic ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error: {results.errors.anthropic}
                      </div>
                    </div>
                  ) : null}
                </TabsContent>
              )}

              {results.results.google !== undefined && (
                <TabsContent value="google" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Google Gemini 1.5 Pro</Badge>
                  </div>
                  {results.results.google ? (
                    <Textarea
                      value={results.results.google}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                  ) : results.errors?.google ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error: {results.errors.google}
                      </div>
                    </div>
                  ) : null}
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
