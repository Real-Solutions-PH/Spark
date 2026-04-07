"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/lib/api/hooks";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  return (
    <div className="min-h-screen bg-spark-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Sparkles className="h-8 w-8 text-spark-primary-500" />
            <span className="font-heading text-3xl font-bold text-spark-neutral-900">
              Spark
            </span>
          </Link>
        </div>

        <Card className="shadow-spark-medium border-spark-neutral-100">
          {!submitted ? (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-heading text-2xl text-spark-neutral-900">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-spark-neutral-500">
                  Enter your email to receive a magic link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-spark-neutral-700 font-sans"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-spark-neutral-200 focus:ring-spark-primary-500 focus:border-spark-primary-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending || !email}
                    className="w-full bg-spark-primary-500 hover:bg-spark-primary-600 text-white font-sans"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4 animate-pulse" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Magic Link
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-sm text-spark-neutral-500 hover:text-spark-primary-500 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to home
                  </Link>
                  <p className="text-sm text-spark-neutral-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/quiz"
                      className="text-spark-primary-500 hover:text-spark-primary-600 font-medium"
                    >
                      Start the quiz
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Mail className="h-16 w-16 text-spark-primary-500 mx-auto" />
                </motion.div>
                <h2 className="font-heading text-2xl text-spark-neutral-900">
                  Check your email!
                </h2>
                <p className="text-spark-neutral-500 font-sans text-sm max-w-xs mx-auto">
                  We sent a magic link to{" "}
                  <span className="font-medium text-spark-neutral-700">
                    {email}
                  </span>
                  . Click the link to sign in.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSubmitted(false)}
                  className="text-spark-primary-500 hover:text-spark-primary-600 mt-2"
                >
                  Try a different email
                </Button>
              </motion.div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
