import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Payment } from 'src/app/models/paymentMethod.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ToastService } from 'src/app/services/toast.service';

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
export class PaymentComponent implements OnInit {
  Object = Object;

  selectedMethod: string = '';
  savedPayments: Payment[] = [];
  userId: string | null = '';

  creditCardForm: FormGroup;
  upiForm: FormGroup;
  netBankingForm: FormGroup;
  payLaterForm: FormGroup;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private authService: AuthService,
    private accountService: AccountService,
    private toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;

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

  ngOnInit(): void {
    this.loadAllSavedPaymentOptions();
  }

  loadAllSavedPaymentOptions(): void {
    this.isLoading = true;
    this.accountService.fetchAllPaymentOptionsForUser(this.userId || '').subscribe(payment_options => {
      payment_options.forEach(payment_option => {
        payment_option.details = this.encryptionService.decryptObject(payment_option.details);
      });
      this.savedPayments = payment_options;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.toastService.showToast('Error loading payment options.', 'error');
    });
  }

  addPayment(form: FormGroup, method: string): void {
    form.markAllAsTouched();
    form.updateValueAndValidity();

    if (!form.valid) {
      this.toastService.showToast(`Please fill out all required fields for ${method}.`, 'error');
      return;
    }

    this.isLoading = true;
    const payment: Payment = {
      userId: this.userId || '',
      method,
      details: this.encryptionService.encryptObject(form.value)
    };
    this.accountService.savePaymentOption(payment).subscribe(success => {
      this.isLoading = false;
      if (success) {
        this.toastService.showToast('Your details were saved successfully.', 'success');
        form.reset();
        form.updateValueAndValidity();
        this.selectedMethod = '';
        this.loadAllSavedPaymentOptions();
      } else {
        this.toastService.showToast('Something happened while processing your request.', 'error');
      }
    }, error => {
      this.isLoading = false;
      this.toastService.showToast('Error while processing your request.', 'error');
    });
  }

  openRemovePaymentConfirmation(payment: Payment) {
    this.confirmationDialogService.confirm('Confirm Action', 'Are you sure you want to delete this?')
      .then(confirmed => {
        if (confirmed) {
          this.isLoading = true;
          this.accountService.deletePaymentOptionById(payment.id || '').subscribe(success => {
            this.isLoading = false;
            if (success) {
              this.toastService.showToast('The payment option was deleted successfully', 'success');
              this.loadAllSavedPaymentOptions();
            } else {
              this.toastService.showToast('Something went wrong while processing your request. Please try again.', 'error');
            }
          }, error => {
            this.isLoading = false;
            this.toastService.showToast('Error while deleting the payment option.', 'error');
          });
        }
      });
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
