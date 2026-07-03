import type { Governorate } from './governorates.constants';

export type DeliveryZone = {
  id: string;
  labelEn: string;
  labelAr: string;
  feeEgp: number;
  governorates: Governorate[];
};

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'alexandria',
    labelEn: 'Alexandria',
    labelAr: 'الإسكندرية',
    feeEgp: 65,
    governorates: ['Alexandria'],
  },
  {
    id: 'neighboring',
    labelEn: 'Neighboring Governorates',
    labelAr: 'المحافظات المجاورة',
    feeEgp: 75,
    governorates: [
      'Cairo', 'Giza', 'Qalyubia', 'Beheira', 'Kafr El Sheikh', 'Gharbia',
      'Monufia', 'Dakahlia', 'Damietta', 'Sharqia', 'Port Said', 'Ismailia',
      'Suez', 'Faiyum',
    ],
  },
  {
    id: 'upper-red-sea',
    labelEn: 'Upper Egypt, Red Sea & surrounding',
    labelAr: 'الصعيد والبحر الأحمر وما يجاورها',
    feeEgp: 90,
    governorates: [
      'Beni Suef', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor', 'Aswan',
      'Red Sea', 'New Valley', 'Matrouh', 'North Sinai', 'South Sinai',
    ],
  },
];

export const DEFAULT_DELIVERY_FEE_EGP = 90;

export function feeForGovernorate(zones: DeliveryZone[], gov: string | undefined | null): number | null {
  if (!gov) return null;
  const zone = zones.find((z) => z.governorates.includes(gov as Governorate));
  return zone ? zone.feeEgp : DEFAULT_DELIVERY_FEE_EGP;
}
