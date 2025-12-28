import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function CTASection() {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl" style={{ color: "#ffffff" }}>
            Ready to Prove Your UX Works?
          </h2>
          <p
            className="text-lg"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Stop relying on guesswork. Start your first free EEG
            analysis today and get scientific proof of your
            dashboard's cognitive load.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => (window as any).navigateToAnalysis?.()}
              variant="outline-dark"
              className="px-12 py-6 text-lg group"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p
            className="text-sm"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            No credit card required | Free sample report
          </p>
        </div>
      </div>
    </section>
  );
}