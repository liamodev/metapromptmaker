import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-sm text-muted-foreground">
              Built by Altitude Global Advisors
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/disclaimer" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Outputs may contain errors. Review before use. Nothing here is investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
