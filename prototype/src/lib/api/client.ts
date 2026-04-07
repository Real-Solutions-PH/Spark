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
  return request<HealthResponse>("/api/health");
}

// ============ AUTH ============

export function login(data: AuthLoginRequest): Promise<AuthLoginResponse> {
  return request<AuthLoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyMagicLink(
  data: AuthVerifyRequest
): Promise<AuthVerifyResponse> {
  return request<AuthVerifyResponse>(
    `/api/auth/verify?token=${encodeURIComponent(data.token)}`
  );
}

// ============ QUIZ ============

export function startQuiz(): Promise<QuizStartResponse> {
  return request<QuizStartResponse>("/api/quiz/start", {
    method: "POST",
  });
}

export function submitQuizAnswer(
  data: QuizAnswerRequest
): Promise<QuizAnswerResponse> {
  return request<QuizAnswerResponse>("/api/quiz/answer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function completeQuiz(
  data: QuizCompleteRequest
): Promise<QuizCompleteResponse> {
  return request<QuizCompleteResponse>("/api/quiz/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============ PROFILE ============

export function getProfile(): Promise<UserProfile> {
  return request<UserProfile>("/api/profile");
}

// ============ EXPERIMENTS ============

export function generateExperiments(
  data?: ExperimentsGenerateRequest
): Promise<ExperimentsGenerateResponse> {
  return request<ExperimentsGenerateResponse>("/api/experiments/generate", {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

export function regenerateExperiments(
  data?: ExperimentsRegenerateRequest
): Promise<ExperimentsGenerateResponse> {
  return request<ExperimentsGenerateResponse>("/api/experiments/regenerate", {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

export function getExperiments(): Promise<Experiment[]> {
  return request<Experiment[]>("/api/experiments");
}

export function submitExperimentFeedback(
  experimentId: string,
  data: ExperimentFeedbackRequest
): Promise<ExperimentFeedbackResponse> {
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
  return request<InsightsData>("/api/insights");
}

// ============ JOURNEY ============

export function getJourney(): Promise<JourneyData> {
  return request<JourneyData>("/api/journey");
}

// ============ NOTIFICATIONS ============

export function getNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/api/notifications");
}

export function dismissNotification(
  notificationId: string
): Promise<NotificationDismissResponse> {
  return request<NotificationDismissResponse>(
    `/api/notifications/${notificationId}/dismiss`,
    {
      method: "PATCH",
    }
  );
}

// ============ SETTINGS ============

export function getUserSettings(): Promise<UserSettings> {
  return request<UserSettings>("/api/settings");
}

export function updateUserSettings(
  data: UserSettingsUpdate
): Promise<UserSettings> {
  return request<UserSettings>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============ EXPORT ============

export function exportData(): Promise<ExportDataResponse> {
  return request<ExportDataResponse>("/api/export");
}

// ============ ACCOUNT ============

export function deleteAccount(): Promise<DeleteAccountResponse> {
  return request<DeleteAccountResponse>("/api/account", {
    method: "DELETE",
  });
}

export { ApiError };
