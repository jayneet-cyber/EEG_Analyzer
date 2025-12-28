import { Loader2, BarChart3, AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  isAnalyzing: boolean;
  resultImage: string | null;
  error: string | null;
}

export function ResultsDisplay({ isAnalyzing, resultImage, error }: ResultsDisplayProps) {
  if (!isAnalyzing && !resultImage && !error) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h2 style={{ color: 'var(--text-heading)' }}>Analysis Results</h2>
      </div>

      <div className="border rounded-lg p-8" style={{
        borderColor: 'var(--border-strong)',
        backgroundColor: 'var(--background-elevated)'
      }}>
        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-16 h-16 animate-spin mb-4" style={{ color: 'var(--accent)' }} />
            <p style={{ color: 'var(--text-heading)' }}>Processing EEG data...</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>This may take a few moments</p>
          </div>
        )}

        {/* Error State */}
        {error && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
              backgroundColor: 'var(--error-light)',
              borderWidth: '1px',
              borderColor: 'var(--error-border)'
            }}>
              <AlertCircle className="w-8 h-8" style={{ color: 'var(--error)' }} />
            </div>
            <p className="mb-2" style={{ color: 'var(--error)' }}>Analysis Failed</p>
            <p className="text-sm text-center max-w-md" style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
        )}

        {/* Success State with Result Image */}
        {resultImage && !isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b" style={{
              borderColor: 'var(--border)'
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{
                backgroundColor: 'var(--success)'
              }} />
              <p className="text-sm" style={{ color: 'var(--success)' }}>Analysis Complete</p>
            </div>
            <div className="flex justify-center">
              <img 
                src={`data:image/png;base64,${resultImage}`}
                alt="EEG Cognitive Load Analysis Results"
                className="max-w-full h-auto rounded-lg border"
                style={{ borderColor: 'var(--border-strong)' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
