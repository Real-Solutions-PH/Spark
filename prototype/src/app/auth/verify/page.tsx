"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useVerifyMagicLink } from "@/lib/api/hooks";
import { Suspense } from "react";

type VerifyState = "verifying" | "success" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>("verifying");
  const { mutate: verifyMagicLink } = useVerifyMagicLink();

  useEffect(() => {
    if (!token) {
      setState("error");
      return;
    }

    verifyMagicLink(
      { token },
      {
        onSuccess: () => {
          setState("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        onError: () => {
          setState("error");
        },
      }
    );
  }, [token, verifyMagicLink, router]);

  return (
    <div className="min-h-screen bg-spark-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-spark-medium border-spark-neutral-100">
          <CardContent className="py-12">
            {state === "verifying" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <Loader2 className="h-12 w-12 text-spark-primary-500 mx-auto animate-spin" />
                <p className="font-heading text-xl text-spark-neutral-900">
                  Verifying your link...
                </p>
                <p className="text-sm text-spark-neutral-500 font-sans">
                  Hang tight, this will only take a moment.
                </p>
              </motion.div>
            )}

            {state === "success" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center space-y-4"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="font-heading text-xl text-spark-neutral-900">
                  You&apos;re in!
                </p>
                <p className="text-sm text-spark-neutral-500 font-sans">
                  Redirecting you to your dashboard...
                </p>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center space-y-4"
              >
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="font-heading text-xl text-spark-neutral-900">
                  Verification failed
                </p>
                <p className="text-sm text-spark-neutral-500 font-sans">
                  This link may have expired or already been used.
                </p>
                <a
                  href="/auth/login"
                  className="inline-block mt-2 text-sm font-medium text-spark-primary-500 hover:text-spark-primary-600 transition-colors"
                >
                  Request a new magic link
                </a>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-spark-neutral-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-spark-primary-500 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
