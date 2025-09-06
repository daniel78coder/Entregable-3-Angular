export interface Student {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  curso: string;
  fechaDeInicio?: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  active?: boolean;
  createdAt?: string;
}

export interface Course {
  id: string;
  titulo: string;
  profesor: string;
  descripcion?: string;
  precio?: string;
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
  estudianteID: string;
  cursoID: string;
  status: string;
  student?: Student;
  course?: Course;
}
