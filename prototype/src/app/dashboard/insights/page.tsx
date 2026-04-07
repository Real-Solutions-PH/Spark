"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Sun, Shield, TrendingUp, Lock } from "lucide-react";
import { useInsights } from "@/lib/api/hooks";

const sectionConfig = {
  light_up_patterns: {
    title: "You light up when...",
    icon: Sun,
    cardBg: "bg-spark-secondary-50",
    borderColor: "border-spark-secondary-200",
    titleColor: "text-spark-secondary-700",
    badgeClass: "bg-spark-secondary-100 text-spark-secondary-600 border-spark-secondary-200",
    iconColor: "text-spark-secondary-500",
  },
  avoid_patterns: {
    title: "You tend to avoid...",
    icon: Shield,
    cardBg: "bg-spark-neutral-50",
    borderColor: "border-spark-neutral-200",
    titleColor: "text-spark-neutral-600",
    badgeClass: "bg-spark-neutral-100 text-spark-neutral-500 border-spark-neutral-200",
    iconColor: "text-spark-neutral-400",
  },
  emerging_strengths: {
    title: "Emerging strengths",
    icon: TrendingUp,
    cardBg: "bg-gradient-to-br from-spark-primary-50 to-spark-primary-100",
    borderColor: "border-spark-primary-200",
    titleColor: "text-spark-primary-700",
    badgeClass: "bg-spark-primary-100 text-spark-primary-600 border-spark-primary-200",
    iconColor: "text-spark-primary-500",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function InsightsPage() {
  const { data: insights, isLoading } = useInsights();

  const isLocked = !insights?.is_unlocked;
  const feedbackCount = insights?.feedback_entries_count ?? 0;
  const remaining = Math.max(0, 5 - feedbackCount);
  const progressPercent = Math.min(100, (feedbackCount / 5) * 100);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 space-y-6 lg:max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-spark-neutral-900">
          Insights
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-spark-primary-200 border-t-spark-primary-500 rounded-full animate-spin" />
        </div>
      ) : isLocked ? (
        /* Locked State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-white shadow-spark-medium border-spark-neutral-100 overflow-hidden lg:max-w-lg lg:mx-auto">
            <CardContent className="pt-8 pb-8 px-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-spark-primary-100 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-spark-primary-400" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-xl font-bold text-spark-neutral-800">
                  Your patterns are forming
                </h2>
                <p className="text-sm text-spark-neutral-500 max-w-[280px] mx-auto leading-relaxed">
                  Complete {remaining} more experiment{remaining !== 1 ? "s" : ""} to unlock
                  your personalized insights.
                </p>
              </div>
              <div className="space-y-2 max-w-[260px] mx-auto">
                <Progress value={progressPercent} className="h-2.5" />
                <p className="text-xs text-spark-neutral-400">
                  {feedbackCount} of 5 experiments completed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Teaser / Preview (blurred) */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <Sparkles className="w-6 h-6 text-spark-primary-300 mx-auto" />
                <p className="text-sm text-spark-neutral-400 font-medium">
                  Preview of your insights
                </p>
              </div>
            </div>
            <div className="space-y-3 opacity-60">
              <Card className="border-spark-secondary-200 bg-spark-secondary-50">
                <CardContent className="py-4 px-4">
                  <h3 className="font-heading text-base text-spark-secondary-700">
                    You light up when...
                  </h3>
                  <p className="text-sm text-spark-neutral-400 mt-1">
                    Patterns about what energizes you will appear here.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-spark-neutral-200 bg-spark-neutral-50">
                <CardContent className="py-4 px-4">
                  <h3 className="font-heading text-base text-spark-neutral-600">
                    You tend to avoid...
                  </h3>
                  <p className="text-sm text-spark-neutral-400 mt-1">
                    Understanding your avoidance patterns helps growth.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-spark-primary-200 bg-spark-primary-50">
                <CardContent className="py-4 px-4">
                  <h3 className="font-heading text-base text-spark-primary-700">
                    Emerging strengths
                  </h3>
                  <p className="text-sm text-spark-neutral-400 mt-1">
                    Your unique strengths will be highlighted here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Unlocked State */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0"
        >
          {(
            ["light_up_patterns", "avoid_patterns", "emerging_strengths"] as const
          ).map((sectionKey) => {
            const config = sectionConfig[sectionKey];
            const SectionIcon = config.icon;
            const patterns = (insights as any)?.[sectionKey] || [];

            if (patterns.length === 0) return null;

            return (
              <motion.div key={sectionKey} variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <SectionIcon className={`w-5 h-5 ${config.iconColor}`} />
                  <h2 className={`font-heading text-lg font-semibold ${config.titleColor}`}>
                    {config.title}
                  </h2>
                </div>

                {patterns.map((pattern: any, idx: number) => (
                  <motion.div
                    key={pattern.id || idx}
                    variants={itemVariants}
                  >
                    <Card
                      className={`${config.cardBg} ${config.borderColor} border shadow-spark-low ${
                        sectionKey === "emerging_strengths"
                          ? "ring-1 ring-spark-primary-100"
                          : ""
                      }`}
                    >
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className={`text-base font-heading ${config.titleColor}`}>
                          {pattern.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-3">
                        {pattern.description && (
                          <p className="text-sm text-spark-neutral-600 leading-relaxed">
                            {pattern.description}
                          </p>
                        )}

                        {/* Evidence experiments */}
                        {pattern.evidence && pattern.evidence.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-spark-neutral-400 uppercase tracking-wider">
                              Based on
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {pattern.evidence.map((item: string, eIdx: number) => (
                                <span
                                  key={eIdx}
                                  className="text-xs text-spark-neutral-500 bg-white/60 rounded-md px-2 py-1 border border-spark-neutral-100"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strength tags */}
                        {pattern.strength_tags && pattern.strength_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {pattern.strength_tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className={`text-xs ${config.badgeClass}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
