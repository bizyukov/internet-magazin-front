export interface PaymentMethod {
  id?: number;
  type: string;
  details: {
    cardNumber: string;
    cardHolder: string;
    expiry: string; // MM/YY
    cvv: string;
  };
  isDefault: boolean;
}
