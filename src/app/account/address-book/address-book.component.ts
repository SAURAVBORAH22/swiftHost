import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {

  addresses: any[] = [];
  addressForms: FormGroup[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadInitialAddresses();
  }

  loadInitialAddresses(): void {
    this.addresses = [
      {
        nickname: 'Home', fullName: 'John Doe', phoneNumber: '1234567890',
        addressLine1: '123 Main St', addressLine2: '', city: 'Bangalore',
        state: 'Karnataka', postalCode: '560001', country: 'India',
        isDefault: true, isEditing: false
      }
    ];

    this.addressForms = this.addresses.map(address => this.createAddressForm(address));
  }

  createAddressForm(address: any): FormGroup {
    return this.fb.group({
      nickname: [address.nickname, Validators.required],
      fullName: [address.fullName, Validators.required],
      phoneNumber: [address.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
      nickname: '', fullName: '', phoneNumber: '',
      addressLine1: '', addressLine2: '', city: '', state: '',
      postalCode: '', country: '', isDefault: false, isEditing: true
    };

    this.addresses.push(newAddress);
    this.addressForms.push(this.createAddressForm(newAddress));
  }

  editAddress(index: number): void {
    this.addresses[index].isEditing = true;
  }

  saveAddress(index: number): void {
    if (this.addressForms[index].valid) {
      this.addresses[index] = {
        ...this.addresses[index],
        ...this.addressForms[index].value,
        isEditing: false
      };
    }
  }

  cancelEdit(index: number): void {
    this.addresses[index].isEditing = false;
  }

  deleteAddress(index: number): void {
    this.addresses.splice(index, 1);
    this.addressForms.splice(index, 1);
  }

  isFieldInvalid(index: number, field: string): boolean {
    const control = this.addressForms[index]?.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
