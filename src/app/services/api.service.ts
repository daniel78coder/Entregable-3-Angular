import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import {
  User,
  Student,
  Course,
  Inscription,
  LoginCredentials,
  LoginResponse,
  ApiResponse
} from '../models';

// URLs de las dos cuentas MockAPI
const BASE_URL_1 = 'https://68a630e6639c6a54e99e3059.mockapi.io';
const BASE_URL_2 = 'https://68a63f2b639c6a54e99e5050.mockapi.io';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // === MÉTODO DE DIAGNÓSTICO ===
  checkApiStatus(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL_2}/user`);
  }

  // === LOGIN ===
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.get<User[]>(`${BASE_URL_2}/user`).pipe(
      map(users => {
        const user = users.find(u =>
          u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            },
            token: 'mock-jwt-token-' + user.id
          };
        } else {
          throw new Error('Credenciales inválidas');
        }
      }),
      catchError(error => {
        // Datos mockeados para desarrollo
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
          },
          {
            id: '2',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
          },
          {
            id: '3',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'user'
          }
        ];

        const user = mockUsers.find(u =>
          u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const response: LoginResponse = {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            },
            token: 'mock-token-' + user.id
          };
          return of(response).pipe(delay(1000));
        }

        return throwError(() => new Error('Credenciales inválidas'));
      })
    );
  }

  // === MÉTODOS PARA ESTUDIANTES (BASE_URL_1) ===
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${BASE_URL_1}/students`).pipe(
      catchError(error => {
        console.log('Usando datos mock de estudiantes');
        const mockStudents: Student[] = [];
        return of(mockStudents).pipe(delay(800));
      })
    );
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${BASE_URL_1}/students/${id}`).pipe(
      catchError(error => {
        const mockStudent: Student = {
          id: id,
          name: '',
          email: '',
          phone: '',
          course: '',
          enrollmentDate: new Date().toISOString().split('T')[0]
        };
        return of(mockStudent).pipe(delay(500));
      })
    );
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${BASE_URL_1}/students`, student).pipe(
      catchError(error => {
        const mockResponse: Student = {
          ...student,
          id: Math.random().toString(36).substr(2, 9),
          enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0]
        };
        return of(mockResponse).pipe(delay(800));
      })
    );
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${BASE_URL_1}/students/${id}`, student).pipe(
      catchError(error => {
        return of({...student, id}).pipe(delay(600));
      })
    );
  }

  deleteStudent(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${BASE_URL_1}/students/${id}`).pipe(
      catchError(error => {
        const response: ApiResponse = { success: true };
        return of(response).pipe(delay(400));
      })
    );
  }

  // === MÉTODOS PARA CURSOS (BASE_URL_1) ===
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${BASE_URL_1}/courses`).pipe(
      catchError(error => {
        console.log('Usando datos mock de cursos');
        const mockCourses: Course[] = [];
        return of(mockCourses).pipe(delay(800));
      })
    );
  }

  // === MÉTODOS PARA USUARIOS (BASE_URL_2) ===
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL_2}/user`).pipe(
      catchError(error => {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: '2024-01-01'
          },
          {
            id: '2',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            createdAt: '2024-02-01'
          },
          {
            id: '3',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            createdAt: '2024-03-01'
          }
        ];
        return of(mockUsers).pipe(delay(800));
      })
    );
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${BASE_URL_2}/user/${id}`).pipe(
      catchError(error => {
        const response: ApiResponse = { success: true };
        return of(response).pipe(delay(400));
      })
    );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${BASE_URL_2}/user/${id}`).pipe(
      catchError(error => {
        const mockUser: User = {
          id: id,
          name: 'Usuario Ejemplo',
          email: 'usuario@example.com',
          role: 'user'
        };
        return of(mockUser).pipe(delay(500));
      })
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${BASE_URL_2}/user`, user).pipe(
      catchError(error => {
        const mockResponse: User = {
          ...user,
          id: Math.random().toString(36).substr(2, 9)
        };
        return of(mockResponse).pipe(delay(800));
      })
    );
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${BASE_URL_2}/user/${id}`, user).pipe(
      catchError(error => {
        return of({...user, id}).pipe(delay(600));
      })
    );
  }

  // === MÉTODOS PARA INSCRIPCIONES (BASE_URL_2) ===
  getInscriptions(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${BASE_URL_2}/inscriptions`).pipe(
      catchError(error => {
        console.log('Usando datos mock de inscripciones');
        const mockInscriptions: Inscription[] = [];
        return of(mockInscriptions).pipe(delay(800));
      })
    );
  }

  createInscription(inscription: Inscription): Observable<Inscription> {
    return this.http.post<Inscription>(`${BASE_URL_2}/inscriptions`, inscription).pipe(
      catchError(error => {
        const mockResponse: Inscription = {
          ...inscription,
          id: Math.random().toString(36).substr(2, 9),
          inscriptionDate: inscription.inscriptionDate || new Date().toISOString().split('T')[0]
        };
        return of(mockResponse).pipe(delay(800));
      })
    );
  }

  deleteInscription(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${BASE_URL_2}/inscriptions/${id}`).pipe(
      catchError(error => {
        const response: ApiResponse = { success: true };
        return of(response).pipe(delay(400));
      })
    );
  }

  getInscription(id: string): Observable<Inscription> {
    return this.http.get<Inscription>(`${BASE_URL_2}/inscriptions/${id}`).pipe(
      catchError(error => {
        const mockInscription: Inscription = {
          id: id,
          studentId: '',
          courseId: '',
          inscriptionDate: new Date().toISOString().split('T')[0]
        };
        return of(mockInscription).pipe(delay(500));
      })
    );
  }

  updateInscription(id: string, inscription: Inscription): Observable<Inscription> {
    return this.http.put<Inscription>(`${BASE_URL_2}/inscriptions/${id}`, inscription).pipe(
      catchError(error => {
        return of({...inscription, id}).pipe(delay(600));
      })
    );
  }
}