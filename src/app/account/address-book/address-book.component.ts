import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  userId: string | null = '';
  addresses: any[] = [];
  addressForms: FormGroup[] = [];
  isLoading: boolean = false;
  savingIndex: number | null = null;
  deletingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    private toastService: ToastService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromSession()?.userId || null;
    this.loadInitialAddresses();
  }

  loadInitialAddresses(): void {
    this.isLoading = true;
    this.accountService.getAllAddresses(this.userId || '').subscribe(
      addresses => {
        this.addresses = addresses;
        this.addressForms = this.addresses.map(address => this.createAddressForm(address));
        this.isLoading = false;
      },
      error => {
        this.toastService.showToast('Failed to load addresses', 'error');
        this.isLoading = false;
      }
    );
  }

  createAddressForm(address: any): FormGroup {
    return this.fb.group({
      id: [address.id || null],
      nickname: [address.nickname, Validators.required],
      fullName: [address.fullName, Validators.required],
      phoneNumber: [
        address.phoneNumber,
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      addressLine1: [address.addressLine1, Validators.required],
      addressLine2: [address.addressLine2],
      city: [address.city, Validators.required],
      state: [address.state, Validators.required],
      postalCode: [address.postalCode, Validators.required],
      country: [address.country, Validators.required],
      isDefault: [address.isDefault]
    });
  }

  addNewAddress(): void {
    const newAddress = {
      nickname: '',
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false,
      isEditing: true
    };
    this.addresses.push(newAddress);
    this.addressForms.push(this.createAddressForm(newAddress));
  }

  editAddress(index: number): void {
    this.addresses[index].isEditing = true;
  }

  saveAddress(index: number): void {
    if (this.addressForms[index].valid) {
      const formData = {
        userId: this.userId,
        ...this.addressForms[index].value
      };

      if (
        formData.isDefault &&
        this.addresses.some(
          address => address.isDefault && formData.id !== address.id
        )
      ) {
        this.toastService.showToast('You already have one default address.', 'error');
        return;
      }
      this.savingIndex = index;
      this.accountService.saveAddressInfo(formData).subscribe(
        success => {
          this.savingIndex = null;
          if (success) {
            this.toastService.showToast('Your details were saved successfully.', 'success');
            this.addresses[index] = {
              ...this.addresses[index],
              ...this.addressForms[index].value,
              isEditing: false
            };
          } else {
            this.toastService.showToast('Something happened while processing your request.', 'error');
          }
        },
        error => {
          this.savingIndex = null;
          this.toastService.showToast('Error saving address', 'error');
        }
      );
    }
  }

  cancelEdit(index: number): void {
    this.addresses[index].isEditing = false;
  }

  deleteAddress(id: string): void {
    this.confirmationDialogService
      .confirm('Confirm Action', 'Are you sure you want to delete this?')
      .then(confirmed => {
        if (confirmed) {
          this.deletingId = id;
          this.accountService.deleteAddress(id).subscribe(
            success => {
              this.deletingId = null;
              if (success) {
                this.toastService.showToast('The address was deleted successfully', 'success');
                const index = this.addresses.findIndex(address => address.id === id);
                if (index > -1) {
                  this.addresses.splice(index, 1);
                  this.addressForms.splice(index, 1);
                }
              } else {
                this.toastService.showToast('Something happened while processing your request.', 'error');
              }
            },
            error => {
              this.deletingId = null;
              this.toastService.showToast('Error deleting address', 'error');
            }
          );
        }
      });
  }

  isFieldInvalid(index: number, field: string): boolean {
    const control = this.addressForms[index]?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
