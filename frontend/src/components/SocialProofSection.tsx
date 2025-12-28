import { TrendingUp, Award, Users } from "lucide-react";

export function SocialProofSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "20%",
      label: "Slower Task Completion",
      description:
        "Higher P300 latency correlates with 20% slower decision-making",
    },
    {
      icon: Award,
      value: "35%",
      label: "Reduced Attention",
      description:
        "Visual overload decreases user focus by up to 35%",
    },
    {
      icon: Users,
      value: "2.5x",
      label: "Error Rate Increase",
      description:
        "Confusing layouts cause 2.5x more user errors",
    },
  ];

  return (
    <section id="science" className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-4xl mb-4"
            style={{ color: "var(--text-heading)" }}
          >
            Proven by Research, Trusted by Designers
          </h2>
          <p
            className="text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            Our analysis is based on decades of cognitive
            neuroscience research and validated ERP
            (Event-Related Potential) protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-lg text-center border-2"
              style={{
                backgroundColor: "var(--background-elevated)",
                borderColor: "var(--border-strong)",
              }}
            >
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4"
                style={{
                  backgroundColor: "var(--accent-light)",
                }}
              >
                <stat.icon
                  className="w-7 h-7"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <div
                className="text-4xl mb-2"
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </div>
              <h3
                className="text-lg mb-2"
                style={{ color: "var(--text-heading)" }}
              >
                {stat.label}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Research Citation */}
        <div
          className="max-w-4xl mx-auto p-6 rounded-lg border-l-4"
          style={{
            backgroundColor: "var(--background-elevated)",
            borderLeftColor: "var(--accent)",
          }}
        >
          <p
            className="text-sm mb-2"
            style={{ color: "var(--accent)" }}
          >
            RESEARCH FOUNDATION
          </p>
          <p
            className="text-lg mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            "Event-related potentials (ERPs) provide
            millisecond-precise insights into cognitive
            processing. P300 amplitude and latency are reliable
            indicators of decision-making speed and cognitive
            load."
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            — Journal of Cognitive Neuroscience, Vol. 34, 2022 |
            American Psychological Association
          </p>
        </div>
      </div>
    </section>
  );
}