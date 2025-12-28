import { Zap, AlertCircle, Target } from "lucide-react";
import p100Image from "figma:asset/dd96f6dce2f2aac3beaf49f69e53b3b73e725f6f.png";
import n200Image from "figma:asset/a83e2de646b560310da28e5cba3893ec3519ea31.png";
import p300Image from "figma:asset/75043f4be24d2dab4e244847037ff86fc0800451.png";

export function SolutionSection() {
  const steps = [
    {
      number: "01",
      icon: Zap,
      title: "Visual Impact (P100)",
      metric: "80-120ms",
      description:
        "Does your design grab attention or exhaust the eyes? Measure early visual processing to identify if your interface creates instant clarity or cognitive overload.",
      color: "var(--accent)",
      image: p100Image,
    },
    {
      number: "02",
      icon: AlertCircle,
      title: "Intuition Check (N200)",
      metric: "200-350ms",
      description:
        "Where do users get stuck? Pinpoint the exact moments of confusion. High N200 amplitude reveals elements that violate user expectations.",
      color: "#5f8f7a",
      image: n200Image,
    },
    {
      number: "03",
      icon: Target,
      title: "Confidence Score (P300)",
      metric: "300-600ms",
      description:
        "Measure the exact speed of decision-making in milliseconds. Lower P300 latency means faster, more confident user actions.",
      color: "var(--accent-hover)",
      image: p300Image,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-4xl mb-4"
            style={{ color: "var(--text-heading)" }}
          >
            Stop Guessing. Start Measuring.
          </h2>
          <p
            className="text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            Our EEG analysis measures three critical brainwave
            markers to scientifically prove how users process
            your dashboard.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {index % 2 === 0 ? (
                <>
                  {/* Left: Content */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-5xl opacity"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3
                      className="text-3xl"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {step.title}
                    </h3>
                    <div
                      className="inline-block px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor:
                          "var(--background-elevated)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Latency Window: {step.metric}
                    </div>
                    <p
                      className="text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Right: Image */}
                  <div className="lg:col-span-5">
                    {step.image ? (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="p-8 rounded-lg border-2 aspect-video flex items-center justify-center"
                        style={{
                          backgroundColor:
                            "var(--background-elevated)",
                          borderColor: step.color,
                        }}
                      >
                        <div className="text-center">
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {step.title.split("(")[1]?.replace(")", "")} Image
                          </p>
                          <p className="text-xs mt-2" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                            (Image placeholder)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Left: Image */}
                  <div className="lg:col-span-5 order-2 lg:order-1">
                    {step.image ? (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="p-8 rounded-lg border-2 aspect-video flex items-center justify-center"
                        style={{
                          backgroundColor:
                            "var(--background-elevated)",
                          borderColor: step.color,
                        }}
                      >
                        <div className="text-center">
                          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {step.title.split("(")[1]?.replace(")", "")} Image
                          </p>
                          <p className="text-xs mt-2" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                            (Image placeholder)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="lg:col-span-7 space-y-3 order-1 lg:order-2">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-5xl opacity"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3
                      className="text-3xl"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {step.title}
                    </h3>
                    <div
                      className="inline-block px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor:
                          "var(--background-elevated)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Latency Window: {step.metric}
                    </div>
                    <p
                      className="text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}