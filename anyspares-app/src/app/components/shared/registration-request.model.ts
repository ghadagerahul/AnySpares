export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  businessName: string;
  ownerName: string;
  mobileNo: Number;
  gstNumber: string;
  completeAddress: string;
  city: string;
  pincode: number;
  vehicleType: string[];
  password: string;
  confPassword: string;
  userType: string;
}