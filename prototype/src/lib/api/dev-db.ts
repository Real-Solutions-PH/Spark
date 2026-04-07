/**
 * IndexedDB-backed development database.
 * When NEXT_PUBLIC_DEV_MODE=true, all API client methods route here
 * instead of hitting the real backend. Data persists across page reloads
 * via IndexedDB.
 */

import type {
  QuizStartResponse,
  QuizAnswerRequest,
  QuizAnswerResponse,
  QuizCompleteRequest,
  QuizCompleteResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthVerifyRequest,
  AuthVerifyResponse,
  UserProfile,
  Experiment,
  ExperimentsGenerateRequest,
  ExperimentsGenerateResponse,
  ExperimentsRegenerateRequest,
  ExperimentFeedbackRequest,
  ExperimentFeedbackResponse,
  InsightsData,
  JourneyData,
  Notification,
  NotificationDismissResponse,
  ExportDataResponse,
  DeleteAccountResponse,
  HealthResponse,
  UserSettings,
  UserSettingsUpdate,
  User,
  QuizQuestion,
  ExperimentFeedback,
} from "./types";
import {
  mockQuizQuestions,
  mockProfile,
  mockExperiments,
  mockInsights,
  mockJourney,
  mockNotifications,
} from "../mock-data";

// ============ IndexedDB Helpers ============

const DB_NAME = "spark_dev_db";
const DB_VERSION = 2;

const STORES = {
  user: "user",
  profile: "profile",
  experiments: "experiments",
  feedback: "feedback",
  notifications: "notifications",
  settings: "settings",
  quizSessions: "quizSessions",
  meta: "meta",
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // Clear old stores on upgrade so data is re-seeded
      for (const store of Object.values(STORES)) {
        if (db.objectStoreNames.contains(store)) {
          db.deleteObjectStore(store);
        }
        db.createObjectStore(store, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
    db.close();
  });
}

async function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
    db.close();
  });
}

async function put<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(data);
    tx.oncomplete = () => {
      resolve();
      db.close();
    };
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteById(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = () => {
      resolve();
      db.close();
    };
    tx.onerror = () => reject(tx.error);
  });
}

