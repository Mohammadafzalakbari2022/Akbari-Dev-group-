import { pickLocale } from "@/lib/i18n-json";
import type { PaymentSettings } from "@/lib/data/payments";
import { hasPaymentConfig } from "@/lib/data/payments";
import { RemoteImage } from "@/components/ui/RemoteImage";

type HowToPaySectionProps = {
  payments: PaymentSettings;
  locale: string;
  title: string;
};

function PaymentCard({
  name,
  merchantNumber,
  qrImageUrl,
  instructions,
  locale,
}: {
  name: string;
  merchantNumber: string;
  qrImageUrl: string;
  instructions: Record<string, string>;
  locale: string;
}) {
  const text = pickLocale(instructions, locale);

  return (
    <div className="rounded-xl glass-panel p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
      {merchantNumber && (
        <p className="text-sm text-text-muted">
          <span className="font-mono text-text-primary">{merchantNumber}</span>
        </p>
      )}
      {qrImageUrl && (
        <RemoteImage
          src={qrImageUrl}
          alt={name}
          width={200}
          height={200}
          className="rounded-lg mx-auto"
        />
      )}
      {text && (
        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
          {text}
        </p>
      )}
    </div>
  );
}

export function HowToPaySection({
  payments,
  locale,
  title,
}: HowToPaySectionProps) {
  const methods = [
    hasPaymentConfig(payments.hesabpay) && {
      key: "hesabpay",
      name:
        pickLocale(payments.hesabpay.displayName, locale) || "HesabPay",
      ...payments.hesabpay,
    },
    hasPaymentConfig(payments.atomapay) && {
      key: "atomapay",
      name: pickLocale(payments.atomapay.displayName, locale) || "ATOMA Pay",
      ...payments.atomapay,
    },
  ].filter(Boolean) as Array<{
    key: string;
    name: string;
    merchantNumber: string;
    qrImageUrl: string;
    instructions: Record<string, string>;
  }>;

  if (methods.length === 0) return null;

  return (
    <section className="space-y-6" aria-labelledby="how-to-pay-heading">
      <h2
        id="how-to-pay-heading"
        className="text-2xl font-bold text-text-primary"
      >
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {methods.map((m) => (
          <PaymentCard
            key={m.key}
            name={m.name}
            merchantNumber={m.merchantNumber}
            qrImageUrl={m.qrImageUrl}
            instructions={m.instructions}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}
