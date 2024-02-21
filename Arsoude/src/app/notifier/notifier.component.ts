import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {
  icon: string = "";

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
  
  ngOnInit(): void {
    this.setIcon(this.data.messageType);
  }

  setIcon(messageType: string) {
    switch (messageType) {
      case 'error':
        this.icon = 'fa-solid fa-circle-xmark';
        break;
      case 'warning':
        this.icon = 'fa-solid fa-triangle-exclamation';
        break;
      case 'approve':
        this.icon = 'fa-solid fa-thumbs-up';
        break;
      case 'deny': 
        this.icon = 'fa-solid fa-thumbs-down';
        break;
      case 'delete':
        this.icon = 'fa-solid fa-trash';
        break;
      default:
        this.icon = 'fa-solid fa-circle-check';
        break;
    }
  }
}
