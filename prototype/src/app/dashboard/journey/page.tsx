"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Meh, X, SkipForward, Calendar, Sparkles } from "lucide-react";
import { mockJourney, mockExperiments } from "@/lib/mock-data";

// Inline enriched journey data for a fuller timeline
const journeyEntries = [
  {
    id: "j1",
    experiment_title: "Morning Curiosity Walk",
    date: "2026-04-07",
    outcome: "loved" as const,
    reflection: "Noticed three things I'd never seen before on my usual route. Felt genuinely awake for the first time in weeks.",
    week: "This Week",
  },
  {
    id: "j2",
    experiment_title: "Write a Letter to Your Future Self",
    date: "2026-04-06",
    outcome: "loved" as const,
    reflection: "This made me emotional in a good way. Realized I have clearer goals than I thought.",
    week: "This Week",
  },
  {
    id: "j3",
    experiment_title: "Cook Something Without a Recipe",
    date: "2026-04-05",
    outcome: "okay" as const,
    reflection: "It was fun but stressful. I kept wanting to Google things.",
    week: "This Week",
  },
  {
    id: "j4",
    experiment_title: "5-Minute Sketch Challenge",
    date: "2026-04-04",
    outcome: "not_for_me" as const,
    reflection: "Drawing just isn't my thing, but I appreciate trying it.",
    week: "This Week",
  },
  {
    id: "j5",
    experiment_title: "Digital Detox Hour",
    date: "2026-03-31",
    outcome: "loved" as const,
    reflection: "One hour turned into three. Read a whole chapter of my book.",
    week: "Last Week",
  },
  {
    id: "j6",
    experiment_title: "Compliment a Stranger",
    date: "2026-03-30",
    outcome: "okay" as const,
    reflection: null,
    week: "Last Week",
  },
  {
    id: "j7",
    experiment_title: "Rearrange Your Workspace",
    date: "2026-03-29",
    outcome: "loved" as const,
    reflection: "My desk feels completely different now. More open.",
    week: "Last Week",
  },
  {
    id: "j8",
    experiment_title: "Learn 3 Words in a New Language",
    date: "2026-03-28",
    outcome: "skipped" as const,
    reflection: null,
    week: "Last Week",
  },
];

// Also merge in mockJourney entries if available
const allEntries = [
  ...journeyEntries,
  ...((mockJourney?.entries || []) as any[])
    .filter((j: any) => !journeyEntries.find((e: any) => e.id === (j.experiment?.id || j.date)))
    .map((j: any) => ({
      id: j.experiment?.id || j.date,
      experiment_title: j.experiment?.title || "Experiment",
      date: j.date,
      outcome: j.feedback?.outcome || "pending",
      reflection: j.feedback?.reflection || null,
      week: j.week_label || "Earlier",
    })),
];

const outcomeConfig = {
  loved: {
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-500",
    dotBorder: "border-pink-300",
    label: "Loved It",
    badgeClass: "bg-pink-50 text-pink-600 border-pink-200",
  },
  okay: {
    icon: Meh,
    color: "text-yellow-500",
    bg: "bg-yellow-400",
    dotBorder: "border-yellow-300",
    label: "It Was Okay",
    badgeClass: "bg-yellow-50 text-yellow-600 border-yellow-200",
  },
  not_for_me: {
    icon: X,
    color: "text-spark-neutral-400",
    bg: "bg-spark-neutral-400",
    dotBorder: "border-spark-neutral-300",
    label: "Not For Me",
    badgeClass: "bg-spark-neutral-100 text-spark-neutral-500 border-spark-neutral-200",
  },
  skipped: {
    icon: SkipForward,
    color: "text-spark-neutral-300",
    bg: "bg-spark-neutral-300",
    dotBorder: "border-spark-neutral-200",
    label: "Skipped",
    badgeClass: "bg-spark-neutral-50 text-spark-neutral-400 border-spark-neutral-200",
  },
};

// Group entries by week
function groupByWeek(entries: typeof allEntries) {
  const groups: Record<string, typeof allEntries> = {};
  for (const entry of entries) {
    const week = entry.week || "Other";
    if (!groups[week]) groups[week] = [];
    groups[week].push(entry);
  }
  return groups;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function JourneyPage() {
  const grouped = groupByWeek(allEntries);
  const weekOrder = ["This Week", "Last Week", "Earlier"];
  const sortedWeeks = Object.keys(grouped).sort(
    (a, b) => (weekOrder.indexOf(a) === -1 ? 99 : weekOrder.indexOf(a)) - (weekOrder.indexOf(b) === -1 ? 99 : weekOrder.indexOf(b))
  );

  const hasEntries = allEntries.length > 0;

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 space-y-6 lg:max-w-3xl">
      {/* Header */}
      <h1 className="font-heading text-2xl lg:text-3xl font-bold text-spark-neutral-900">
        Your Journey
      </h1>

      {!hasEntries ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 space-y-4"
        >
          <div className="w-20 h-20 rounded-full bg-spark-primary-50 flex items-center justify-center mx-auto">
            <Sparkles className="w-9 h-9 text-spark-primary-300" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-spark-neutral-700">
              Your journey starts here
            </h2>
            <p className="text-sm text-spark-neutral-400 max-w-[260px] mx-auto leading-relaxed">
              Complete your first experiment and your timeline will begin to take
              shape.
            </p>
          </div>
        </motion.div>
      ) : (
        /* Timeline */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {sortedWeeks.map((week) => (
            <div key={week} className="space-y-1">
              {/* Week Label */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3 pl-1">
                <Calendar className="w-4 h-4 text-spark-neutral-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-spark-neutral-400">
                  {week}
                </span>
              </motion.div>

              {/* Timeline entries */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-spark-neutral-200" />

                <div className="space-y-4">
                  {grouped[week].map((entry) => {
                    const config =
                      outcomeConfig[entry.outcome as keyof typeof outcomeConfig] ||
                      outcomeConfig.skipped;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={entry.id}
                        variants={itemVariants}
                        className="relative flex gap-4"
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 shrink-0 mt-3">
                          <div
                            className={`w-[22px] h-[22px] rounded-full ${config.bg} border-2 ${config.dotBorder} bg-opacity-90 flex items-center justify-center`}
                          >
                            <Icon className="w-3 h-3 text-white" strokeWidth={2.5} />
                          </div>
                        </div>

                        {/* Entry Card */}
                        <Card className="flex-1 bg-white shadow-spark-low border-spark-neutral-100 overflow-hidden">
                          <div className="px-4 py-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-heading text-sm font-semibold text-spark-neutral-800 leading-snug">
                                {entry.experiment_title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-[10px] shrink-0 ${config.badgeClass}`}
                              >
                                {config.label}
                              </Badge>
                            </div>

                            <p className="text-[11px] text-spark-neutral-400">
                              {formatDate(entry.date)}
                            </p>

                            {entry.reflection && (
                              <p className="text-xs text-spark-neutral-500 leading-relaxed italic">
                                &ldquo;{entry.reflection}&rdquo;
                              </p>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
