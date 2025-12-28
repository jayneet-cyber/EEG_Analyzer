import { Brain } from 'lucide-react';
import { Button } from './ui/button';

export function Navigation() {
  return (
    <nav style={{ 
      backgroundColor: 'var(--background)',
    }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{
              backgroundColor: 'var(--accent-light)',
              borderWidth: '1px',
              borderColor: 'var(--accent-border)'
            }}>
              <Brain className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 className="text-lg" style={{ color: 'var(--text-heading)' }}>Neuro-UX Analyzer</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              How It Works
            </a>
            <a href="#science" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              The Science
            </a>
            <Button
              onClick={() => (window as any).navigateToAnalysis?.()}
              variant="outline"
              className="px-6 py-2"
            >
              Start Free Analysis
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}