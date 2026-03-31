import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService, CheckoutData } from '../../../services/checkout.service';
import { OrderService } from '../../../services/order.service';
import { NavbarComponent } from '../../Buyer/navbar-component/navbar-component';
import { AddressSelectionComponent } from '../address-selection/address-selection';
import { ContactDetailsComponent } from '../contact-details/contact-details';
import { OrderSummaryComponent } from '../order-summary/order-summary';
import { PaymentMethodComponent } from '../payment-method/payment-method';

@Component({
    selector: 'app-checkout',
    imports: [
        CommonModule,
        NavbarComponent,
        AddressSelectionComponent,
        ContactDetailsComponent,
        OrderSummaryComponent,
        PaymentMethodComponent
    ],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})

export class CheckoutComponent implements OnInit {
    checkoutData: CheckoutData;
    currentStep: number = 1;
    totalSteps: number = 4;

    steps = [
        { id: 1, name: 'Address', icon: '📍' },
        { id: 2, name: 'Contact', icon: '📞' },
        { id: 3, name: 'Review', icon: '👀' },
        { id: 4, name: 'Payment', icon: '💳' }
    ];

    constructor(
        private checkoutService: CheckoutService,
        private orderService: OrderService,
        private router: Router
    ) {
        this.checkoutData = this.checkoutService.getCheckoutData();
    }

    ngOnInit(): void {
        // Load items from bucket if not already set
        if (this.checkoutData.items.length === 0) {
            const bucketItems = this.orderService.getBucketItems();
            if (bucketItems.length === 0) {
                this.router.navigate(['/my-bucket']);
                return;
            }
            this.checkoutService.setItems(bucketItems);
        }
        this.checkoutService.checkoutData$.subscribe(data => {
            this.checkoutData = data;
        });
    }

    nextStep(): void {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
        }
    }

    previousStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    goToStep(step: number): void {
        this.currentStep = step;
    }

    isStepValid(step: number): boolean {
        switch (step) {
            case 1:
                return !!this.checkoutData.address;
            case 2:
                return !!this.checkoutData.contact;
            case 3:
                return this.checkoutData.items.length > 0;
            case 4:
                return !!this.checkoutData.paymentMethod;
            default:
                return false;
        }
    }

    canProceedToNext(): boolean {
        return this.isStepValid(this.currentStep);
    }

    proceedToPayment(): void {
        if (this.checkoutService.isCheckoutComplete()) {
            this.router.navigate(['/payment']);
        }
    }
}