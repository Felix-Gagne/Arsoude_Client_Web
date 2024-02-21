import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from './notifier/notifier.component';
import { icon } from '@fortawesome/fontawesome-svg-core';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(displayMessage: string, messageType: 'error' | 'success' | 'warning' = 'success') {
    this.snackBar.openFromComponent(NotifierComponent, {
      data:{
        message: displayMessage,
        messageType: messageType
      },
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: messageType
    });
  }
}
