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
} from "./types";
import * as devDb from "./dev-db";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("spark_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      data?.detail || `Request failed with status ${response.status}`,
      data
    );
  }

  return response.json();
}

// ============ HEALTH ============

export function getHealth(): Promise<HealthResponse> {
  if (devDb.isDevMode()) return devDb.getHealth();
  return request<HealthResponse>("/api/health");
}

// ============ AUTH ============

export function login(data: AuthLoginRequest): Promise<AuthLoginResponse> {
  if (devDb.isDevMode()) return devDb.login(data);
  return request<AuthLoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyMagicLink(
  data: AuthVerifyRequest
): Promise<AuthVerifyResponse> {
  if (devDb.isDevMode()) return devDb.verifyMagicLink(data);
  return request<AuthVerifyResponse>(
    `/api/auth/verify?token=${encodeURIComponent(data.token)}`
  );
}

// ============ QUIZ ============

export function startQuiz(): Promise<QuizStartResponse> {
  if (devDb.isDevMode()) return devDb.startQuiz();
  return request<QuizStartResponse>("/api/quiz/start", {
    method: "POST",
  });
}

export function submitQuizAnswer(
  data: QuizAnswerRequest
): Promise<QuizAnswerResponse> {
  if (devDb.isDevMode()) return devDb.submitQuizAnswer(data);
  return request<QuizAnswerResponse>("/api/quiz/answer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function completeQuiz(
  data: QuizCompleteRequest
): Promise<QuizCompleteResponse> {
  if (devDb.isDevMode()) return devDb.completeQuiz(data);
  return request<QuizCompleteResponse>("/api/quiz/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ PROFILE ============

export function getProfile(): Promise<UserProfile> {
  if (devDb.isDevMode()) return devDb.getProfile();
  return request<UserProfile>("/api/profile");
}

// ============ EXPERIMENTS ============

export function generateExperiments(
  data?: ExperimentsGenerateRequest
): Promise<ExperimentsGenerateResponse> {
  if (devDb.isDevMode()) return devDb.generateExperiments(data);
  return request<ExperimentsGenerateResponse>("/api/experiments/generate", {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

export function regenerateExperiments(
  data?: ExperimentsRegenerateRequest
): Promise<ExperimentsGenerateResponse> {
  if (devDb.isDevMode()) return devDb.regenerateExperiments(data);
  return request<ExperimentsGenerateResponse>("/api/experiments/regenerate", {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

export function getExperiments(): Promise<Experiment[]> {
  if (devDb.isDevMode()) return devDb.getExperiments();
  return request<Experiment[]>("/api/experiments");
}

export function submitExperimentFeedback(
  experimentId: string,
  data: ExperimentFeedbackRequest
): Promise<ExperimentFeedbackResponse> {
  if (devDb.isDevMode()) return devDb.submitExperimentFeedback(experimentId, data);
  return request<ExperimentFeedbackResponse>(
    `/api/experiments/${experimentId}/feedback`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

// ============ INSIGHTS ============

export function getInsights(): Promise<InsightsData> {
  if (devDb.isDevMode()) return devDb.getInsights();
  return request<InsightsData>("/api/insights");
}

// ============ JOURNEY ============

export function getJourney(): Promise<JourneyData> {
  if (devDb.isDevMode()) return devDb.getJourney();
  return request<JourneyData>("/api/journey");
}

// ============ NOTIFICATIONS ============

export function getNotifications(): Promise<Notification[]> {
  if (devDb.isDevMode()) return devDb.getNotifications();
  return request<Notification[]>("/api/notifications");
}

export function dismissNotification(
  notificationId: string
): Promise<NotificationDismissResponse> {
  if (devDb.isDevMode()) return devDb.dismissNotification(notificationId);
  return request<NotificationDismissResponse>(
    `/api/notifications/${notificationId}/dismiss`,
    {
      method: "PATCH",
    }
  );
}

// ============ SETTINGS ============

export function getUserSettings(): Promise<UserSettings> {
  if (devDb.isDevMode()) return devDb.getUserSettings();
  return request<UserSettings>("/api/settings");
}

export function updateUserSettings(
  data: UserSettingsUpdate
): Promise<UserSettings> {
  if (devDb.isDevMode()) return devDb.updateUserSettings(data);
  return request<UserSettings>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============ EXPORT ============

export function exportData(): Promise<ExportDataResponse> {
  if (devDb.isDevMode()) return devDb.exportData();
  return request<ExportDataResponse>("/api/export");
}

// ============ ACCOUNT ============

export function deleteAccount(): Promise<DeleteAccountResponse> {
  if (devDb.isDevMode()) return devDb.deleteAccount();
  return request<DeleteAccountResponse>("/api/account", {
    method: "DELETE",
  });
}

export { ApiError };
