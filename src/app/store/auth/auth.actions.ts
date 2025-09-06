import { createAction, props } from "@ngrx/store";

// Acción para inicializar la aplicación
export const initializeApp = createAction("[App] Initialize");

// Acción para inicializar la autenticación
export const initializeAuth = createAction(
  "[Auth] Initialize",
  props<{ token: string | null; user: any }>()
);

// Acciones para el proceso de login
export const login = createAction(
  "[Auth] Login",
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{ user: any; token: string }>()
);

export const loginFailure = createAction(
  "[Auth] Login Failure",
  props<{ error: string }>()
);

// Acción para logout
export const logout = createAction("[Auth] Logout");
