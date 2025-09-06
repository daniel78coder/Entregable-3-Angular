import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";

import * as AuthActions from "./auth.actions";
import { ApiService } from "../../services/api.service";
import { StorageService } from "../../services/storage.service";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  // Efecto para el login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.apiService.login(action).pipe(
          map((response: any) => {
            if (response.token) {
              this.storageService.setItem("token", response.token);
            }
            return AuthActions.loginSuccess({
              user: response.user || response,
              token: response.token,
            });
          }),
          catchError((error) => {
            const errorMessage =
              error.error?.message || error.message || "Error de autenticación";
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(["/home"]);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.storageService.removeItem("token");
          this.router.navigate(["/login"]);
        })
      ),
    { dispatch: false }
  );

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeApp),
      map(() => {
        const token = this.storageService.getItem("token");
        if (token) {
          return AuthActions.initializeAuth({
            token,
            user: { name: "Usuario", email: "usuario@ejemplo.com" },
          });
        } else {
          return AuthActions.initializeAuth({ token: null, user: null });
        }
      })
    )
  );
}