async function clearStore(storeName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
    tx.oncomplete = () => {
      resolve();
      db.close();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ============ Seed Check ============

async function ensureSeeded(): Promise<void> {
  const meta = await getById<{ id: string; seeded: boolean }>(STORES.meta, "seed_status");
  if (meta?.seeded) return;

  // Seed user
  const defaultUser: User & { id: string } = {
    id: "user-1",
    email: "dev@spark.local",
    name: "Dev User",
    created_at: "2026-04-07T09:00:00Z",
    last_login_at: new Date().toISOString(),
  };
  await put(STORES.user, defaultUser);

  // Seed profile
  await put(STORES.profile, mockProfile);

  // Seed experiments
  for (const exp of mockExperiments) {
    // Store feedback separately, keep a clean experiment
    if (exp.feedback) {
      await put(STORES.feedback, exp.feedback);
    }
    await put(STORES.experiments, exp);
  }

  // Seed notifications
  for (const notif of mockNotifications) {
    await put(STORES.notifications, notif);
  }

  // Seed settings
  await put(STORES.settings, {
    id: "user-1",
    name: "Dev User",
    email: "dev@spark.local",
    mute_reminders: false,
    created_at: "2026-04-07T09:00:00Z",
  });

  // Mark as seeded
  await put(STORES.meta, { id: "seed_status", seeded: true });
}

// ============ Simulated delay ============

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============ Dev API Implementations ============

export async function getHealth(): Promise<HealthResponse> {
  await delay(100);
  return {
    status: "ok",
    version: "dev-local",
    timestamp: new Date().toISOString(),
  };
}

export async function login(_data: AuthLoginRequest): Promise<AuthLoginResponse> {
  await ensureSeeded();
  await delay();
  return {
    message: "Magic link sent (dev mode — auto-verified)",
    success: true,
  };
}

export async function verifyMagicLink(
  _data: AuthVerifyRequest
): Promise<AuthVerifyResponse> {
  await ensureSeeded();
  await delay();
  const user = await getById<User & { id: string }>(STORES.user, "user-1");
  return {
    user: user ?? {
      id: "user-1",
      email: "dev@spark.local",
      name: "Dev User",
      created_at: "2026-04-07T09:00:00Z",
      last_login_at: new Date().toISOString(),
    },
    access_token: "dev-token-12345",
  };
}

// ============ QUIZ ============

export async function startQuiz(): Promise<QuizStartResponse> {
  await ensureSeeded();
  await delay();

  const sessionId = `quiz-${Date.now()}`;
  await put(STORES.quizSessions, {
    id: sessionId,
    answers: [],
    currentIndex: 0,
    completed: false,
    created_at: new Date().toISOString(),
  });

  return {
    session_id: sessionId,
    session_token: `session-token-${sessionId}`,
    question: mockQuizQuestions[0],
  };
}

export async function submitQuizAnswer(
  data: QuizAnswerRequest
): Promise<QuizAnswerResponse> {
  await ensureSeeded();
  await delay();

  const session = await getById<{
    id: string;
    answers: { question_id: string; answer: unknown }[];
    currentIndex: number;
    completed: boolean;
  }>(STORES.quizSessions, data.session_id);

  if (!session) {
    throw new Error("Quiz session not found");
  }

  session.answers.push({
    question_id: data.question_id,
    answer: data.answer,
  });
  session.currentIndex += 1;

  const nextIndex = session.currentIndex;
  const isComplete = nextIndex >= mockQuizQuestions.length;

  if (isComplete) {
    session.completed = true;
  }

  await put(STORES.quizSessions, session);

  return {
    next_question: isComplete ? null : mockQuizQuestions[nextIndex],
    is_complete: isComplete,
  };
}

export async function completeQuiz(
  data: QuizCompleteRequest
): Promise<QuizCompleteResponse> {
  await ensureSeeded();
  await delay(500);

  const session = await getById<{ id: string; completed: boolean }>(
    STORES.quizSessions,
    data.session_id
  );
  if (session) {
    session.completed = true;
    await put(STORES.quizSessions, session);
  }

  // Generate/return the profile
  const profile = await getById<UserProfile>(STORES.profile, "profile-1");
  return { profile: profile ?? mockProfile };
}

// ============ PROFILE ============

export async function getProfile(): Promise<UserProfile> {
  await ensureSeeded();
  await delay();
  const profile = await getById<UserProfile>(STORES.profile, "profile-1");
  return profile ?? mockProfile;
}

// ============ EXPERIMENTS ============

export async function getExperiments(): Promise<Experiment[]> {
  await ensureSeeded();
  await delay();

  const experiments = await getAll<Experiment>(STORES.experiments);
  const allFeedback = await getAll<ExperimentFeedback>(STORES.feedback);

  // Attach feedback to experiments
  return experiments.map((exp) => ({
    ...exp,
    feedback: allFeedback.find((fb) => fb.experiment_id === exp.id) ?? exp.feedback,
  }));
}

export async function generateExperiments(
  _data?: ExperimentsGenerateRequest
): Promise<ExperimentsGenerateResponse> {
  await ensureSeeded();
  await delay(800);

  const existing = await getAll<Experiment>(STORES.experiments);
  const batchNumber = Math.max(0, ...existing.map((e) => e.generation_batch)) + 1;
  const now = new Date().toISOString();

  const newExperiments: Experiment[] = [
    {
      id: `exp-gen-${Date.now()}-1`,
      user_id: "user-1",
      title: "Teach something you just learned",
      description:
        "Pick something you learned recently and explain it to someone in a 5-minute conversation. Notice what clicks for them and what you understand better after explaining it.",
      time_estimate_minutes: 15,
      difficulty: "easy",
      category: "Knowledge Sharing",
      discovery_teaser: "You might discover your natural teaching instinct",
      strength_tags: ["analytical", "connector"],
      energy_alignment: "collaborative-energy",
      status: "pending",
      generation_batch: batchNumber,
      generated_at: now,
      created_at: now,
    },
    {
      id: `exp-gen-${Date.now()}-2`,
      user_id: "user-1",
      title: "Create a soundtrack for your day",
      description:
        "Pick 5 songs that match the arc of your ideal day — morning energy, midday focus, evening wind-down. Share the playlist with someone and see if they feel the same arc.",
      time_estimate_minutes: 25,
      difficulty: "easy",
      category: "Creative Expression",
      discovery_teaser: "You might discover how music maps to your emotional patterns",
      strength_tags: ["creative", "empathetic"],
      energy_alignment: "creative-flow",
      status: "pending",
      generation_batch: batchNumber,
      generated_at: now,
      created_at: now,
    },
    {
      id: `exp-gen-${Date.now()}-3`,
      user_id: "user-1",
      title: "Map your neighborhood's hidden gems",
      description:
        "Spend 30 minutes walking a familiar route but looking for things you've never noticed — a mural, a garden, a shop. Take photos and write captions for each discovery.",
      time_estimate_minutes: 40,
      difficulty: "medium",
      category: "Exploration",
      discovery_teaser: "You might discover your eye for detail in the everyday",
      strength_tags: ["explorer", "creative"],
      energy_alignment: "solo-deep-work",
      status: "pending",
      generation_batch: batchNumber,
      generated_at: now,
      created_at: now,
    },
  ];

  for (const exp of newExperiments) {
    await put(STORES.experiments, exp);
  }

  return { experiments: newExperiments, batch_number: batchNumber };
}

export async function regenerateExperiments(
  _data?: ExperimentsRegenerateRequest
): Promise<ExperimentsGenerateResponse> {
  // Just calls generate with new content for dev
  return generateExperiments();
}

export async function submitExperimentFeedback(
  experimentId: string,
  data: ExperimentFeedbackRequest
): Promise<ExperimentFeedbackResponse> {
  await ensureSeeded();
  await delay();

  const experiment = await getById<Experiment>(STORES.experiments, experimentId);
  if (!experiment) {
    throw new Error(`Experiment ${experimentId} not found`);
  }

  const feedback: ExperimentFeedback = {
    id: `fb-${Date.now()}`,
    experiment_id: experimentId,
    user_id: "user-1",
    outcome: data.outcome,
    reflection: data.reflection ?? null,
    created_at: new Date().toISOString(),
  };

  await put(STORES.feedback, feedback);

  // Update experiment status
  experiment.status = data.outcome === "skipped" ? "skipped" : "completed";
  experiment.feedback = feedback;
  await put(STORES.experiments, experiment);

  return { feedback, experiment };
}

// ============ INSIGHTS ============

export async function getInsights(): Promise<InsightsData> {
  await ensureSeeded();
  await delay();

  const allFeedback = await getAll<ExperimentFeedback>(STORES.feedback);
  const completedCount = allFeedback.filter((fb) => fb.outcome !== "skipped").length;
  const isUnlocked = completedCount >= 5;

  return {
    ...mockInsights,
    total_experiments_completed: completedCount,
    feedback_entries_count: allFeedback.length,
    is_unlocked: isUnlocked,
    progress_to_unlock: Math.min(completedCount, 5),
  };
}

// ============ JOURNEY ============

export async function getJourney(): Promise<JourneyData> {
  await ensureSeeded();
  await delay();

  const experiments = await getAll<Experiment>(STORES.experiments);
  const allFeedback = await getAll<ExperimentFeedback>(STORES.feedback);

  const completedExperiments = experiments.filter(
    (e) => e.status === "completed" || e.status === "skipped"
  );

  if (completedExperiments.length === 0) {
    return { entries: [], groups: [] };
  }

  const entries = completedExperiments.map((exp) => {
    const fb = allFeedback.find((f) => f.experiment_id === exp.id) ?? null;
    const date = fb?.created_at ?? exp.created_at;
    return {
      experiment: {
        ...exp,
        feedback: fb ?? undefined,
      },
      feedback: fb,
      date: date.split("T")[0],
      week_label: getWeekLabel(date),
    };
  });

  entries.sort((a, b) => b.date.localeCompare(a.date));

  const groupMap = new Map<string, typeof entries>();
  for (const entry of entries) {
    const group = groupMap.get(entry.week_label) ?? [];
    group.push(entry);
    groupMap.set(entry.week_label, group);
  }

  const groups = Array.from(groupMap.entries()).map(([label, groupEntries]) => ({
    label,
    entries: groupEntries,
  }));

  return { entries, groups };
}

function getWeekLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 7) return "This Week";
  if (diffDays < 14) return "Last Week";
  return `${Math.floor(diffDays / 7)} Weeks Ago`;
}

