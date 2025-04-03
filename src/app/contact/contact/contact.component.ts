import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  userId: string | null = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromSession()?.userId || null;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactData = {
        userId: this.userId,
        name: this.contactForm.value.name,
        phone: this.contactForm.value.phone,
        message: this.contactForm.value.message
      }
      this.contactService.addNewQuery(contactData).subscribe(success => {
        if (success) {
          this.toastService.showToast('Your message was received by us. We are currently reviewing it and will contact you shortly.', 'info');
          this.contactForm.reset();
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  isInvalid(control: string): boolean {
    const formControl = this.contactForm.get(control);
    return formControl ? formControl.invalid && formControl.touched : false;
  }
}
