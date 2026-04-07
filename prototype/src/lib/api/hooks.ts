import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import * as api from "./client";
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

// ============ QUERY KEYS ============

export const queryKeys = {
  health: ["health"] as const,
  profile: ["profile"] as const,
  experiments: ["experiments"] as const,
  insights: ["insights"] as const,
  journey: ["journey"] as const,
  notifications: ["notifications"] as const,
  settings: ["settings"] as const,
};

// ============ HEALTH ============

export function useHealth(
  options?: Partial<UseQueryOptions<HealthResponse>>
) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.getHealth,
    ...options,
  });
}

// ============ AUTH ============

export function useLogin() {
  return useMutation<AuthLoginResponse, Error, AuthLoginRequest>({
    mutationFn: api.login,
  });
}

export function useVerifyMagicLink() {
  const queryClient = useQueryClient();
  return useMutation<AuthVerifyResponse, Error, AuthVerifyRequest>({
    mutationFn: api.verifyMagicLink,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("spark_token", data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

// ============ QUIZ ============

export function useStartQuiz() {
  return useMutation<QuizStartResponse, Error, void>({
    mutationFn: api.startQuiz,
  });
}

export function useSubmitQuizAnswer() {
  return useMutation<QuizAnswerResponse, Error, QuizAnswerRequest>({
    mutationFn: api.submitQuizAnswer,
  });
}

export function useCompleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation<QuizCompleteResponse, Error, QuizCompleteRequest>({
    mutationFn: api.completeQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

// ============ PROFILE ============

export function useProfile(
  options?: Partial<UseQueryOptions<UserProfile>>
) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: api.getProfile,
    ...options,
  });
}

// ============ EXPERIMENTS ============

export function useExperiments(
  options?: Partial<UseQueryOptions<Experiment[]>>
) {
  return useQuery({
    queryKey: queryKeys.experiments,
    queryFn: api.getExperiments,
    ...options,
  });
}

export function useGenerateExperiments() {
  const queryClient = useQueryClient();
  return useMutation<
    ExperimentsGenerateResponse,
    Error,
    ExperimentsGenerateRequest | void
  >({
    mutationFn: (data) => api.generateExperiments(data || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiments });
    },
  });
}

export function useRegenerateExperiments() {
  const queryClient = useQueryClient();
  return useMutation<
    ExperimentsGenerateResponse,
    Error,
    ExperimentsRegenerateRequest | void
  >({
    mutationFn: (data) => api.regenerateExperiments(data || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiments });
    },
  });
}

export function useSubmitExperimentFeedback() {
  const queryClient = useQueryClient();
  return useMutation<
    ExperimentFeedbackResponse,
    Error,
    { experimentId: string } & ExperimentFeedbackRequest
  >({
    mutationFn: ({ experimentId, ...data }) =>
      api.submitExperimentFeedback(experimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiments });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights });
      queryClient.invalidateQueries({ queryKey: queryKeys.journey });
    },
  });
}

// ============ INSIGHTS ============

export function useInsights(
  options?: Partial<UseQueryOptions<InsightsData>>
) {
  return useQuery({
    queryKey: queryKeys.insights,
    queryFn: api.getInsights,
    ...options,
  });
}

// ============ JOURNEY ============

export function useJourney(
  options?: Partial<UseQueryOptions<JourneyData>>
) {
  return useQuery({
    queryKey: queryKeys.journey,
    queryFn: api.getJourney,
    ...options,
  });
}

// ============ NOTIFICATIONS ============

export function useNotifications(
  options?: Partial<UseQueryOptions<Notification[]>>
) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: api.getNotifications,
    refetchInterval: 60000, // Poll every minute
    ...options,
  });
}

export function useDismissNotification() {
  const queryClient = useQueryClient();
  return useMutation<NotificationDismissResponse, Error, string>({
    mutationFn: api.dismissNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// ============ SETTINGS ============

export function useUserSettings(
  options?: Partial<UseQueryOptions<UserSettings>>
) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: api.getUserSettings,
    ...options,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  return useMutation<UserSettings, Error, UserSettingsUpdate>({
    mutationFn: api.updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

// ============ EXPORT ============

export function useExportData() {
  return useMutation<ExportDataResponse, Error, void>({
    mutationFn: api.exportData,
  });
}

// ============ ACCOUNT ============

export function useDeleteAccount() {
  return useMutation<DeleteAccountResponse, Error, void>({
    mutationFn: api.deleteAccount,
  });
}
