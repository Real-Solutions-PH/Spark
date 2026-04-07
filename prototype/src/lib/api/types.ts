// ============ ENUMS ============

export type ExperimentDifficulty = "easy" | "medium" | "stretch";
export type ExperimentStatus = "pending" | "active" | "completed" | "skipped";
export type FeedbackOutcome = "loved" | "okay" | "not_for_me" | "skipped";
export type NotificationType = "nudge" | "insight_unlocked";

// ============ CORE ENTITIES ============

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  last_login_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  strength_scores: Record<string, number>; // e.g., { "creative": 0.8, "analytical": 0.6 }
  energy_type: string; // e.g., "solo-deep-work", "collaborative-energy"
  skill_pattern: string; // e.g., "builder", "connector", "optimizer"
  motivation_driver: string; // SDT: "autonomy", "competence", "relatedness"
  top_strengths: Strength[];
  is_active: boolean;
  created_at: string;
}

export interface Strength {
  name: string;
  score: number;
  description: string;
  category: string;
}

export interface QuizSession {
  id: string;
  user_id: string | null;
  session_token: string;
  answers: QuizAnswer[];
  completed_at: string | null;
  created_at: string;
}

export interface QuizAnswer {
  question_id: string;
  answer: string | string[] | number | number[];
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  description?: string;
  type: "single_select" | "multi_select" | "slider" | "rank_order";
  options?: QuizOption[];
  slider_config?: {
    min: number;
    max: number;
    min_label: string;
    max_label: string;
    step: number;
  };
  dimensions: string[];
  progress: number; // 0-100
  total_questions: number;
  current_index: number;
}

export interface QuizOption {
  id: string;
  text: string;
  emoji?: string;
}

export interface Experiment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  time_estimate_minutes: number;
  difficulty: ExperimentDifficulty;
  category: string;
  discovery_teaser: string;
  strength_tags: string[];
  energy_alignment: string;
  status: ExperimentStatus;
  generation_batch: number;
  generated_at: string;
  created_at: string;
  feedback?: ExperimentFeedback;
}

export interface ExperimentFeedback {
  id: string;
  experiment_id: string;
  user_id: string;
  outcome: FeedbackOutcome;
  reflection: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  experiment_id: string;
  experiment_title: string;
  type: NotificationType;
  message: string;
  shown_at: string | null;
  dismissed_at: string | null;
  created_at: string;
}

export interface InsightPattern {
  type: "light_up" | "avoid" | "emerging_strength";
  title: string;
  description: string;
  evidence: string[]; // experiment titles that support this
  strength_tags: string[];
  score: number;
}

export interface InsightsData {
  light_up_patterns: InsightPattern[];
  avoid_patterns: InsightPattern[];
  emerging_strengths: InsightPattern[];
  total_experiments_completed: number;
  feedback_entries_count: number;
  unlock_threshold: number; // 5
  is_unlocked: boolean;
  progress_to_unlock: number; // 0-5
}

export interface JourneyEntry {
  experiment: Experiment;
  feedback: ExperimentFeedback | null;
  date: string;
  week_label: string;
}

export interface JourneyData {
  entries: JourneyEntry[];
  groups: {
    label: string;
    entries: JourneyEntry[];
  }[];
}

// ============ API REQUEST/RESPONSE TYPES ============

export interface QuizStartResponse {
  session_id: string;
  session_token: string;
  question: QuizQuestion;
}

export interface QuizAnswerRequest {
  session_id: string;
  question_id: string;
  answer: string | string[] | number | number[];
}

export interface QuizAnswerResponse {
  next_question: QuizQuestion | null;
  is_complete: boolean;
}

export interface QuizCompleteRequest {
  session_id: string;
}

export interface QuizCompleteResponse {
  profile: UserProfile;
}

export interface AuthLoginRequest {
  email: string;
}

export interface AuthLoginResponse {
  message: string;
  success: boolean;
}

export interface AuthVerifyRequest {
  token: string;
}

export interface AuthVerifyResponse {
  user: User;
  access_token: string;
}

export interface ExperimentsGenerateRequest {
  profile_id?: string;
}

export interface ExperimentsGenerateResponse {
  experiments: Experiment[];
  batch_number: number;
}

export interface ExperimentsRegenerateRequest {
  feedback_summary?: string;
}

export interface ExperimentFeedbackRequest {
  outcome: FeedbackOutcome;
  reflection?: string;
}

export interface ExperimentFeedbackResponse {
  feedback: ExperimentFeedback;
  experiment: Experiment;
}

export interface NotificationDismissResponse {
  success: boolean;
}

export interface ExportDataResponse {
  user: User;
  profile: UserProfile;
  experiments: Experiment[];
  insights: InsightsData;
  exported_at: string;
}

export interface DeleteAccountResponse {
  message: string;
  deletion_date: string; // 30 days from now
}

export interface HealthResponse {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: string;
}

export interface UserSettingsUpdate {
  name?: string;
  mute_reminders?: boolean;
}

export interface UserSettings {
  name: string | null;
  email: string;
  mute_reminders: boolean;
  created_at: string;
}
