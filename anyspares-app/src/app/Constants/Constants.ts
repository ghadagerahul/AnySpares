import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Constants {
    static readonly TWO_WHEELER = "Two Wheelers";
    static readonly THREE_WHEELER = "Three Wheelers";
    static readonly FOUR_WHEELER = "Four Wheelers";
    static readonly HEAVY_VEHICLE = "Heavy Vehicles";
}
