import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '';

    const date = new Date(value);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
