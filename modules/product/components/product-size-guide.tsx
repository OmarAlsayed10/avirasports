import { Truck, Scale } from "lucide-react";
import { tr } from "@/modules/_shared/i18n/i18n.translations";

export function ProductSizeGuide({
  locale,
  weights,
  hasReturnPolicy,
}: {
  locale: "en" | "ar";
  hasReturnPolicy: boolean;
  weights: {
    size: string;
    minWeightKg: number | null;
    maxWeightKg: number | null;
  }[];
}) {
  const t = tr(locale).product;
  if (!hasReturnPolicy && weights.length === 0) return null;
  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-2">
      {weights.length > 0 && (
        <div className="rounded-xl border border-border-primary/20 bg-bg-page p-4">
          <div className="flex items-center gap-2 text-text-primary">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">{t.size}</h2>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            {weights.map((weight) => (
              <div
                key={weight.size}
                className="flex items-center justify-between rounded-lg bg-bg-white px-3 py-2"
              >
                <dt className="font-semibold text-text-primary">
                  {weight.size}
                </dt>
                <dd className="text-sm text-text-secondary">
                  {weight.minWeightKg != null && weight.maxWeightKg != null
                    ? `${weight.minWeightKg}–${weight.maxWeightKg} kg`
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {hasReturnPolicy && (
        <div className="rounded-xl border border-border-primary/20 bg-bg-page p-4">
          <div className="flex items-center gap-2 text-text-primary">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">
              {tr(locale).home.trustReturnsTitle}
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {tr(locale).home.trustReturnsSub}
          </p>
        </div>
      )}
    </section>
  );
}
