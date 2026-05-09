'use client';

import { useState } from 'react';
import { useProductForm } from './product-form-provider';

export function useAttrNames(initialNames: string[] = ['Size', 'Color']) {
  const { form } = useProductForm();
  const { watch, setValue } = form;

  const [attrNames, setAttrNames] = useState<string[]>(initialNames);
  const [newAttrName, setNewAttrName] = useState('');

  const addAttrName = () => {
    const name = newAttrName.trim();
    if (!name || attrNames.map((n) => n.toLowerCase()).includes(name.toLowerCase())) return;

    setAttrNames((prev) => [...prev, name]);

    const variants = watch('variants') ?? [];
    variants.forEach((_, i) => {
      const current = { ...(watch(`variants.${i}.attributes`) ?? {}) };
      current[name.toLowerCase()] = '';
      setValue(`variants.${i}.attributes`, current);
    });

    setNewAttrName('');
  };

  const removeAttrName = (attrName: string) => {
    if (attrNames.length <= 1) return;

    setAttrNames((prev) => prev.filter((n) => n !== attrName));

    const variants = watch('variants') ?? [];
    variants.forEach((_, i) => {
      const current = { ...(watch(`variants.${i}.attributes`) ?? {}) };
      delete current[attrName.toLowerCase()];
      setValue(`variants.${i}.attributes`, current);
    });
  };

  return {
    attrNames,
    newAttrName,
    setNewAttrName,
    addAttrName,
    removeAttrName,
  };
}