'use server';

import { z } from 'zod';
import { requireAdmin } from '@/modules/admin/_shared/require-admin';
import { prisma } from '@/infrastructure/db/prisma';
import { GOVERNORATES } from '@/modules/_shared/constants/governorates.constants';
import {
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_DELIVERY_FEE_EGP,
  feeForGovernorate,
  type DeliveryZone,
} from '@/modules/_shared/constants/delivery-zones.constants';
import type { ActionResult } from '@/modules/_shared/types/action-result.type';

const SETTING_KEY = 'delivery_zones';

const zoneSchema = z.object({
  id: z.string().min(1).max(50),
  labelEn: z.string().min(1).max(80).trim(),
  labelAr: z.string().min(1).max(80).trim(),
  feeEgp: z.number().int().min(0).max(100000),
  governorates: z.array(z.enum(GOVERNORATES)),
});
const zonesSchema = z.array(zoneSchema).min(1).max(20);

/** Current zones from the DB, or the seeded defaults if the admin never saved any. */
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  if (!row) return DEFAULT_DELIVERY_ZONES;
  const parsed = zonesSchema.safeParse(row.value);
  return parsed.success ? parsed.data : DEFAULT_DELIVERY_ZONES;
}

/** Authoritative shipping cost for an order. */
export async function getShippingCostForGovernorate(gov: string): Promise<number> {
  const zones = await getDeliveryZones();
  return feeForGovernorate(zones, gov) ?? DEFAULT_DELIVERY_FEE_EGP;
}

export async function saveDeliveryZones(rawZones: unknown): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsed = zonesSchema.safeParse(rawZones);
  if (!parsed.success) {
    return { ok: false, error: 'Please review the delivery zones and try again.', code: 'VALIDATION' };
  }

  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: parsed.data },
    update: { value: parsed.data },
  });

  return { ok: true, data: null };
}
