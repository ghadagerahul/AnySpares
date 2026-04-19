import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutService, CheckoutData } from '../../../services/checkout.service';
import { OrderService } from '../../../services/order.service';
import { NavbarComponent } from '../../Buyer/navbar-component/navbar-component';
import { AddressSelectionComponent } from '../address-selection/address-selection';
import { ContactDetailsComponent } from '../contact-details/contact-details';
import { OrderSummaryComponent } from '../order-summary/order-summary';

@Component({
    selector: 'app-checkout',
    imports: [
        CommonModule,
        NavbarComponent,
        AddressSelectionComponent,
        ContactDetailsComponent,
        OrderSummaryComponent
    ],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})

export class CheckoutComponent implements OnInit {
    checkoutData: CheckoutData;
    currentStep: number = 1;
    totalSteps: number = 3;
    isPlacingOrder: boolean = false;

    steps = [
        { id: 1, name: 'Address', icon: '📍' },
        { id: 2, name: 'Contact', icon: '📞' },
        { id: 3, name: 'Review', icon: '👀' }
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
            default:
                return false;
        }
    }

    canProceedToNext(): boolean {
        return this.isStepValid(this.currentStep);
    }

    proceedToPayment(): void {
        if (this.isCheckoutReady()) {
            console.log("CALLING proceedToPayment() ....!!!!")
            this.placeOrder();
        }
    }

    private isCheckoutReady(): boolean {
        return !!(this.checkoutData.items.length > 0 &&
            this.checkoutData.address &&
            this.checkoutData.contact);
    }

    private placeOrder(): void {
        console.log("CALLING placeOrder() ....!!!!")
        if (!this.isCheckoutReady()) {
            alert('Please complete all required information before placing the order.');
            return;
        }

        this.isPlacingOrder = true;
        const userId = this.getCurrentUserId();

        const orderData = {
            userId,
            items: this.checkoutData.items,
            address: this.checkoutData.address!,
            contact: this.checkoutData.contact!,
            paymentMethod: 'cod', // Default to COD for now
            totalAmount: this.checkoutData.totalAmount
        };

        this.checkoutService.placeOrder(orderData).subscribe({
            next: (response) => {
                if (response.success) {
                    // Clear the bucket and checkout data
                    this.orderService.clearBucket();
                    this.checkoutService.clearCheckoutData();

                    // Navigate to order success page with order details
                    this.router.navigate(['/order-success'], {
                        queryParams: { orderId: response.data.orderId }
                    });
                } else {
                    alert('Failed to place order: ' + (response.message || 'Unknown error'));
                }
                this.isPlacingOrder = false;
            },
            error: (error) => {
                console.error('Order placement error:', error);
                alert('Failed to place order. Please try again.');
                this.isPlacingOrder = false;
            }
        });
    }

    private getCurrentUserId(): string {
        return localStorage.getItem('userId') || 'guest';
    }
}