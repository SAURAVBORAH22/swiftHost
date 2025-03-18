import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted', this.contactForm.value);
    } else {
      console.log('Form invalid');
      this.contactForm.markAllAsTouched();
    }
  }

  isInvalid(control: string): boolean {
    const formControl = this.contactForm.get(control);
    return formControl ? formControl.invalid && formControl.touched : false;
  }
}
