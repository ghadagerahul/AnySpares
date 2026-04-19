import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService, ContactDetails } from '../../../services/checkout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailsComponent implements OnInit, OnDestroy {


  contactForm: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isFormDisabled: boolean = true;
  fetchedData: ContactDetails | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadContactDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private patchContactForm(contact: Partial<ContactDetails>): void {
    this.contactForm.patchValue({
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || ''
    });
  }

  loadContactDetails(): void {
    this.isLoading = true;
    this.isFormDisabled = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fetchedData = null;

    this.cdr.markForCheck();

    this.checkoutService.getUserContactDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const payload = response && response.success ? response.data : response;


          if (payload && (payload[0].name || payload[0].phone || payload[0].email)) {
            this.fetchedData = payload[0];
            this.patchContactForm(payload[0]);
            this.contactForm.markAsPristine();
            this.isFormDisabled = false;
            this.isLoading = false;
            this.successMessage = 'Loaded your existing contact details.';
            this.cdr.markForCheck();
            return;
          }

          this.isFormDisabled = false;
          this.isLoading = false;
          this.errorMessage = 'No existing contact details found. Please enter your details.';
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('[ContactDetails] Error loading contact details:', error);
          this.isLoading = false;
          this.isFormDisabled = false;
          this.errorMessage = 'Unable to load contact details. Please enter your details manually.';
          this.cdr.markForCheck();
        }
      });
  }

  onContactFormSubmit(): void {
    if (!this.contactForm.valid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.cdr.markForCheck();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    const contactData = this.contactForm.value as ContactDetails;

    this.checkoutService.saveContactDetails(contactData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          const payload = response && response.success ? response.data : response;

          const savedContact: ContactDetails = {
            userId: payload?.userId || this.fetchedData?.userId,
            name: payload?.name || contactData.name,
            phone: payload?.phone || contactData.phone,
            email: payload?.email || contactData.email,
            createdAt: payload?.createdAt || this.fetchedData?.createdAt,
            updatedAt: payload?.updatedAt || new Date().toISOString()
          };

          this.checkoutService.setContact(savedContact);
          this.fetchedData = savedContact;
          this.contactForm.markAsPristine();
          this.successMessage = 'Contact details saved successfully!';
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isSaving = false;
          console.error('[ContactDetails] Error saving contact details:', error);
          this.errorMessage = 'Unable to save contact details. Please check your connection and try again.';
          this.checkoutService.setContact(contactData);
          this.cdr.markForCheck();
        }
      });
  }

  isFormValid(): boolean {
    return this.contactForm.valid && !this.isSaving && this.contactForm.dirty;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  onCheckboxChange($event: Event) {
    const isChecked = ($event.target as HTMLInputElement).checked;
    if (isChecked && this.fetchedData) {
      this.checkoutService.setContact(this.fetchedData);
      this.cdr.markForCheck();
    } else {
      this.checkoutService.setContact(null);
      this.cdr.markForCheck();
    }
  }
}