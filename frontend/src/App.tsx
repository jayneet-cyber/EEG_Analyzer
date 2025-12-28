import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SocialProofSection } from './components/SocialProofSection';
import { CTASection } from './components/CTASection';
import { Navigation } from './components/Navigation';
import { FileUploadZone } from './components/FileUploadZone';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Brain, Activity, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'analysis'>('landing');
  const [cntFile, setCntFile] = useState<File | null>(null);
  const [expFile, setExpFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up navigation functions on window object for child components
  useEffect(() => {
    (window as any).navigateToAnalysis = () => setCurrentPage('analysis');
    (window as any).navigateToLanding = () => setCurrentPage('landing');
  }, []);

  const handleAnalyze = async () => {
    if (!cntFile || !expFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append('cnt_file', cntFile);
      formData.append('exp_file', expFile);
      if (videoFile) {
        formData.append('video_file', videoFile);
      }

      const API_URL = (window.location.hostname === "localhost" && "http://localhost:8000/analyze") || "https://backend.onrender.com/analyze";

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.image) {
        setResultImage(data.image);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCntFile(null);
    setExpFile(null);
    setVideoFile(null);
    setResultImage(null);
    setError(null);
  };

  const isAnalyzeDisabled = !cntFile || !expFile || isAnalyzing;

  if (currentPage === 'analysis') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <header style={{ 
          backgroundColor: 'var(--background-elevated)',
        }}>
          <div className="container mx-auto px-6 py-6">
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
              <Button
                onClick={() => setCurrentPage('landing')}
                variant="outline"
                className="px-6 py-2"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {/* Upload Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h2 style={{ color: 'var(--text-heading)' }}>Data Input</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <FileUploadZone
                label="Upload Raw EEG (.cnt)"
                accept=".cnt"
                file={cntFile}
                onFileSelect={setCntFile}
                description="Raw EEG recording file"
              />
              <FileUploadZone
                label="Upload Experiment Log (.exp)"
                accept=".exp"
                file={expFile}
                onFileSelect={setExpFile}
                description="Experiment metadata file"
              />
              <FileUploadZone
                label="Upload Video (.mp4)"
                accept=".mp4,video/*"
                file={videoFile}
                onFileSelect={setVideoFile}
                description="Experiment video recording (optional)"
              />
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled}
                variant="outline"
                className="px-12 py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain className="w-5 h-5 mr-2" />
                {isAnalyzing ? 'Analyzing Brainwaves...' : 'Start Free Analysis'}
              </Button>
              
              {(resultImage || error) && !isAnalyzing && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Analyze New Files
                </Button>
              )}
            </div>
          </section>

          {/* Results Section */}
          <ResultsDisplay 
            isAnalyzing={isAnalyzing} 
            resultImage={resultImage}
            error={error}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
    </div>
  );
}