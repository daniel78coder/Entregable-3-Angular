import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { logout } from '../../store/auth/auth.actions';
import { selectUser, selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  user$: Observable<any>;
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
