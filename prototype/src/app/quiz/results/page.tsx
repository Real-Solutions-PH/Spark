"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Compass, ArrowRight } from "lucide-react";
import { mockProfile } from "@/lib/mock-data";
import Link from "next/link";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const barGrow = (score: number) => ({
  hidden: { width: 0 },
  visible: {
    width: `${score}%`,
    transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.4 },
  },
});

export default function QuizResultsPage() {
  const profile = mockProfile;

  const topStrengths = [...profile.top_strengths]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-spark-neutral-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-10"
      >
        {/* Hero heading */}
        <motion.div variants={fadeUp} className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-spark-primary-100 mb-4">
            <Sparkles className="w-8 h-8 text-spark-primary-600" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-spark-neutral-900 leading-tight">
            Your Strengths Profile
          </h1>
          <p className="font-sans text-spark-neutral-500 text-lg max-w-md mx-auto">
            Here is what lights you up. These are the abilities that feel effortless and energizing when you use them.
          </p>
        </motion.div>

        {/* Top 3 strengths */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="font-heading text-xl text-spark-neutral-800">
            Your Top Strengths
          </h2>
          <div className="space-y-4">
            {topStrengths.map((strength, i) => (
              <motion.div key={strength.name} variants={fadeUp}>
                <Card className="p-5 sm:p-6 shadow-spark-medium border-spark-neutral-100 bg-white rounded-2xl">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-lg font-bold text-spark-neutral-900">
                            {i + 1}. {strength.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-spark-primary-50 text-spark-primary-700 border-spark-primary-200 font-sans text-xs"
                          >
                            {strength.category}
                          </Badge>
                        </div>
                        <p className="font-sans text-sm text-spark-neutral-500 leading-relaxed">
                          {strength.description}
                        </p>
                      </div>
                      <span className="flex-shrink-0 font-heading text-2xl font-bold text-spark-primary-600">
                        {strength.score}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="h-3 rounded-full bg-spark-neutral-100 overflow-hidden">
                      <motion.div
                        variants={barGrow(strength.score)}
                        className="h-full rounded-full bg-gradient-to-r from-spark-primary-400 to-spark-primary-600"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Profile insights */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Energy type */}
          <Card className="p-5 shadow-spark-medium border-spark-neutral-100 bg-white rounded-2xl text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-spark-secondary-100 mx-auto">
              <Zap className="w-6 h-6 text-spark-secondary-600" />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-spark-neutral-400">
                Energy Type
              </p>
              <p className="font-heading text-lg font-bold text-spark-neutral-900 mt-1">
                {profile.energy_type}
              </p>
            </div>
            <p className="font-sans text-sm text-spark-neutral-500 leading-relaxed">
              You come alive when you are in a state of creative flow, turning ideas into something tangible.
            </p>
          </Card>

          {/* Skill pattern */}
          <Card className="p-5 shadow-spark-medium border-spark-neutral-100 bg-white rounded-2xl text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-spark-primary-100 mx-auto">
              <Sparkles className="w-6 h-6 text-spark-primary-600" />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-spark-neutral-400">
                Skill Pattern
              </p>
              <p className="font-heading text-lg font-bold text-spark-neutral-900 mt-1">
                {profile.skill_pattern}
              </p>
            </div>
            <p className="font-sans text-sm text-spark-neutral-500 leading-relaxed">
              You naturally build things from scratch. Bringing structure to chaos is where your magic lives.
            </p>
          </Card>

          {/* Motivation driver */}
          <Card className="p-5 shadow-spark-medium border-spark-neutral-100 bg-white rounded-2xl text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-spark-secondary-50 mx-auto">
              <Compass className="w-6 h-6 text-spark-secondary-700" />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-spark-neutral-400">
                Motivation Driver
              </p>
              <p className="font-heading text-lg font-bold text-spark-neutral-900 mt-1">
                {profile.motivation_driver}
              </p>
            </div>
            <p className="font-sans text-sm text-spark-neutral-500 leading-relaxed">
              You thrive with freedom and ownership. Having space to chart your own path fuels your best work.
            </p>
          </Card>
        </motion.div>

        {/* Affirmation */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-gradient-to-br from-spark-primary-50 via-spark-primary-100 to-spark-secondary-50 p-6 sm:p-8 text-center shadow-spark-low"
        >
          <p className="font-heading text-xl sm:text-2xl text-spark-primary-800 leading-relaxed">
            &ldquo;You have a rare combination of creative vision and the determination to make it real. Your strengths are not just skills &mdash; they are how you make an impact.&rdquo;
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="space-y-4 text-center">
          <Link href="/dashboard">
            <Button className="font-sans bg-spark-primary-500 hover:bg-spark-primary-600 text-white px-8 py-3 rounded-xl shadow-spark-medium text-base transition-all">
              See Your First Experiments
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="font-sans my-4 text-sm text-spark-neutral-400">
            Want to keep your results?{" "}
            <Link
              href="/signup"
              className="text-spark-primary-600 hover:text-spark-primary-700 underline underline-offset-2"
            >
              Create a free account
            </Link>{" "}
            to save your profile and track your progress.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
