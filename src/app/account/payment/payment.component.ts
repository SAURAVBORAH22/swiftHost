import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Payment } from 'src/app/models/paymentMethod.model';

export function matchValidator(field: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fieldValue = group.get(field)?.value;
    const confirmFieldValue = group.get(confirmField)?.value;
    return fieldValue === confirmFieldValue ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  // Expose Object for template usage (if needed)
  Object = Object;

  selectedMethod: string = '';
  savedPayments: Payment[] = [];

  creditCardForm: FormGroup;
  upiForm: FormGroup;
  netBankingForm: FormGroup;
  payLaterForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    // Initialize Credit Card form with a confirm field and group validator
    this.creditCardForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardType: ['', Validators.required],
      cardNumber: ['', Validators.required],
      confirmCardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required]
    }, { validators: matchValidator('cardNumber', 'confirmCardNumber') });

    // UPI Form
    this.upiForm = this.fb.group({
      upiNumber: ['', Validators.required]
    });

    // Initialize Net Banking form with a confirm field and group validator
    this.netBankingForm = this.fb.group({
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      confirmAccountNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      ifscCode: ['', Validators.required]
    }, { validators: matchValidator('accountNumber', 'confirmAccountNumber') });

    // Pay Later Form
    this.payLaterForm = this.fb.group({
      paylaterVendor: ['', Validators.required],
      paylaterId: ['', Validators.required]
    });
  }

  addPayment(form: FormGroup, method: string): void {
    form.markAllAsTouched();
    form.updateValueAndValidity();

    if (!form.valid) {
      alert(`Please fill out all required fields for ${method}.`);
      return;
    }

    const payment: Payment = {
      id: new Date().getTime().toString(),
      method,
      details: form.value
    };

    this.savedPayments.push(payment);
    form.reset();
    form.updateValueAndValidity();
    alert(`${method} added successfully!`);
    this.selectedMethod = '';
  }

  removePayment(payment: Payment): void {
    this.savedPayments = this.savedPayments.filter(p => p !== payment);
  }

  onMethodChange(): void {
    // Reset all forms when switching payment methods
    this.creditCardForm.reset();
    this.upiForm.reset();
    this.netBankingForm.reset();
    this.payLaterForm.reset();

    this.creditCardForm.updateValueAndValidity();
    this.upiForm.updateValueAndValidity();
    this.netBankingForm.updateValueAndValidity();
    this.payLaterForm.updateValueAndValidity();
  }
}
