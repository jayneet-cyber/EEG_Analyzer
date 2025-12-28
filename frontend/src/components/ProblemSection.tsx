import { Eye, Brain, Clock } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: Eye,
      title: "Visual Overload",
      description:
        "Dense dashboards with 20+ widgets create eye strain and reduce user attention by 35%.",
    },
    {
      icon: Brain,
      title: "Cognitive Friction",
      description:
        'Confusing layouts force users to "think harder," increasing mental fatigue and errors.',
    },
    {
      icon: Clock,
      title: "Delayed Action",
      description:
        "Every extra second of hesitation costs your users valuable decision-making time.",
    },
  ];

  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--background-elevated)" }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-4xl mb-4"
            style={{ color: "var(--text-heading)" }}
          >
            Cognitive Overload in B2B Dashboards
          </h2>
          <p
            className="text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            Dense B2B dashboards overwhelm users, leading to
            slow decisions, costly errors, and abandoned
            workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {problems.map((problem, index) => (
            <div key={index} className="relative z-10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full border-4"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--accent)",
                  }}
                >
                  <problem.icon
                    className="w-8 h-8"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-xl"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {problem.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {problem.description}
                  </p>
                </div>
              </div>

              {/* Vertical Separator Line */}
              {index < problems.length - 1 && (
                <div
                  className="hidden md:block absolute top-0 bottom-0 w-px"
                  style={{
                    right: "-24px",
                    backgroundColor: "var(--accent)",
                    opacity: 0.3,
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