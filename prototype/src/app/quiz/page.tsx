"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, ChevronUp, ChevronDown } from "lucide-react";
import { mockQuizQuestions } from "@/lib/mock-data";
import { useStartQuiz, useSubmitQuizAnswer, useCompleteQuiz } from "@/lib/api/hooks";
import type { QuizQuestion } from "@/lib/api/types";

type Answers = Record<string, string | string[] | number | string[]>;

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);

  const startQuiz = useStartQuiz();
  const submitAnswer = useSubmitQuizAnswer();
  const completeQuiz = useCompleteQuiz();

  const questions: QuizQuestion[] = mockQuizQuestions;
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  const currentAnswer = answers[question.id];

  const canProceed = (() => {
    if (!currentAnswer) return false;
    if (question.type === "multi_select") {
      return (currentAnswer as string[]).length > 0;
    }
    if (question.type === "slider") {
      return currentAnswer !== undefined;
    }
    return true;
  })();

  const handleSingleSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    },
    [question.id]
  );

  const handleMultiSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => {
        const current = (prev[question.id] as string[]) || [];
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: next };
      });
    },
    [question.id]
  );

  const handleSlider = useCallback(
    (value: number | readonly number[]) => {
      const v = Array.isArray(value) ? value[0] : value;
      setAnswers((prev) => ({ ...prev, [question.id]: v }));
    },
    [question.id]
  );

  const handleRankMove = useCallback(
    (index: number, dir: "up" | "down") => {
      setAnswers((prev) => {
        const current = (prev[question.id] as string[]) ||
          (question.options?.map((o) => o.id) ?? []);
        const next = [...current];
        const swapIndex = dir === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= next.length) return prev;
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
        return { ...prev, [question.id]: next };
      });
    },
    [question.id, question.options]
  );

  const goNext = useCallback(() => {
    if (!canProceed) return;
    submitAnswer.mutate?.({ session_id: "", question_id: question.id, answer: currentAnswer });
    if (isLast) {
      completeQuiz.mutate?.({ session_id: "" });
      router.push("/quiz/results");
    } else {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [canProceed, isLast, currentAnswer, question.id, submitAnswer, completeQuiz, router]);

  const goBack = useCallback(() => {
    if (isFirst) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }, [isFirst]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const rankOrder =
    (answers[question.id] as string[]) ||
    question.options?.map((o) => o.id) ||
    [];

  return (
    <div className="min-h-screen bg-spark-neutral-0 flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-spark-neutral-0/90 backdrop-blur-sm border-b border-spark-neutral-100 px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm font-sans text-spark-neutral-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-spark-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-spark-primary-500 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-8"
            >
              {/* Question text */}
              <div className="space-y-3 text-center">
                <h2 className="font-heading text-2xl sm:text-3xl text-spark-neutral-900 leading-snug">
                  {question.text}
                </h2>
                {question.description && (
                  <p className="font-sans text-spark-neutral-500 text-base sm:text-lg max-w-lg mx-auto">
                    {question.description}
                  </p>
                )}
              </div>

              {/* Answer area */}
              <div>
                {/* Single select */}
                {question.type === "single_select" && question.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => {
                      const selected = currentAnswer === option.id;
                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSingleSelect(option.id)}
                          className={`
                            relative rounded-xl border-2 p-4 text-left transition-all duration-200
                            font-sans text-base
                            ${
                              selected
                                ? "border-spark-primary-500 bg-spark-primary-50 shadow-spark-medium"
                                : "border-spark-neutral-200 bg-white hover:border-spark-primary-200 hover:shadow-spark-low"
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            {option.emoji && (
                              <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                            )}
                            <div className="flex-1">
                              <span
                                className={`font-medium ${
                                  selected ? "text-spark-primary-700" : "text-spark-neutral-800"
                                }`}
                              >
                                {option.text}
                              </span>
                            </div>
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex-shrink-0 w-6 h-6 rounded-full bg-spark-primary-500 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Multi select */}
                {question.type === "multi_select" && question.options && (
                  <div className="space-y-2">
                    <p className="text-center text-sm font-sans text-spark-neutral-400 mb-4">
                      Select all that apply
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.options.map((option) => {
                        const selected = ((currentAnswer as string[]) || []).includes(option.id);
                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMultiSelect(option.id)}
                            className={`
                              relative rounded-xl border-2 p-4 text-left transition-all duration-200
                              font-sans text-base
                              ${
                                selected
                                  ? "border-spark-primary-500 bg-spark-primary-50 shadow-spark-medium"
                                  : "border-spark-neutral-200 bg-white hover:border-spark-primary-200 hover:shadow-spark-low"
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              {option.emoji && (
                                <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                              )}
                              <div className="flex-1">
                                <span
                                  className={`font-medium ${
                                    selected ? "text-spark-primary-700" : "text-spark-neutral-800"
                                  }`}
                                >
                                  {option.text}
                                </span>
                              </div>
                              <div
                                className={`
                                  flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                                  ${
                                    selected
                                      ? "border-spark-primary-500 bg-spark-primary-500"
                                      : "border-spark-neutral-300 bg-white"
                                  }
                                `}
                              >
                                {selected && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <Check className="w-4 h-4 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Slider */}
                {question.type === "slider" && (
                  <div className="max-w-md mx-auto space-y-6 pt-4">
                    <Slider
                      min={question.slider_config?.min ?? 1}
                      max={question.slider_config?.max ?? 10}
                      step={question.slider_config?.step ?? 1}
                      value={[
                        (currentAnswer as number) ??
                          Math.round(
                            ((question.slider_config?.min ?? 1) + (question.slider_config?.max ?? 10)) / 2
                          ),
                      ]}
                      onValueChange={handleSlider}
                      className="[&>span>span]:bg-spark-primary-500 [&>span]:bg-spark-neutral-200"
                    />
                    <div className="flex justify-between text-sm font-sans text-spark-neutral-500">
                      <span>{question.slider_config?.min_label ?? "Not at all"}</span>
                      <span className="text-xl font-heading font-bold text-spark-primary-600">
                        {(currentAnswer as number) ??
                          Math.round(
                            ((question.slider_config?.min ?? 1) + (question.slider_config?.max ?? 10)) / 2
                          )}
                      </span>
                      <span>{question.slider_config?.max_label ?? "Absolutely"}</span>
                    </div>
                  </div>
                )}

                {/* Rank order */}
                {question.type === "rank_order" && question.options && (
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="text-center text-sm font-sans text-spark-neutral-400 mb-4">
                      Arrange in order of importance to you
                    </p>
                    {rankOrder.map((optionId, index) => {
                      const option = question.options?.find((o) => o.id === optionId);
                      if (!option) return null;
                      return (
                        <motion.div
                          key={option.id}
                          layout
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 rounded-xl border-2 border-spark-neutral-200 bg-white p-4 font-sans shadow-spark-low"
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-spark-primary-100 text-spark-primary-700 font-bold flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          {option.emoji && (
                            <span className="text-xl flex-shrink-0">{option.emoji}</span>
                          )}
                          <span className="flex-1 text-spark-neutral-800 font-medium">
                            {option.text}
                          </span>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleRankMove(index, "up")}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-spark-neutral-100 disabled:opacity-30 transition-opacity"
                            >
                              <ChevronUp className="w-4 h-4 text-spark-neutral-500" />
                            </button>
                            <button
                              onClick={() => handleRankMove(index, "down")}
                              disabled={index === rankOrder.length - 1}
                              className="p-1 rounded hover:bg-spark-neutral-100 disabled:opacity-30 transition-opacity"
                            >
                              <ChevronDown className="w-4 h-4 text-spark-neutral-500" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="sticky bottom-0 bg-spark-neutral-0/90 backdrop-blur-sm border-t border-spark-neutral-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={isFirst}
            className="font-sans text-spark-neutral-600 hover:text-spark-neutral-800 disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {isLast ? (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="font-sans bg-spark-primary-500 hover:bg-spark-primary-600 text-white px-8 py-3 rounded-xl shadow-spark-medium transition-all disabled:opacity-50"
            >
              See My Results
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="font-sans bg-spark-primary-500 hover:bg-spark-primary-600 text-white px-6 py-3 rounded-xl shadow-spark-low transition-all disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
