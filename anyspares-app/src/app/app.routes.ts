import { Routes } from '@angular/router';
import { SellerLoginComponent } from './components/Seller/seller-login/seller-login';
import { SellerRegisterComponent } from './components/Seller/seller-register/seller-register';
import { SellerDashboard } from './components/Seller/seller-dashboard/seller-dashboard';
import { SellerTwoWheelerCategories } from './components/Seller/two-wheeler-categories/two-wheeler-categories';

import { AddProduct } from './components/Seller/add-product/add-product';
import { EditProduct } from './components/Seller/edit-product/edit-product';

import { SellerCategoryParts } from './components/Seller/seller-category-parts/seller-category-parts';
import { LoginPage } from './components/Buyer/login-page/login-page';
import { RegisterationPage } from './components/Buyer/registeration-page/registeration-page';
import { Dashboard } from './components/Buyer/dashboard/dashboard'; import { ForgotPasswordComponent } from './components/Buyer/forgot-password.component/forgot-password.component';
import { AddVehicleBrands } from './components/Seller/add-vehicle-brands/add-vehicle-brands';
import { AddVehicleModels } from './components/Seller/add-vehicle-models/add-vehicle-models';
import { RazorpayPaymentComponent } from './components/Payment/razorpay-payment-component/razorpay-payment-component';
import { VehicleBrands } from './components/Buyer/vehicle-brands/vehicle-brands';
import { VehicleModels } from './components/Buyer/vehicle-models/vehicle-models';
import { Vehiclecategory } from './components/Buyer/vehiclecategory/vehiclecategory';
import { VehicleProducts } from './components/Buyer/vehicle-products/vehicle-products';
import { VehicleProductDetails } from './components/Buyer/vehicle-product-details/vehicle-product-details';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterationPage },
  
  { path: 'forgot-password', component: ForgotPasswordComponent },


  // Buyer Routes
  { path: 'dashboard', component: Dashboard },
  { path: 'vehicles', component: VehicleBrands },
  { path: 'vehicle-brands', component: VehicleBrands },
  { path: 'vehicle-models', component: VehicleModels },
  { path: 'vehicle-category', component: Vehiclecategory },
  { path: 'vehicle-product', component: VehicleProducts },
  { path: 'vehicle-productDetails', component: VehicleProductDetails },


  //Seller Routes
  { path: 'seller-login', component: SellerLoginComponent },
  { path: 'seller-register', component: SellerRegisterComponent },
  { path: 'seller-dashboard', component: SellerDashboard },
  { path: 'seller-twowheller-category', component: SellerTwoWheelerCategories },
  //  seller category routes
  { path: 'seller-category-parts', component: SellerCategoryParts },

  //  seller product management routes
  { path: 'seller-addproduct', component: AddProduct },
  { path: 'seller-editproduct', component: EditProduct },

  { path: 'seller-vehicle-brands', component: AddVehicleBrands },
  { path: 'seller-add-model', component: AddVehicleModels },

  // payment route
  { path: 'payment', component: RazorpayPaymentComponent },
  { path: '**', redirectTo: 'login' }
];