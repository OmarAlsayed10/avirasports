'use client';

import { useFieldArray } from 'react-hook-form';
import { useProductForm } from './product-form-provider';
import { SectionShell } from './sectionSheel';
import { useLocale } from '@/modules/_shared/i18n/i18n.context';

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-500 mt-1';

export function QuantityOffersSection() {
  const { form } = useProductForm();
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'quantityOffers' });
  const { t } = useLocale();

  return (
    <SectionShell
      title={t.admin.quantityOffers}
      action={
        <button
          type="button"
          onClick={() =>
            append({ quantity: 2, offerPriceEgp: 0, isActive: true, popupIntervalMinutes: 10 })
          }
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t.admin.addQuantityOffer}
        </button>
      }
    >
      {fields.length === 0 ? (
        <p className="text-sm text-gray-400">{t.admin.noQuantityOffersYet}</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className={labelCls}>{t.admin.qtyOfferQty}</label>
                  <input
                    {...register(`quantityOffers.${index}.quantity`)}
                    type="number"
                    min="2"
                    className={inputCls}
                    placeholder="2"
                  />
                  {errors.quantityOffers?.[index]?.quantity && (
                    <p className={errorCls}>{errors.quantityOffers[index]?.quantity?.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>{t.admin.qtyOfferPrice}</label>
                  <input
                    {...register(`quantityOffers.${index}.offerPriceEgp`)}
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputCls}
                    placeholder="0.00"
                  />
                  {errors.quantityOffers?.[index]?.offerPriceEgp && (
                    <p className={errorCls}>{errors.quantityOffers[index]?.offerPriceEgp?.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>{t.admin.qtyOfferInterval}</label>
                  <input
                    {...register(`quantityOffers.${index}.popupIntervalMinutes`)}
                    type="number"
                    min="1"
                    max="120"
                    className={inputCls}
                    placeholder="10"
                  />
                </div>

                <div className="flex items-center gap-3 pb-1">
                  <div className="flex items-center gap-2">
                    <input
                      {...register(`quantityOffers.${index}.isActive`)}
                      type="checkbox"
                      id={`qty-offer-active-${index}`}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`qty-offer-active-${index}`}
                      className="text-sm text-gray-700 select-none"
                    >
                      {t.admin.qtyOfferActive}
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors ml-auto"
                  >
                    {t.admin.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