// ============ NOTIFICATIONS ============

export async function getNotifications(): Promise<Notification[]> {
  await ensureSeeded();
  await delay(100);

  const notifications = await getAll<Notification>(STORES.notifications);
  return notifications.filter((n) => !n.dismissed_at);
}

export async function dismissNotification(
  notificationId: string
): Promise<NotificationDismissResponse> {
  await ensureSeeded();
  await delay();

  const notif = await getById<Notification>(STORES.notifications, notificationId);
  if (notif) {
    notif.dismissed_at = new Date().toISOString();
    await put(STORES.notifications, notif);
  }

  return { success: true };
}

// ============ SETTINGS ============

export async function getUserSettings(): Promise<UserSettings> {
  await ensureSeeded();
  await delay();

  const settings = await getById<UserSettings & { id: string }>(
    STORES.settings,
    "user-1"
  );
  return (
    settings ?? {
      name: "Dev User",
      email: "dev@spark.local",
      mute_reminders: false,
      created_at: "2026-04-07T09:00:00Z",
    }
  );
}

export async function updateUserSettings(
  data: UserSettingsUpdate
): Promise<UserSettings> {
  await ensureSeeded();
  await delay();

  const existing = await getById<UserSettings & { id: string }>(
    STORES.settings,
    "user-1"
  );
  const updated = {
    id: "user-1",
    name: data.name ?? existing?.name ?? null,
    email: existing?.email ?? "dev@spark.local",
    mute_reminders: data.mute_reminders ?? existing?.mute_reminders ?? false,
    created_at: existing?.created_at ?? "2026-04-07T09:00:00Z",
  };

  await put(STORES.settings, updated);

  const { ...settings } = updated;
  return settings;
}

// ============ EXPORT ============

export async function exportData(): Promise<ExportDataResponse> {
  await ensureSeeded();
  await delay(300);

  const user = await getById<User>(STORES.user, "user-1");
  const profile = await getById<UserProfile>(STORES.profile, "profile-1");
  const experiments = await getAll<Experiment>(STORES.experiments);
  const insights = await getInsights();

  return {
    user: user ?? {
      id: "user-1",
      email: "dev@spark.local",
      name: "Dev User",
      created_at: "2026-04-07T09:00:00Z",
      last_login_at: new Date().toISOString(),
    },
    profile: profile ?? mockProfile,
    experiments,
    insights,
    exported_at: new Date().toISOString(),
  };
}

// ============ ACCOUNT ============

export async function deleteAccount(): Promise<DeleteAccountResponse> {
  await delay();

  // Clear all stores
  for (const store of Object.values(STORES)) {
    await clearStore(store);
  }

  return {
    message: "Account deleted (dev mode — IndexedDB cleared)",
    deletion_date: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
}

// ============ Dev mode check ============

export function isDevMode(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_DEV_MODE === "true";
}
