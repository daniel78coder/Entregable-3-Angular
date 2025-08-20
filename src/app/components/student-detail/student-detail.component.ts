import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { Student } from '../../models';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormatDatePipe],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student = {
    id: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    enrollmentDate: new Date().toISOString().split('T')[0] // ← Asegurar que siempre tenga valor
  };
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');

    if (studentId && studentId !== 'new') {
      this.isEditMode = true;
      this.loadStudent(studentId);
    }
  }

  loadStudent(id: string): void {
    this.loading = true;
    this.apiService.getStudent(id).subscribe({
      next: (data: Student) => {
        // Asegurar que enrollmentDate siempre tenga un valor
        this.student = {
          ...data,
          enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0]
        };
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar el estudiante';
        this.loading = false;
        console.error(err);
      }
    });
  }

  saveStudent(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.apiService.updateStudent(this.student.id, this.student).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/students']);
        },
        error: (err: Error) => {
          this.error = 'Error al actualizar el estudiante';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.apiService.createStudent(this.student).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/students']);
        },
        error: (err: Error) => {
          this.error = 'Error al crear el estudiante';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
