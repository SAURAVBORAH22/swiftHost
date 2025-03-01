import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toast: any = null;
  timeoutRef: any;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toast = toast;

      if (toast) {
        clearTimeout(this.timeoutRef);
        this.timeoutRef = setTimeout(() => {
          this.closeToast();
        }, 3000);
      }
    });
  }

  closeToast() {
    this.toast = null;
    clearTimeout(this.timeoutRef); // Prevent auto-close if manually closed
  }
}
