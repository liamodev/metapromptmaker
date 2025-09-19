'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USE_CASE_PACKS } from '@/lib/packs';

interface PackSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function PackSelector({ value, onValueChange, disabled = false }: PackSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select a use-case pack..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {USE_CASE_PACKS.map((pack) => (
          <SelectItem key={pack.key} value={pack.key}>
            <div>
              <div className="font-medium">{pack.name}</div>
              <div className="text-xs text-muted-foreground">{pack.description}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
