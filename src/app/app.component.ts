import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as LogRocket from 'logrocket';
import { environment } from '../environments/environment';
import { select, Store } from '@ngrx/store';
import { selectUser } from './auth/store/auth.selectors';
import { iconsMap } from './svg-icon';

@Component({
  selector: 'hellotemp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'candidate';

  constructor(
    private store: Store<any>,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    iconsMap.forEach((icon, iconName) => {
      this.matIconRegistry.addSvgIconLiteralInNamespace(
        'hl',
        iconName,
        this.sanitizer.bypassSecurityTrustHtml(icon)
      );
    });

    if (environment.production) {
      LogRocket.init('aipnmo/hello-temp');
    }
    this.store.pipe(
      select(selectUser),
    ).subscribe(user => {
      if (user && user.id) {
        LogRocket.identify(user.id, {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        });
      } else {
        LogRocket.identify('anonymous-user');
      }
    });
  }
}
