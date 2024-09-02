export enum PaymentGatewayTypes {
  GATEWAY_EKPAY = 'EKPAY',
  GATEWAY_SSLCOMMERZ = 'SSLCOMMERZ',
  GATEWAY_BKASH = 'BKASH',
  GATEWAY_NAGAD = 'NAGAD',
  GATEWAY_PORTWALLET = 'PORTWALLET',
  GATEWAY_SHURJOPAY = 'SHURJOPAY',
  GATEWAY_AAMARPAY = 'AAMARPAY',
  GATEWAY_2CHECKOUT = '2CHECKOUT',
  GATEWAY_AUTHORIZEDOTNET = 'AUTHORIZEDOTNET',
  GATEWAY_STRIPE = 'STRIPE',
  GATEWAY_PAYPAL = 'PAYPAL',
}

export const configMethods: any = {
  [PaymentGatewayTypes.GATEWAY_EKPAY]: {
    label: 'ekpay',
    imageUrl: '/images/payment/ekpay.png',
  },
  [PaymentGatewayTypes.GATEWAY_SSLCOMMERZ]: {
    label: 'sslcommerz payment',
    imageUrl: 'https://avatars.githubusercontent.com/u/19384040?s=280&v=4',
  },
  [PaymentGatewayTypes.GATEWAY_BKASH]: {
    label: 'bkash',
    imageUrl: '/images/payment/bkash.png',
  },
  [PaymentGatewayTypes.GATEWAY_NAGAD]: {
    label: 'nagad',
    imageUrl: '/images/payment/nagad.png',
  },
};
