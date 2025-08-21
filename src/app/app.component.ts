import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { initializeApp } from "./store/auth/auth.actions";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "Sistema de Gestion de Estudiantes (version 0.3)";

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit(): void {
    this.store.dispatch(initializeApp());

    this.apiService.checkApiStatus().subscribe({
      next: () => console.log("✅ MockAPI conectado correctamente"),
      error: (err: Error) =>
        console.log("❌ Error conectando a MockAPI - Usando datos locales"),
    });
  }
}
