"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Zap, Heart, Meh, X, RefreshCw, Sparkles } from "lucide-react";
import {
  useProfile,
  useExperiments,
  useSubmitExperimentFeedback,
} from "@/lib/api/hooks";
import type { FeedbackOutcome } from "@/lib/api/types";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  stretch: "bg-orange-100 text-orange-700 border-orange-200",
};

const outcomeConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  loved: { icon: Heart, color: "text-pink-500", label: "Loved It" },
  okay: { icon: Meh, color: "text-yellow-500", label: "It Was Okay" },
  not_for_me: { icon: X, color: "text-spark-neutral-400", label: "Not For Me" },
  skipped: { icon: RefreshCw, color: "text-spark-neutral-300", label: "Skipped" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null
  );
  const [selectedOutcome, setSelectedOutcome] = useState<FeedbackOutcome | null>(null);
  const [reflection, setReflection] = useState("");

  const { data: profile } = useProfile();
  const { data: experiments = [] } = useExperiments();
  const feedbackMutation = useSubmitExperimentFeedback();

  const filteredExperiments = experiments.filter((exp) => {
    if (activeTab === "active")
      return exp.status === "active" || exp.status === "pending";
    if (activeTab === "completed") return exp.status === "completed";
    return true;
  });

  const openFeedback = (experimentId: string) => {
    setSelectedExperiment(experimentId);
    setSelectedOutcome(null);
    setReflection("");
    setFeedbackOpen(true);
  };

  const submitFeedback = () => {
    if (!selectedExperiment || !selectedOutcome) return;
    feedbackMutation.mutate(
      {
        experimentId: selectedExperiment,
        outcome: selectedOutcome,
        reflection: reflection || undefined,
      },
      {
        onSuccess: () => {
          setFeedbackOpen(false);
        },
      }
    );
  };

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 space-y-6 lg:max-w-5xl">
      {/* Greeting */}
      <div className="lg:flex lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-spark-neutral-900">
            Welcome back
          </h1>
          {profile?.energy_type && (
            <p className="text-sm text-spark-neutral-500 mt-1">
              <Zap className="w-3.5 h-3.5 inline mr-1 text-spark-primary-400" />
              {profile.energy_type}
            </p>
          )}
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card className="bg-white shadow-spark-medium border-spark-neutral-100">
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-spark-neutral-400">
              Your Strengths
            </span>
            {profile?.energy_type && (
              <Badge
                variant="outline"
                className="border-spark-primary-200 text-spark-primary-600 text-xs"
              >
                {profile.energy_type}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile?.top_strengths || []).slice(0, 3).map((strength) => (
              <Badge
                key={strength.name}
                className="bg-spark-secondary-100 text-spark-secondary-700 border-spark-secondary-200 text-xs font-medium"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {strength.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experiment Tabs */}
      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full bg-spark-neutral-100">
          <TabsTrigger value="active" className="flex-1 text-sm">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 text-sm">
            Completed
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 text-sm">
            All
          </TabsTrigger>
        </TabsList>

        {["active", "completed", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <AnimatePresence>
              {filteredExperiments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-spark-neutral-400 lg:col-span-2"
                >
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No experiments here yet.</p>
                </motion.div>
              ) : (
                filteredExperiments.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white shadow-spark-low border-spark-neutral-100 hover:shadow-spark-medium transition-shadow">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="font-heading text-lg text-spark-neutral-900 leading-snug">
                            {exp.title}
                          </CardTitle>
                          {exp.status === "completed" && exp.feedback?.outcome && (
                            <span className={outcomeConfig[exp.feedback.outcome]?.color}>
                              {(() => {
                                const Icon = outcomeConfig[exp.feedback.outcome]?.icon;
                                return Icon ? <Icon className="w-5 h-5" /> : null;
                              })()}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-spark-neutral-600 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-1.5">
                          {exp.time_estimate_minutes && (
                            <Badge
                              variant="outline"
                              className="text-xs text-spark-neutral-500 border-spark-neutral-200"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {exp.time_estimate_minutes} min
                            </Badge>
                          )}
                          {exp.difficulty && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                difficultyColors[exp.difficulty] ||
                                "border-spark-neutral-200 text-spark-neutral-500"
                              }`}
                            >
                              {exp.difficulty}
                            </Badge>
                          )}
                          {exp.category && (
                            <Badge
                              variant="outline"
                              className="text-xs border-spark-primary-200 text-spark-primary-600"
                            >
                              {exp.category}
                            </Badge>
                          )}
                        </div>

                        {/* Completed feedback display */}
                        {exp.status === "completed" &&
                          exp.feedback?.outcome &&
                          outcomeConfig[exp.feedback.outcome] && (
                            <button
                              onClick={() => openFeedback(exp.id)}
                              className="w-full text-left"
                            >
                              <div className="flex items-center gap-2 bg-spark-neutral-50 rounded-lg px-3 py-2">
                                {(() => {
                                  const cfg = outcomeConfig[exp.feedback.outcome];
                                  const Icon = cfg.icon;
                                  return (
                                    <>
                                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                                      <span className="text-xs text-spark-neutral-500">
                                        {cfg.label}
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                            </button>
                          )}

                        {/* Action buttons for pending/active */}
                        {(exp.status === "pending" || exp.status === "active") && (
                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              className="flex-1 bg-spark-primary-500 hover:bg-spark-primary-600 text-white text-sm"
                              onClick={() => openFeedback(exp.id)}
                            >
                              Try This
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-spark-neutral-200 text-spark-neutral-500 text-sm"
                            >
                              Skip
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>

      {/* Generate New Experiments Button */}
      <div className="pt-2 pb-4">
        <Button className="w-full lg:w-auto bg-spark-primary-500 hover:bg-spark-primary-600 text-white shadow-spark-medium h-12 text-sm font-semibold lg:px-8">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Experiments
        </Button>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-[400px] mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-spark-neutral-900">
              How did it go?
            </DialogTitle>
            <DialogDescription className="text-sm text-spark-neutral-500">
              Your honest feedback helps Spark learn what energizes you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Outcome Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { key: "loved", icon: Heart, label: "Loved It", activeColor: "bg-pink-50 border-pink-300 text-pink-600" },
                  { key: "okay", icon: Meh, label: "It Was Okay", activeColor: "bg-yellow-50 border-yellow-300 text-yellow-600" },
                  { key: "not_for_me", icon: X, label: "Not For Me", activeColor: "bg-spark-neutral-100 border-spark-neutral-300 text-spark-neutral-600" },
                  { key: "skipped", icon: RefreshCw, label: "Didn't Try", activeColor: "bg-spark-neutral-50 border-spark-neutral-200 text-spark-neutral-500" },
                ] as const
              ).map(({ key, icon: Icon, label, activeColor }) => (
                <button
                  key={key}
                  onClick={() => setSelectedOutcome(key as FeedbackOutcome)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedOutcome === key
                      ? activeColor
                      : "border-spark-neutral-100 text-spark-neutral-400 hover:border-spark-neutral-200"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Reflection Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-spark-neutral-700">
                Reflection{" "}
                <span className="text-spark-neutral-400 font-normal">
                  (optional)
                </span>
              </label>
              <Textarea
                placeholder="What did you notice? How did it make you feel?"
                value={reflection}
                onChange={(e) =>
                  setReflection(e.target.value.slice(0, 280))
                }
                className="resize-none h-24 text-sm border-spark-neutral-200 focus:border-spark-primary-300"
              />
              <p className="text-xs text-spark-neutral-400 text-right">
                {reflection.length}/280
              </p>
            </div>

            {/* Submit */}
            <Button
              onClick={submitFeedback}
              disabled={!selectedOutcome || feedbackMutation.isPending}
              className="w-full bg-spark-primary-500 hover:bg-spark-primary-600 text-white disabled:opacity-40 h-11"
            >
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
