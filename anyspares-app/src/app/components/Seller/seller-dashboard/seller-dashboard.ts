import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TwoWheelerDashboardService } from '../../../services/Seller/twowheeler-dashboard.service';
import { Constants } from '../../../Constants/Constants';


interface StatCard {
  title: string;
  value: number;
  color: String;
}

interface InventoryCard {
  vehicleType: string;
  totalProducts: number;
  color: String;
}

interface Activity {
  type: String;
  title: string;
  description: string;
  time: string;
  color: String;
}


@Component({
  selector: 'app-seller-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css'
})
export class SellerDashboard {

  sellerName = '';
  storeName = '';
  avtarName = '';

  /* ---------- Dashboard Stats ---------- */
  stats: StatCard[] | undefined;

  // = [
  //   { title: 'Total Products', value: 536, color: 'green' },
  //   { title: 'Active Orders', value: 28, color: 'blue' },
  //   { title: 'Pending Payments', value: 12, color: 'orange' },
  //   { title: 'Low Stock Items', value: 15, color: 'red' }
  // ];

  /* ---------- Inventory Cards ---------- */
  inventory: InventoryCard[] | undefined;

  // = [
  //   { vehicleType: 'Two Wheelers', totalProducts: 145, color: 'green' },
  //   { vehicleType: 'Three Wheelers', totalProducts: 68, color: 'orange' },
  //   { vehicleType: 'Four Wheelers', totalProducts: 234, color: 'blue' },
  //   { vehicleType: 'Heavy Vehicles', totalProducts: 89, color: 'purple' }
  // ];

  /* ---------- Recent Activity ---------- */
  recentActivities: Activity[] | undefined;


  // = [
  //   {
  //     type: 'order',
  //     title: 'New order received',
  //     description: 'Brake Pad Set - Honda Activa',
  //     time: '5 mins ago',
  //     color: 'green'
  //   },
  //   {
  //     type: 'update',
  //     title: 'Product updated',
  //     description: 'Engine Oil - Yamaha R15',
  //     time: '1 hour ago',
  //     color: 'blue'
  //   },
  //   {
  //     type: 'alert',
  //     title: 'Low stock alert',
  //     description: 'Clutch Cable - Hero Splendor',
  //     time: '2 hours ago',
  //     color: 'red'
  //   },
  //   {
  //     type: 'payment',
  //     title: 'Payment received',
  //     description: 'Order #12345',
  //     time: '3 hours ago',
  //     color: 'green'
  //   }
  // ];

  constructor(private router: Router, private dashboardService: TwoWheelerDashboardService) { }

  ngOnInit(): void {
    this.sellerName = sessionStorage.getItem('sellerName') || '';
    this.storeName = sessionStorage.getItem('businesstName') || '';
    this.avtarName = this.getAvatarName(this.sellerName);

    this.loadStatData();
    this.loadInventoryData();
    this.loadRecentActivities();
  }

  getAvatarName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return parts.length === 1 ? parts[0][0].toUpperCase() : '';
  }

  loadStatData() {
    this.dashboardService.loadStatsData().subscribe({
      next: (res: any) => {
        if (res != undefined) {
          this.stats = res;
        }
      }
    });
  }

  loadInventoryData() {
    this.dashboardService.loadInventoryData().subscribe({
      next: (res: any) => {
        if (res != undefined) {
          this.inventory = res;
        }
      }
    });
  }

  loadRecentActivities() {
    this.dashboardService.loadRecentActivities().subscribe({
      next: (res: any) => {
        if (res != undefined) {
          this.recentActivities = res;
        }
      }
    });
  }


  /* ---------- Actions ---------- */
  addProduct(vehicleType: string): void {
    console.log(`Add product clicked for: `+vehicleType);
if (vehicleType === Constants.TWO_WHEELER) {
    this.router.navigate(['/seller-category'], { queryParams: { vehicleType: vehicleType } });
}
  }

  openNotifications(): void {
    console.log('Notifications clicked');
  }

  toggleTheme(): void {
    console.log('Theme toggled');
  }
} 
