import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';


interface StatCard {
  title: string;
  value: number;
  color: 'green' | 'blue' | 'orange' | 'red';
}

interface InventoryCard {
  vehicleType: string;
  totalProducts: number;
  color: 'green' | 'blue' | 'orange' | 'purple';
}

interface Activity {
  type: 'order' | 'update' | 'alert' | 'payment';
  title: string;
  description: string;
  time: string;
  color: 'green' | 'blue' | 'red';
}


@Component({
  selector: 'app-seller-dashboard',
  imports: [CommonModule],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css'
})
export class SellerDashboard {

  sellerName = 'John Doe';
  storeName = 'Auto Parts Store';

  /* ---------- Dashboard Stats ---------- */
  stats: StatCard[] = [
    { title: 'Total Products', value: 536, color: 'green' },
    { title: 'Active Orders', value: 28, color: 'blue' },
    { title: 'Pending Payments', value: 12, color: 'orange' },
    { title: 'Low Stock Items', value: 15, color: 'red' }
  ];

  /* ---------- Inventory Cards ---------- */
  inventory: InventoryCard[] = [
    { vehicleType: 'Two Wheelers', totalProducts: 145, color: 'green' },
    { vehicleType: 'Three Wheelers', totalProducts: 68, color: 'orange' },
    { vehicleType: 'Four Wheelers', totalProducts: 234, color: 'blue' },
    { vehicleType: 'Heavy Vehicles', totalProducts: 89, color: 'purple' }
  ];

  /* ---------- Recent Activity ---------- */
  recentActivities: Activity[] = [
    {
      type: 'order',
      title: 'New order received',
      description: 'Brake Pad Set - Honda Activa',
      time: '5 mins ago',
      color: 'green'
    },
    {
      type: 'update',
      title: 'Product updated',
      description: 'Engine Oil - Yamaha R15',
      time: '1 hour ago',
      color: 'blue'
    },
    {
      type: 'alert',
      title: 'Low stock alert',
      description: 'Clutch Cable - Hero Splendor',
      time: '2 hours ago',
      color: 'red'
    },
    {
      type: 'payment',
      title: 'Payment received',
      description: 'Order #12345',
      time: '3 hours ago',
      color: 'green'
    }
  ];

  constructor(private router: Router) { }

  loadStatData() {
  }

  loadInventoryData() {
  }

  loadRecentActivities() {

  }

  ngOnInit(): void {
    this.loadStatData();
    this.loadInventoryData();
    this.loadRecentActivities();
    // Later you can load data here from API
    // this.loadDashboardData();
  }

  /* ---------- Actions ---------- */

  addProduct(vehicleType: string): void {
    console.log(`Add product clicked for ${vehicleType}`);



    // Navigate to add product page
    this.router.navigate(['/seller-twowheller-category'], { queryParams: { type: vehicleType } });
  }

  openNotifications(): void {
    console.log('Notifications clicked');
  }

  toggleTheme(): void {
    console.log('Theme toggled');
  }


}
