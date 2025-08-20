import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { RoleDisplayPipe } from '../../pipes/role-display.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { User } from '../../models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RoleDisplayPipe, FormatDatePipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers().subscribe({
      next: (data: User[]) => {
        // Añadir createdAt si no existe en los datos
        this.users = data.map(user => ({
          ...user,
          createdAt: user.createdAt || new Date().toISOString()
        }));
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (err: Error) => {
          alert('Error al eliminar el usuario');
          console.error(err);
        }
      });
    }
  }
}
