import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertModalComponent } from 'libs/ui/src/lib/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialog: MatDialog,
  ) { }

  public message(title: string, message: string) {
    return this.dialog.open(AlertModalComponent, {
      width: '375px',
      data: {
        title,
        message,
      },
    })
  }

  public loading(title?: string) {
    return this.dialog.open(AlertModalComponent, {
      width: '375px',
      data: {
        title: title || 'Loading...',
        loading: true,
      },
    })
  }
}
