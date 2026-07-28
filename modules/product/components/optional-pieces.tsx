"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCartStore } from "@/modules/cart/cart.store";
type Piece = {
  id: string;
  name: string;
  nameAr: string | null;
  imageUrl: string | null;
  basePriceEgp: number;
  variants: { sizes?: string[]; colors?: string[] };
};
export function OptionalPieces({
  pieces,
  locale,
  outfitProductId,
}: {
  pieces: Piece[];
  locale: "en" | "ar";
  outfitProductId: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [selected, setSelected] = useState<
    Record<string, { size?: string; color?: string }>
  >({});
  const ar = locale === "ar";
  if (!pieces.length) return null;
  return (
    <section className="mt-8 border-t border-border-primary/20 pt-6">
      <h2 className="text-lg font-semibold text-text-primary">
        {ar ? "أكمل الطقم" : "Complete the outfit"}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        {ar
          ? "إختر قطعة اختيارية لها مقاس ولون خاص بها."
          : "Choose an optional piece with its own size and color."}
      </p>
      <div className="mt-4 space-y-4">
        {pieces.map((piece) => {
          const choice = selected[piece.id] ?? {};
          const sizes = piece.variants.sizes ?? [];
          const colors = piece.variants.colors ?? [];
          const ready =
            (!sizes.length || choice.size) && (!colors.length || choice.color);
          return (
            <div key={piece.id} className="rounded-xl bg-bg-page p-4">
              <div className="flex gap-3">
                {piece.imageUrl && (
                  <img
                    src={piece.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {ar && piece.nameAr ? piece.nameAr : piece.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    EGP {piece.basePriceEgp}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {sizes.length > 0 && (
                  <label className="text-sm font-medium text-text-primary">
                    {ar ? "المقاس" : "Size"}
                    <select
                      value={choice.size ?? ""}
                      onChange={(e) =>
                        setSelected((current) => ({
                          ...current,
                          [piece.id]: { ...choice, size: e.target.value },
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-md border border-border-primary/30 bg-bg-white px-3"
                    >
                      <option value="">
                        {ar ? "إختر المقاس" : "Choose size"}
                      </option>
                      {sizes.map((size) => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  </label>
                )}
                {colors.length > 0 && (
                  <label className="text-sm font-medium text-text-primary">
                    {ar ? "ط§ظ„ظ„ظˆظ†" : "Color"}
                    <select
                      value={choice.color ?? ""}
                      onChange={(e) =>
                        setSelected((current) => ({
                          ...current,
                          [piece.id]: { ...choice, color: e.target.value },
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-md border border-border-primary/30 bg-bg-white px-3"
                    >
                      <option value="">
                        {ar ? "إختر لون" : "Choose color"}
                      </option>
                      {colors.map((color) => (
                        <option key={color}>{color}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <button
                type="button"
                disabled={!ready}
                onClick={() =>
                  addItem(
                    {
                      productId: outfitProductId,
                      name: piece.name,
                      nameAr: piece.nameAr ?? undefined,
                      brand: "",
                      imageUrl: piece.imageUrl ?? "",
                      unitPriceEgp: piece.basePriceEgp,
                      attributes: choice,
                      addOnId: piece.id,
                    },
                    1,
                  )
                }
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-btn-sm bg-primary-btn px-4 text-sm font-semibold text-text-on-dark disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {ar ? "أضف هذه القطعة" : "Add this piece"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
