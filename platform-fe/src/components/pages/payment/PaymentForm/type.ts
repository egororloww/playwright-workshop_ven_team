export type SuccessTokenResponse = {
  details: {
    cardNumber: string;
    cardBin: string;
    cardLast4: string;
    cardType: string;
    cardSecurityCode: boolean;
    expiryMonth: string;
    expiryYear: string;
  };
  paymentReference: string;
};

export interface Reason {
  code: string;
  message: string;
}

export interface ErrorTokenResponse {
  error: boolean;
  reasons: Reason[];
}
