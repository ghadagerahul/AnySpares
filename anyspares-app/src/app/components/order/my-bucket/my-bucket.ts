import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../Buyer/navbar-component/navbar-component';
import { OrderService, BucketItem } from '../../../services/order.service';
import { Constants } from '../../../Constants/Constants';

@Component({
    selector: 'app-my-bucket',
    imports: [CommonModule, NavbarComponent],
    templateUrl: './my-bucket.html',
    styleUrl: './my-bucket.css'
})
export class MyBucketComponent implements OnInit {
    bucketItems: BucketItem[] = [];
    totalPrice = 0;
    totalItems = 0;
    isLoading = false;
    isLoadingBucket = false;
    orderMessage = '';
    showOrderMessage = false;
    messageType: 'success' | 'error' = 'success';
    userId: string | null = null;

    constructor(
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userId = this.getCurrentUserId();
        this.loadBucket();
    }

    private getCurrentUserId(): string | null {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            return null;
        }
        try {
            return JSON.parse(currentUser)?.id || null;
        } catch {
            return null;
        }
    }

    private loadBucket(): void {
        if (!this.userId) {
            this.showMessage('Please login to view your bucket.', 'error');
            return;
        }

        this.isLoadingBucket = true;
        this.orderService.getBucketFromAPI(this.userId).subscribe({
            next: (response) => {
                this.isLoadingBucket = false;
                if (response?.success && Array.isArray(response.data)) {
                    this.bucketItems = response.data;
                    this.updateTotals();
                } else {
                    this.showMessage(response?.message || 'Could not load bucket items.', 'error');
                }
            },
            error: (error) => {
                this.isLoadingBucket = false;
                console.error('Error loading bucket:', error);
                this.showMessage('Failed to load bucket items.', 'error');
            }
        });
    }

    private updateTotals(): void {
        this.totalPrice = this.bucketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.totalItems = this.bucketItems.reduce((count, item) => count + item.quantity, 0);
    }

    increaseQuantity(item: BucketItem): void {
        this.updateQuantity(item, item.quantity + 1);
    }

    decreaseQuantity(item: BucketItem): void {
        if (item.quantity <= 1) {
            return;
        }
        this.updateQuantity(item, item.quantity - 1);
    }

    private updateQuantity(item: BucketItem, quantity: number): void {
       
        if (!this.userId) {
            this.showMessage('Please login to update bucket items.', 'error');
            return;
        }

        this.isLoading = true;
        this.orderService.updateBucketItemAPI(this.userId, item.productId, quantity).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response?.success && Array.isArray(response.data)) {
                    this.bucketItems = response.data;
                    this.updateTotals();
                    this.showMessage('Item quantity updated.', 'success');
                } else {
                    this.showMessage(response?.message || 'Could not update quantity.', 'error');
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error updating quantity:', error);
                this.showMessage('Failed to update quantity.', 'error');
            }
        });
    }

    removeItem(item: BucketItem): void {
        if (!confirm(`Remove ${item.productName} from bucket?`)) {
            return;
        }
        if (!this.userId) {
            this.showMessage('Please login to remove bucket items.', 'error');
            return;
        }

        this.isLoading = true;
        this.orderService.removeBucketItemAPI(this.userId, item.productId, Constants.REMOVETYPE_SINGLE).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response?.success && Array.isArray(response.data)) {
                    this.bucketItems = response.data;
                    this.updateTotals();
                    this.showMessage('Item removed from bucket.', 'success');
                } else {
                    this.showMessage(response?.message || 'Could not remove item.', 'error');
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error removing item:', error);
                this.showMessage('Failed to remove item.', 'error');
            }
        });
    }

    clearBucket(): void {
        if (!confirm('Are you sure you want to clear the entire bucket?')) {
            return;
        }
        if (!this.userId) {
            this.showMessage('Please login to clear your bucket.', 'error');
            return;
        }

        this.isLoading = true;
        const dummyProductId =this.bucketItems[0].productId = "1"; // Using a dummy productId since the API expects it, but it will be ignored for clear operation 
        this.orderService.clearBucketAPI(this.userId, dummyProductId).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response?.success) {
                    this.bucketItems = [];
                    this.updateTotals();
                    this.showMessage('Bucket cleared.', 'success');
                } else {
                    this.showMessage(response?.message || 'Could not clear bucket.', 'error');
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error clearing bucket:', error);
                this.showMessage('Failed to clear bucket.', 'error');
            }
        });
    }

    placeOrder(): void {
        if (this.bucketItems.length === 0) {
            this.showMessage('Bucket is empty. Add items before placing an order.', 'error');
            return;
        }
        this.router.navigate(['/checkout']);
    }

    continueShopping(): void {
        this.router.navigate(['/vehicle-product']);
    }

    private showMessage(message: string, type: 'success' | 'error'): void {
        this.orderMessage = message;
        this.messageType = type;
        this.showOrderMessage = true;
        setTimeout(() => {
            this.showOrderMessage = false;
        }, 3000);
    }
}
