import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from '../../Buyer/navbar-component/navbar-component';
import { OrderService, BucketItem } from '../../../services/order.service';

@Component({
    selector: 'app-my-bucket',
    imports: [CommonModule, NavbarComponent],
    templateUrl: './my-bucket.html',
    styleUrl: './my-bucket.css'
})
export class MyBucketComponent implements OnInit, OnDestroy {
    bucketItems: BucketItem[] = [];
    totalPrice: number = 0;
    totalItems: number = 0;
    isPlacingOrder: boolean = false;
    orderMessage: string = '';
    showOrderMessage: boolean = false;
    messageType: 'success' | 'error' = 'success';

    private destroy$ = new Subject<void>();

    constructor(
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadBucketItems();

        this.loadDummyBucketItemsData();

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    loadDummyBucketItemsData(): void {
        const dummyItems: BucketItem[] = [
            {
                id: '1',
                productId: 'SP-8-2024',
                productName: 'Carburetor Repair Kit',
                price: 449,
                quantity: 2,
                imageUrl: 'assets/two-wheelers/product-services/carburetor-kit.jpg',
                description: 'High-quality carburetor repair kit compatible with Hero, Honda, and Bajaj bikes.'
            },
            {
                id: '2',
                productId: 'BP-5-2024',
                productName: 'Brake Pads Set',
                price: 299,
                quantity: 1,
                imageUrl: 'assets/two-wheelers/product-services/brake-pads.jpg',
                description: 'Durable brake pads set for enhanced safety and performance.'
            }
        ];

        // Simulate loading dummy data into the bucket
        // this.orderService.bucketSubject.next(dummyItems);

        this.bucketItems = dummyItems;
        dummyItems.forEach(item => {
            this.bucketItems.push(item);
        });

    }

    /**
     * Load bucket items from the service
     */
    private loadBucketItems(): void {
        this.orderService.bucket$
            .pipe(takeUntil(this.destroy$))
            .subscribe(items => {
                this.bucketItems = items;
                this.calculateTotals();
            });
    }

    /**
     * Calculate total price and items count
     */
    private calculateTotals(): void {
        this.totalPrice = this.orderService.getTotalPrice();
        this.totalItems = this.orderService.getBucketCount();
    }

    /**
     * Increase quantity of an item
     */
    increaseQuantity(item: BucketItem): void {
        this.orderService.updateItemQuantity(item.productId, item.quantity + 1);
    }

    /**
     * Decrease quantity of an item
     */
    decreaseQuantity(item: BucketItem): void {
        if (item.quantity > 1) {
            this.orderService.updateItemQuantity(item.productId, item.quantity - 1);
        }
    }

    /**
     * Remove item from bucket
     */
    removeItem(item: BucketItem): void {
        if (confirm(`Remove ${item.productName} from bucket?`)) {
            this.orderService.removeItemFromBucket(item.productId);
        }
    }

    /**
     * Place order
     */
    placeOrder(): void {
        if (this.bucketItems.length === 0) {
            this.showMessage('Bucket is empty. Add items before placing an order.', 'error');
            return;
        }

        this.isPlacingOrder = true;
        const buyerId = localStorage.getItem('userId') || 'guest-user';

        this.orderService.placeOrder(buyerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.showMessage('Order placed successfully!', 'success');
                        this.orderService.clearBucket();
                        setTimeout(() => {
                            this.router.navigate(['/orders']);
                        }, 2000);
                    } else {
                        this.showMessage(response.message || 'Failed to place order', 'error');
                    }
                    this.isPlacingOrder = false;
                },
                error: (error) => {
                    console.error('Error placing order:', error);
                    this.showMessage('Failed to place order. Please try again.', 'error');
                    this.isPlacingOrder = false;
                }
            });
    }

    /**
     * Continue shopping
     */
    continueShopping(): void {
        this.router.navigate(['/vehicle-product']);
    }

    /**
     * Clear entire bucket
     */
    clearBucket(): void {
        if (confirm('Are you sure you want to clear the entire bucket?')) {
            this.orderService.clearBucket();
            this.bucketItems = [];
            this.calculateTotals();
            this.showMessage('Bucket cleared', 'success');
        }
    }

    /**
     * Show message notification
     */
    private showMessage(message: string, type: 'success' | 'error'): void {
        this.orderMessage = message;
        this.messageType = type;
        this.showOrderMessage = true;
        setTimeout(() => {
            this.showOrderMessage = false;
        }, 3000);
    }
}
