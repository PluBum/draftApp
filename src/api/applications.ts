import httpClient from "./httpClient";

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
}

export interface CreateApplicationRequest {
  title: string;
  description: string;
  image?: File;
}

export interface UpdateApplicationRequest {
  title?: string;
  description?: string;
  status?: "new" | "in_progress" | "completed" | "rejected";
  admin_comment?: string;
}

export interface RespondToApplicationRequest {
  admin_comment: string;
  employee_name: string;
  room: string;
  admin_image?: File;
}

export const getApplications = () =>
  httpClient<Application[]>({
    url: "/applications/",
    method: "GET",
  });

export const createApplication = (data: CreateApplicationRequest | FormData) =>
  httpClient<Application>({
    url: "/applications/",
    method: "POST",
    data,
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const updateApplication = (id: number, data: UpdateApplicationRequest) =>
  httpClient<Application>({
    url: `/applications/${id}/`,
    method: "PATCH",
    data,
  });

export const respondToApplication = (id: number, data: RespondToApplicationRequest | FormData) =>
  httpClient<Application>({
    url: `/applications/${id}/respond/`,
    method: "PATCH",
    data,
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const deleteApplication = (id: number) =>
  httpClient<void>({
    url: `/applications/${id}/`,
    method: "DELETE",
  });

export const getApplication = (id: number) =>
  httpClient<Application>({
    url: `/applications/${id}/`,
    method: "GET",
  });
