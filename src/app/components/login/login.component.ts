import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { login } from "../../store/auth/auth.actions";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../store/auth/auth.selectors";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit() {
    if (this.email && this.password) {
      this.store.dispatch(
        login({
          email: this.email.trim(),
          password: this.password,
        })
      );
    }
  }
}
