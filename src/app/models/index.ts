// models/index.ts
export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course: string;
  enrollmentDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  active?: boolean;
  createdAt?: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: number;
  description?: string;
  startDate?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}
export interface Inscription {
  id: string;
  studentId: string;
  courseId: string;
  inscriptionDate: string;
  student?: Student;
  course?: Course;
}
