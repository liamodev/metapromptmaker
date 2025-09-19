import Link from 'next/link';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-bold">Meta Prompt Maker</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link 
            href="/disclaimer" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  );
}
