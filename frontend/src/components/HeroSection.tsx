import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";
import heroImage from "figma:asset/816871c57b5d482f277a08260378c441356552b5.png";
import sampleReportImage from "figma:asset/13beec349b711b2873cac99f84786987b88b252d.png";

export function HeroSection() {
  const handleDownloadReport = () => {
    const link = document.createElement('a');
    link.href = sampleReportImage;
    link.download = 'Neuro-UX_Sample_Report.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div
              className="inline-block px-4 py-2 rounded-full border"
              style={{
                backgroundColor: "var(--accent-light)",
                borderColor: "var(--accent-border)",
                color: "var(--accent)",
              }}
            >
              <span className="text-sm">
                EEG-Powered UX Intelligence
              </span>
            </div>

            <h1
              className="text-4xl leading-tight"
              style={{ color: "var(--text-heading)" }}
            >
              Quantify Your User Experience with Neuroscience
            </h1>

            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Upload raw EEG data and Decode neural reactions
              that reveals deeper behavioral insights.{" "}
              <strong style={{ color: "var(--accent-hover)" }}>
                Visual Clutter (P100)
              </strong>
              ,{" "}
              <strong style={{ color: "var(--accent-hover)" }}>
                Confusion (N200)
              </strong>
              , and{" "}
              <strong style={{ color: "var(--accent-hover)" }}>
                Decision Speed (P300)
              </strong>
              .
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => (window as any).navigateToAnalysis?.()}
                className="px-8 py-6 text-lg"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="px-8 py-6 text-lg"
                onClick={handleDownloadReport}
              >
                <Play className="mr-2 w-5 h-5" />
                View Sample Report
              </Button>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={heroImage} 
                alt="EEG Dashboard Analysis Visualization" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}