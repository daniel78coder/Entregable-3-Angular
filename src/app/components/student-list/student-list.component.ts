import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar los estudiantes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteStudent(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      this.apiService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.id !== id);
        },
        error: (err: Error) => {
          alert('Error al eliminar el estudiante');
          console.error(err);
        }
      });
    }
  }
}
