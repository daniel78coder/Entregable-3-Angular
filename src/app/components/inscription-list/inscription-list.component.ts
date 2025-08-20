import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Inscription } from '../../models';
import {  FormatDatePipe } from '../../pipes/format-date.pipe';

@Component({
  selector: 'app-inscription-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatDatePipe],
  templateUrl: './inscription-list.component.html',
  styleUrls: ['./inscription-list.component.css']
})
export class InscriptionListComponent implements OnInit {
  inscriptions: Inscription[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadInscriptions();
  }

  loadInscriptions(): void {
    this.loading = true;
    this.apiService.getInscriptions().subscribe({
      next: (data: Inscription[]) => {
        this.inscriptions = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar las inscripciones';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteInscription(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      this.apiService.deleteInscription(id).subscribe({
        next: () => {
          this.inscriptions = this.inscriptions.filter(ins => ins.id !== id);
        },
        error: (err: Error) => {
          alert('Error al eliminar la inscripción');
          console.error(err);
        }
      });
    }
  }
}
