import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "roleDisplay",
  standalone: true,
})
export class RoleDisplayPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return "Sin rol";

    const roleMap: { [key: string]: string } = {
      admin: "Administrador",
      teacher: "Profesor",
      student: "Estudiante",
    };

    return roleMap[value] || value;
  }
}
