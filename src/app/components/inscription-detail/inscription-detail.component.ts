import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { Inscription } from "../../models";

@Component({
  selector: "app-inscription-detail",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./inscription-detail.component.html",
  styleUrls: ["./inscription-detail.component.css"],
})
export class InscriptionDetailComponent implements OnInit {
  inscription: Inscription = {
    id: "",
    estudianteID: "",
    cursoID: "",
    status: new Date().toISOString().split("T")[0],
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
    const inscriptionId = this.route.snapshot.paramMap.get("id");

    if (inscriptionId && inscriptionId !== "new") {
      this.isEditMode = true;
      this.loadInscription(inscriptionId);
    }
  }

  loadInscription(id: string): void {
    this.loading = true;
    this.apiService.getInscription(id).subscribe({
      next: (data: Inscription) => {
        this.inscription = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = "Error al cargar la inscripción";
        this.loading = false;
        console.error(err);
      },
    });
  }

  saveInscription(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.apiService
        .updateInscription(this.inscription.id, this.inscription)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(["/inscriptions"]);
          },
          error: (err: Error) => {
            this.error = "Error al actualizar la inscripción";
            this.loading = false;
            console.error(err);
          },
        });
    } else {
      this.apiService.createInscription(this.inscription).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/inscriptions"]);
        },
        error: (err: Error) => {
          this.error = "Error al crear la inscripción";
          this.loading = false;
          console.error(err);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/inscriptions"]);
  }
}
