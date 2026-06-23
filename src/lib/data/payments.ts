export type PaymentMethodConfig = {
  enabled: boolean;
  displayName: Record<string, string>;
  merchantNumber: string;
  qrImageUrl: string;
  instructions: Record<string, string>;
};

export type PaymentSettings = {
  hesabpay: PaymentMethodConfig;
  atomapay: PaymentMethodConfig;
};

const emptyPaymentMethod = (): PaymentMethodConfig => ({
  enabled: false,
  displayName: {},
  merchantNumber: "",
  qrImageUrl: "",
  instructions: {},
});

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  hesabpay: emptyPaymentMethod(),
  atomapay: emptyPaymentMethod(),
};

export function hasPaymentConfig(method: PaymentMethodConfig): boolean {
  if (!method.enabled) return false;
  return Boolean(
    method.merchantNumber.trim() ||
      method.qrImageUrl.trim() ||
      Object.values(method.instructions).some((v) => v?.trim()),
  );
}

export function hasAnyPaymentMethod(settings: PaymentSettings): boolean {
  return (
    hasPaymentConfig(settings.hesabpay) || hasPaymentConfig(settings.atomapay)
  );
}
