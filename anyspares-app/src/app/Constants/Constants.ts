import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Constants {
    static readonly TWO_WHEELER = "Two Wheelers";
    static readonly THREE_WHEELER = "Three Wheelers";
    static readonly FOUR_WHEELER = "Four Wheelers";
    static readonly HEAVY_VEHICLE = "Heavy Vehicles";

    static readonly USER_BUYER = "buyer";
    static readonly USER_SELLER = "seller";

    static readonly Empty_STRING = "";
    static readonly ZERO_NUMBER = 0;

    static readonly REMOVETYPE_ALL = "all";
    static readonly REMOVETYPE_SINGLE = "single";
}
