import { Routes } from '@angular/router';
import { SellerLoginComponent } from './components/Seller/seller-login/seller-login';
import { SellerRegisterComponent } from './components/Seller/seller-register/seller-register';
import { SellerDashboard } from './components/Seller/seller-dashboard/seller-dashboard';
import { SellerTwoWheelerCategories } from './components/Seller/two-wheeler-categories/two-wheeler-categories';
import { SellerEngineParts } from './components/Seller/seller-engine-parts/seller-engine-parts';
import { AddProduct } from './components/Seller/add-product/add-product';
import { EditProduct } from './components/Seller/edit-product/edit-product';
import { SellerBrakes } from './components/Seller/seller-brakes/seller-brakes';
import { SellerElectricalParts } from './components/Seller/seller-electrical-parts/seller-electrical-parts';
import { SellerSuspensionParts } from './components/Seller/seller-suspension-parts/seller-suspension-parts';
import { SellerBodyParts } from './components/Seller/seller-body-parts/seller-body-parts';
import { SellerHydraulicFluids } from './components/Seller/seller-hydraulic-fluids/seller-hydraulic-fluids';
import { SellerCategoryParts } from './components/Seller/seller-category-parts/seller-category-parts';
import { LoginPage } from './components/Buyer/login-page/login-page';
import { RegisterationPage } from './components/Buyer/registeration-page/registeration-page';
import { Dashboard } from './components/Buyer/dashboard/dashboard';
import { TwowheelersDashboard } from './components/Buyer/two-wheelers/twowheelers-dashboard/twowheelers-dashboard';
import { ForgotPasswordComponent } from './components/Buyer/forgot-password.component/forgot-password.component';
import { TwoWheelersModels } from './components/Buyer/two-wheelers/two-wheelers-models/two-wheelers-models';
import { TwoWheelersCategory } from './components/Buyer/two-wheelers/two-wheelers-category/two-wheelers-category';
import { TwoWheelersProduct } from './components/Buyer/two-wheelers/two-wheelers-product/two-wheelers-product';
import { TwoWheelerProductDetails } from './components/Buyer/two-wheelers/two-wheeler-product-details/two-wheeler-product-details';
import { AddVehicleBrands } from './components/Seller/add-vehicle-brands/add-vehicle-brands';
import { AddVehicleModels } from './components/Seller/add-vehicle-models/add-vehicle-models';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterationPage },
  { path: 'dashboard', component: Dashboard },
  { path: 'twowheelersdashboard', component: TwowheelersDashboard },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'twowheelers-models', component: TwoWheelersModels },
  { path: 'twowheelers-category', component: TwoWheelersCategory },
  { path: 'twowheelers-product', component: TwoWheelersProduct },
  { path: 'twowheelers-productDetails', component: TwoWheelerProductDetails },

  //Seller Routes
  { path: 'seller-login', component: SellerLoginComponent },
  { path: 'seller-register', component: SellerRegisterComponent },
  { path: 'seller-dashboard', component: SellerDashboard },
  { path: 'seller-twowheller-category', component: SellerTwoWheelerCategories },
  //  seller category routes
  { path: 'seller-category-parts', component: SellerCategoryParts },
  { path: 'seller-engine-parts', component: SellerEngineParts },
  { path: 'seller-brakes-parts', component: SellerBrakes },
  { path: 'seller-electrical-parts', component: SellerElectricalParts },
  { path: 'seller-suspension-parts', component: SellerSuspensionParts },
  { path: 'seller-bodyshow-parts', component: SellerBodyParts },
  { path: 'seller-hydrolic-parts', component: SellerHydraulicFluids },
  //  seller product management routes
  { path: 'seller-addproduct', component: AddProduct },
  { path: 'seller-editproduct', component: EditProduct },

  { path: 'seller-vehicle-brands', component: AddVehicleBrands },
  {path: 'seller-add-model', component: AddVehicleModels},
  { path: '**', redirectTo: 'login' }
];