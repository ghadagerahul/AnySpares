import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../navbar-component/navbar-component";

@Component({
  selector: "app-two-wheeler-product-details",
  imports: [CommonModule, NavbarComponent],
  templateUrl: "./two-wheeler-product-details.html",
  styleUrl: "./two-wheeler-product-details.css",
})
export class TwoWheelerProductDetails {
  quantity = 1;
  activeTab: "specs" | "features" | "compatibility" = "specs";
  Math = Math;

  product = {
    name: "Carburetor Repair Kit",
    type: "Aftermarket",
    rating: 4.2,
    reviews: 74,
    price: 449,
    originalPrice: 599,
    discount: 25,
    inStock: true,
    imageUrl: "assets/two-wheelers/product-services/carburetor-kit.jpg",
    specs: {
      partNumber: "SP-8-2024",
      brandCompatibility: ["Hero", "Honda", "Bajaj"],
      material: "High-Grade Steel",
      warranty: "6 Months",
      weight: "0.5 kg",
      dimensions: "15 x 10 x 5 cm",
    },
  };
  get total(): number {
    return this.quantity * this.product.price;
  }

  buyNow(): void {
    console.log("buyNow method called...!!!");
  }

  addToCart(): void {
    console.log("addToCart method called..!!!");
  }
}
