export const Status = {
  Applied: "Applied",
  Screening: "Screening",
  Interview: "Interview",
  Offer: "Offer",
  Closed: "Closed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Location = {
  Remote: "remote",
  Onsite: "onsite",
  Hybrid: "hybrid",
} as const;

export type Location = (typeof Location)[keyof typeof Location];

export interface User {
  email: string;
  name?: string;
  id: string;
  userName?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: Status;
  location: Location;
  appliedDate: string;
  nextFollowUpDate?: string;
  salaryExpectation?: number;
  notes?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationType {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationsData {
  applications: JobApplication[];
  pagination: PaginationType;
}

export interface JobApplicationInput {
  company: string;
  role: string;
  status: Status;
  location: Location;
  appliedDate: string;
  nextFollowUpDate?: string;
  salaryExpectation?: number | string;
  notes?: string;
}

export interface StatsResponse {
  counts: Record<Status, number>;
  total: number;
  responseRate: number;
  overdueFollowUps: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface ApplicationState {
  applications: JobApplication[];
  pagination?: PaginationType;
  stats?: StatsResponse;
  loading: boolean;
  error: string | null;
}

export type ApplicationAction =
  | { type: "SET_ALL"; payload: JobApplication[] | { applications: JobApplication[]; pagination?: PaginationType; stats?: StatsResponse } }
  | { type: "ADD"; payload: JobApplication }
  | { type: "UPDATE"; payload: JobApplication }
  | { type: "DELETE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_STATS"; payload: StatsResponse };
