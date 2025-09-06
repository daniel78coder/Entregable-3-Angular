import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectToken } from "../store/auth/auth.selectors";
import { switchMap, take } from "rxjs/operators";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectToken).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(clonedReq);
      }
      return next(req);
    })
  );
};
