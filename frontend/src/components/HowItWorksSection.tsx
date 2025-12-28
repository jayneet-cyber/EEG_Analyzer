import { Upload, Cpu, FileText } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Record EEG',
      description: 'Connect your EEG headset and have users complete tasks on your dashboard. We support all standard raw EEG formats.'
    },
    {
      icon: Cpu,
      title: 'Upload Files',
      description: 'Upload raw EEG data with experiment logs, and video recordings for context.'
    },
    {
      icon: FileText,
      title: 'Get Neuro-Report',
      description: 'Receive a comprehensive analysis with P100/N200/P300 metrics, heatmaps, and actionable UX recommendations.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16" style={{ backgroundColor: 'var(--background-elevated)' }}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl mb-4" style={{ color: 'var(--text-heading)' }}>
            How It Works
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            From raw brainwaves to actionable insights in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full border-4" style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--accent)'
                }}>
                  <step.icon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm" style={{ color: 'var(--accent)' }}>
                    Step {index + 1}
                  </div>
                  <h3 className="text-xl" style={{ color: 'var(--text-heading)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Vertical Separator Line */}
              {index < steps.length - 1 && (
                <div 
                  className="hidden md:block absolute top-0 bottom-0 w-px"
                  style={{
                    right: '-24px',
                    backgroundColor: 'var(--accent)',
                    opacity: 0.3
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}