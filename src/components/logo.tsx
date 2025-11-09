import { HeartPulse } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <HeartPulse className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold text-foreground">Bloodflow</h1>
    </div>
  );
}
