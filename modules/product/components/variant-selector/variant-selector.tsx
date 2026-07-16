"use client";

import { useState, useMemo } from "react";
import { cn } from "@/modules/_shared/utils/cn";
import { useLocale } from "@/modules/_shared/i18n/i18n.context";
import { variantSelectorTokens } from "./variant-selector.tokens";
import type { VariantSelectorProps } from "./variant-selector.types";
import { ONE_SIZE } from "@/modules/_shared/constants/sizes.constants";

function isColorKey(key: string): boolean {
  return key.toLowerCase() === "color";
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  const { t } = useLocale();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const vs = variantSelectorTokens;

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    variants.forEach((v) => Object.keys(v.attributes).forEach((k) => keys.add(k)));
    return Array.from(keys).filter((key) => {
      const values = variants.map((variant) => variant.attributes[key]).filter(Boolean);
      return new Set(values).size > 1;
    });
  }, [variants]);

  const attributeLabel = (key: string) => {
    if (key.toLowerCase() === "size") return t.product.size;
    if (key.toLowerCase() === "color") return t.product.color;
    return key;
  };

  const attributeValue = (value: string) => value === ONE_SIZE ? t.product.oneSize : value;

  const valuesByKey = useMemo(() => {
    const result: Record<string, string[]> = {};
    allKeys.forEach((key) => {
      const seen = new Set<string>();
      const values: string[] = [];
      variants.forEach((v) => {
        const val = v.attributes[key];
        if (val !== undefined && val !== "" && !seen.has(val)) {
          seen.add(val);
          values.push(val);
        }
      });
      result[key] = values;
    });
    return result;
  }, [allKeys, variants]);

  if (variants.length <= 1 || allKeys.length === 0) return null;

  function getStatesForKey(key: string) {
    const otherEntries = Object.entries(selections).filter(([k]) => k !== key);
    const available = new Set<string>();
    const inStock = new Set<string>();

    variants.forEach((v) => {
      const attrVal = v.attributes[key];
      const matchesOthers = otherEntries.every(([k, val]) => v.attributes[k] === val);
      if (matchesOthers && attrVal !== undefined) {
        available.add(attrVal);
        if (v.stockCount > 0) inStock.add(attrVal);
      }
    });

    return { available, inStock };
  }

  function handleSelect(key: string, value: string) {
    if (selections[key] === value) {
      const next = { ...selections };
      delete next[key];
      setSelections(next);
      onSelect(null);
      return;
    }

    const next = { ...selections, [key]: value };

    allKeys.forEach((k) => {
      if (k === key || next[k] === undefined) return;
      const stillReachable = variants.some((v) =>
        Object.entries(next).every(([ak, av]) => v.attributes[ak] === av),
      );
      if (!stillReachable) delete next[k];
    });

    setSelections(next);

    const matched = variants.find((v) => allKeys.every((k) => v.attributes[k] === next[k]));
    onSelect(matched?.id ?? null);
  }

  return (
    <div className={vs.root} role="group" aria-label={t.product.variantSelect}>
      {allKeys.map((key) => {
        const isColor = isColorKey(key);
        const values = valuesByKey[key];
        const { available, inStock } = getStatesForKey(key);
        const selected = selections[key];

        return (
          <div key={key}>
            <h3 className={vs.groupLabel}>
              {attributeLabel(key)}
              {isColor && selected && (
                <span className={vs.colorHint}>{selected}</span>
              )}
            </h3>

            <div className={vs.optionRow}>
              {values.map((val) => {
                const isAvailable = available.has(val);
                const isInStock = inStock.has(val);
                const isSelected = selected === val;

                if (isColor) {
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => isAvailable && handleSelect(key, val)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                      aria-label={`${key} ${val}${!isInStock ? ` — ${t.product.variantOutOfStock}` : ""}`}
                      title={val}
                      className={cn(
                        vs.colorBtn,
                        isSelected
                          ? vs.colorBtnSelected
                          : isAvailable
                            ? vs.colorBtnAvailable
                            : vs.colorBtnUnavailable,
                        !isAvailable && "opacity-30 cursor-not-allowed",
                        isAvailable && !isInStock && "opacity-50",
                      )}
                      style={{ backgroundColor: val }}
                    />
                  );
                }

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => isAvailable && handleSelect(key, val)}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`${val}${!isInStock ? ` — ${t.product.variantOutOfStock}` : ""}`}
                    className={cn(
                      vs.sizeBtn,
                      isSelected
                        ? vs.sizeBtnSelected
                        : isAvailable && isInStock
                          ? vs.sizeBtnInStock
                          : isAvailable
                            ? vs.sizeBtnOutOfStock
                            : vs.sizeBtnUnavailable,
                    )}
                  >
                    {attributeValue(val)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
