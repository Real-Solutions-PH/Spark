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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Bell, RefreshCw, Download, Trash2, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Johnson");
  const [muteReminders, setMuteReminders] = useState(false);
  const [retakeDialogOpen, setRetakeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const mockEmail = "alex.johnson@example.com";
  const mockMemberSince = "January 2026";

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const handleExportData = () => {
    const data = {
      name,
      email: mockEmail,
      memberSince: mockMemberSince,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spark-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="min-h-screen bg-spark-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading text-3xl font-bold text-spark-neutral-900">
            Settings
          </h1>
          <p className="text-spark-neutral-500 font-sans mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Account Section */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Card className="shadow-spark-low border-spark-neutral-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-spark-primary-500" />
                <CardTitle className="font-heading text-xl text-spark-neutral-900">
                  Account
                </CardTitle>
              </div>
              <CardDescription className="text-spark-neutral-500">
                Your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-spark-neutral-700 font-sans text-sm">
                  Email
                </Label>
                <p className="text-spark-neutral-900 font-sans text-sm bg-spark-neutral-100 rounded-md px-3 py-2">
                  {mockEmail}
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-spark-neutral-700 font-sans text-sm"
                >
                  Display name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-spark-neutral-200 focus:ring-spark-primary-500 focus:border-spark-primary-500"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-spark-neutral-700 font-sans text-sm">
                  Member since
                </Label>
                <p className="text-spark-neutral-600 font-sans text-sm">
                  {mockMemberSince}
                </p>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-spark-primary-500 hover:bg-spark-primary-600 text-white font-sans"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Card className="shadow-spark-low border-spark-neutral-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-spark-primary-500" />
                <CardTitle className="font-heading text-xl text-spark-neutral-900">
                  Notifications
                </CardTitle>
              </div>
              <CardDescription className="text-spark-neutral-500">
                Control how Spark reaches out to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-spark-neutral-700 font-sans text-sm font-medium">
                    Mute experiment reminders
                  </Label>
                  <p className="text-spark-neutral-400 font-sans text-xs">
                    Pause all nudge and check-in notifications
                  </p>
                </div>
                <Switch
                  checked={muteReminders}
                  onCheckedChange={setMuteReminders}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Discovery Section */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Card className="shadow-spark-low border-spark-neutral-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-spark-primary-500" />
                <CardTitle className="font-heading text-xl text-spark-neutral-900">
                  Discovery
                </CardTitle>
              </div>
              <CardDescription className="text-spark-neutral-500">
                Refresh your relationship profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setRetakeDialogOpen(true)}
                className="border-spark-primary-200 text-spark-primary-600 hover:bg-spark-primary-50 font-sans"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Section */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Card className="shadow-spark-low border-spark-neutral-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-spark-primary-500" />
                <CardTitle className="font-heading text-xl text-spark-neutral-900">
                  Data &amp; Privacy
                </CardTitle>
              </div>
              <CardDescription className="text-spark-neutral-500">
                Your data, your control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="border-spark-neutral-200 text-spark-neutral-700 hover:bg-spark-neutral-100 font-sans"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>

              <Separator className="bg-spark-neutral-100" />

              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 font-sans"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Retake Quiz Confirmation Dialog */}
      <Dialog open={retakeDialogOpen} onOpenChange={setRetakeDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-spark-neutral-900">
              Retake the quiz?
            </DialogTitle>
            <DialogDescription className="text-spark-neutral-500 font-sans">
              Your previous quiz results will be archived, not deleted. A new
              profile will be generated based on your updated answers, and future
              experiment suggestions will reflect your new results.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setRetakeDialogOpen(false)}
              className="text-spark-neutral-500 font-sans"
            >
              Cancel
            </Button>
            <Link href="/quiz">
              <Button className="bg-spark-primary-500 hover:bg-spark-primary-600 text-white font-sans">
                Start Quiz
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-red-600">
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-spark-neutral-500 font-sans">
              This will schedule your account for deletion. You have a 30-day
              grace period during which you can sign back in to cancel the
              deletion. After 30 days, all your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-spark-neutral-500 font-sans"
            >
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-sans">
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
