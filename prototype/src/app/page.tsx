"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Take the Quiz",
    description:
      "Answer thoughtful questions about what energizes you, what feels natural, and where you lose track of time.",
    step: "01",
  },
  {
    icon: Compass,
    title: "Try Experiments",
    description:
      "Get personalized micro-challenges designed to help you explore your strengths through real action — not just reflection.",
    step: "02",
  },
  {
    icon: TrendingUp,
    title: "Discover Patterns",
    description:
      "See your unique strengths map emerge over time. Spark finds the threads that connect what lights you up.",
    step: "03",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-spark-neutral-0">
      {/* Hero Glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-spark-primary-200/40 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-spark-secondary-200/30 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-spark-primary-100/60 px-4 py-1.5 text-sm font-medium tracking-wide text-spark-primary-700"
          >
            AI-Powered Strengths Discovery
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-spark-neutral-900 sm:text-5xl md:text-6xl"
          >
            Discover what fits you —{" "}
            <span className="text-spark-primary-500">
              through action, not overthinking.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-spark-neutral-500 sm:text-xl"
          >
            Spark helps you uncover your natural strengths with a short quiz,
            hands-on experiments, and AI that spots the patterns you can&apos;t
            see yourself.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10">
            <Link href="/quiz">
              <Button
                size="lg"
                className="rounded-full bg-spark-primary-500 px-8 py-6 text-lg font-semibold text-white shadow-spark-medium transition-all hover:bg-spark-primary-600 hover:shadow-spark-high"
              >
                Start Discovery
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10"
        >
          <div className="flex flex-col items-center gap-2 text-spark-neutral-400">
            <span className="text-xs uppercase tracking-widest">
              How it works
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-6 w-4 rounded-full border-2 border-spark-neutral-300"
            >
              <div className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-spark-neutral-300" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 pb-32 pt-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.step}
                variants={fadeUp}
                className="group relative rounded-2xl border border-spark-primary-100/60 bg-white/70 p-8 backdrop-blur-sm transition-all hover:border-spark-primary-200 hover:shadow-spark-medium"
              >
                <span className="font-heading text-5xl font-bold text-spark-primary-100">
                  {feature.step}
                </span>

                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-spark-primary-50 text-spark-primary-500 transition-colors group-hover:bg-spark-primary-100">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-heading text-xl font-semibold text-spark-neutral-900">
                  {feature.title}
                </h3>

                <p className="mt-2 leading-relaxed text-spark-neutral-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 text-center"
          >
            <p className="font-heading text-2xl font-semibold text-spark-neutral-800 sm:text-3xl">
              Ready to find out what makes you{" "}
              <span className="text-spark-primary-500">spark</span>?
            </p>
            <div className="mt-8">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="rounded-full bg-spark-primary-500 px-8 py-6 text-lg font-semibold text-white shadow-spark-medium transition-all hover:bg-spark-primary-600 hover:shadow-spark-high"
                >
                  Start Discovery
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
