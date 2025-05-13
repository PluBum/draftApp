export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  role: "admin" | "user";
  token: string;
  access?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password2: string;
}

export interface Application {
  id: number;
  title: string;
  description: string;
  status: "new" | "in_progress" | "completed" | "rejected";
  status_display: string;
  created_at: string;
  updated_at: string;
  user_email: string;
  admin_comment?: string;
  image?: string;
  admin_image?: string;
  image_url?: string;
  admin_image_url?: string;
}

export interface CreateApplicationRequest {
  title: string;
  description: string;
}

export interface UpdateApplicationRequest {
  title?: string;
  description?: string;
  status?: "new" | "in_progress" | "completed" | "rejected";
  admin_comment?: string;
}
