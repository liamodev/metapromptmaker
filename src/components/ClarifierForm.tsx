'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ClarifierQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'multiselect';
  options?: string[];
  required?: boolean;
}

interface ClarifierFormProps {
  questions: ClarifierQuestion[];
  onSubmit: (answers: Record<string, any>) => void;
  isLoading?: boolean;
}

export function ClarifierForm({ questions, onSubmit, isLoading = false }: ClarifierFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiselectChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v: string) => v !== option)
        };
      }
    });
  };

  const renderQuestion = (question: ClarifierQuestion) => {
    const { id, label, type, options, required } = question;

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[id] || ''}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={answers[id] || ''}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            className="min-h-[80px]"
            disabled={isLoading}
          />
        );

      case 'dropdown':
        return (
          <Select
            value={answers[id] || ''}
            onValueChange={(value) => handleAnswerChange(id, value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={answers[id] || false}
              onCheckedChange={(checked) => handleAnswerChange(id, checked)}
              disabled={isLoading}
            />
            <label htmlFor={id} className="text-sm">
              Yes
            </label>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${id}-${option}`}
                  checked={(answers[id] || []).includes(option)}
                  onCheckedChange={(checked) => 
                    handleMultiselectChange(id, option, checked as boolean)
                  }
                  disabled={isLoading}
                />
                <label htmlFor={`${id}-${option}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = questions.every(question => {
    if (!question.required) return true;
    const answer = answers[question.id];
    if (question.type === 'multiselect') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    return answer && answer.toString().trim();
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Clarifying Questions</CardTitle>
        <p className="text-muted-foreground">
          Please answer these questions to help us optimize your prompt.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="text-sm font-medium">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating optimized prompt...
              </>
            ) : (
              'Generate Optimized Prompt'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
