import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { of, throwError } from "rxjs";

import { ApiService } from "./api.service";
import {
  User,
  Student,
  Course,
  Inscription,
  LoginCredentials,
  LoginResponse,
  ApiResponse,
} from "../models";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  // Datos mock para pruebas
  const mockUsers: User[] = [
    {
      id: "1",
      nombre: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      nombre: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
      createdAt: "2024-02-01",
    },
  ];

  const mockStudents: Student[] = [
    {
      id: "1",
      nombre: "Student One",
      email: "student1@example.com",
      telefono: "123456789",
      curso: "Math",
      fechaDeInicio: "2024-01-01",
    },
  ];

  const mockCourses: Course[] = [
    {
      id: "1",
      titulo: "Mathematics",
      descripcion: "Math course",
      profesor: "Dr. Smith",
      precio: "$100",
    },
  ];

  const mockInscriptions: Inscription[] = [
    {
      id: "1",
      estudianteID: "1",
      cursoID: "1",
      status: "2024-01-01",
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("checkApiStatus", () => {
    it("should return users array on successful request", () => {
      service.checkApiStatus().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockUsers);
    });
  });

  describe("login", () => {
    const validCredentials: LoginCredentials = {
      email: "admin@example.com",
      password: "password123",
    };

    const invalidCredentials: LoginCredentials = {
      email: "wrong@example.com",
      password: "wrongpassword",
    };

    it("should return login response with valid credentials", () => {
      service.login(validCredentials).subscribe((response) => {
        expect(response.user.email).toBe(validCredentials.email);
        expect(response.token).toContain("mock-jwt-token-");
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockUsers);
    });

    it("should throw error with invalid credentials", () => {
      service.login(invalidCredentials).subscribe({
        next: () => fail("Should have failed with invalid credentials"),
        error: (error) => {
          expect(error.message).toBe("Credenciales inválidas");
        },
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      req.flush(mockUsers);
    });

    it("should use mock data when HTTP request fails", (done) => {
      service.login(validCredentials).subscribe((response) => {
        expect(response.user.email).toBe(validCredentials.email);
        expect(response.token).toContain("mock-token-");
        done();
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });
  });

  describe("Student methods", () => {
    const newStudent: Omit<Student, "id"> = {
      nombre: "New Student",
      email: "new@example.com",
      telefono: "987654321",
      curso: "Science",
      fechaDeInicio: "2024-01-01",
    };

    it("getStudents should return students array", () => {
      service.getStudents().subscribe((students) => {
        expect(students).toEqual(mockStudents);
      });

      const req = httpMock.expectOne(
        "https://68a630e6639c6a54e99e3059.mockapi.io/students"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockStudents);
    });

    it("getStudents should use mock data on error", (done) => {
      service.getStudents().subscribe((students) => {
        expect(students).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(
        "https://68a630e6639c6a54e99e3059.mockapi.io/students"
      );
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });

    it("getStudent should return specific student", () => {
      const studentId = "1";
      service.getStudent(studentId).subscribe((student) => {
        expect(student.id).toBe(studentId);
      });

      const req = httpMock.expectOne(
        `https://68a630e6639c6a54e99e3059.mockapi.io/students/${studentId}`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockStudents[0]);
    });

    it("createStudent should create new student", () => {
      service.createStudent(newStudent as Student).subscribe((student) => {
        expect(student.nombre).toBe(newStudent.nombre);
        expect(student.id).toBeDefined();
      });

      const req = httpMock.expectOne(
        "https://68a630e6639c6a54e99e3059.mockapi.io/students"
      );
      expect(req.request.method).toBe("POST");
      req.flush({ ...newStudent, id: "123" });
    });

    it("updateStudent should update existing student", () => {
      const studentId = "1";
      const updatedStudent = { ...mockStudents[0], name: "Updated Student" };

      service.updateStudent(studentId, updatedStudent).subscribe((student) => {
        expect(student.nombre).toBe("Updated Student");
      });

      const req = httpMock.expectOne(
        `https://68a630e6639c6a54e99e3059.mockapi.io/students/${studentId}`
      );
      expect(req.request.method).toBe("PUT");
      req.flush(updatedStudent);
    });

    it("deleteStudent should delete student", () => {
      const studentId = "1";

      service.deleteStudent(studentId).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(
        `https://68a630e6639c6a54e99e3059.mockapi.io/students/${studentId}`
      );
      expect(req.request.method).toBe("DELETE");
      req.flush({ success: true });
    });
  });

  describe("Course methods", () => {
    it("getCourses should return courses array", () => {
      service.getCourses().subscribe((courses) => {
        expect(courses).toEqual(mockCourses);
      });

      const req = httpMock.expectOne(
        "https://68a630e6639c6a54e99e3059.mockapi.io/courses"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockCourses);
    });

    it("getCourses should use mock data on error", (done) => {
      service.getCourses().subscribe((courses) => {
        expect(courses).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(
        "https://68a630e6639c6a54e99e3059.mockapi.io/courses"
      );
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });
  });

  describe("User methods", () => {
    const newUser: Omit<User, "id"> = {
      nombre: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "user",
      createdAt: "2024-01-01",
    };

    it("getUsers should return users array", () => {
      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockUsers);
    });

    it("getUsers should use mock data on error", (done) => {
      service.getUsers().subscribe((users) => {
        expect(users.length).toBe(3); // Los 3 usuarios mock del servicio
        done();
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });

    it("getUser should return specific user", () => {
      const userId = "1";
      service.getUser(userId).subscribe((user) => {
        expect(user.id).toBe(userId);
      });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/user/${userId}`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockUsers[0]);
    });

    it("createUser should create new user", () => {
      service.createUser(newUser as User).subscribe((user) => {
        expect(user.nombre).toBe(newUser.nombre);
        expect(user.id).toBeDefined();
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/user"
      );
      expect(req.request.method).toBe("POST");
      req.flush({ ...newUser, id: "123" });
    });

    it("updateUser should update existing user", () => {
      const userId = "1";
      const updatedUser = { ...mockUsers[0], name: "Updated User" };

      service.updateUser(userId, updatedUser).subscribe((user) => {
        expect(user.nombre).toBe("Updated User");
      });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/user/${userId}`
      );
      expect(req.request.method).toBe("PUT");
      req.flush(updatedUser);
    });

    it("deleteUser should delete user", () => {
      const userId = "1";

      service.deleteUser(userId).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/user/${userId}`
      );
      expect(req.request.method).toBe("DELETE");
      req.flush({ success: true });
    });
  });

  describe("Inscription methods", () => {
    const newInscription: Omit<Inscription, "id"> = {
      estudianteID: "1",
      cursoID: "1",
      status: "2024-01-01",
    };

    it("getInscriptions should return inscriptions array", () => {
      service.getInscriptions().subscribe((inscriptions) => {
        expect(inscriptions).toEqual(mockInscriptions);
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions"
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockInscriptions);
    });

    it("getInscriptions should use mock data on error", (done) => {
      service.getInscriptions().subscribe((inscriptions) => {
        expect(inscriptions).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions"
      );
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });

    it("createInscription should create new inscription", () => {
      service
        .createInscription(newInscription as Inscription)
        .subscribe((inscription) => {
          expect(inscription.estudianteID).toBe(newInscription.estudianteID);
          expect(inscription.id).toBeDefined();
        });

      const req = httpMock.expectOne(
        "https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions"
      );
      expect(req.request.method).toBe("POST");
      req.flush({ ...newInscription, id: "123" });
    });

    it("getInscription should return specific inscription", () => {
      const inscriptionId = "1";
      service.getInscription(inscriptionId).subscribe((inscription) => {
        expect(inscription.id).toBe(inscriptionId);
      });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions/${inscriptionId}`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockInscriptions[0]);
    });

    it("updateInscription should update existing inscription", () => {
      const inscriptionId = "1";
      const updatedInscription = { ...mockInscriptions[0], studentId: "2" };

      service
        .updateInscription(inscriptionId, updatedInscription)
        .subscribe((inscription) => {
          expect(inscription.estudianteID).toBe("2");
        });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions/${inscriptionId}`
      );
      expect(req.request.method).toBe("PUT");
      req.flush(updatedInscription);
    });

    it("deleteInscription should delete inscription", () => {
      const inscriptionId = "1";

      service.deleteInscription(inscriptionId).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(
        `https://68a63f2b639c6a54e99e5050.mockapi.io/inscriptions/${inscriptionId}`
      );
      expect(req.request.method).toBe("DELETE");
      req.flush({ success: true });
    });
  });
});
