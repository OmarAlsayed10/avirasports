import { buildChargeSignature } from './fawry.reference';

const FAWRY_BASE_URL = process.env.FAWRY_BASE_URL ?? 'https://atfawry.fawrystaging.com';
const MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE ?? '';
const SECURITY_KEY = process.env.FAWRY_SECURITY_KEY ?? '';

export class FawryError extends Error {
  constructor(
    message: string,
    public readonly code: string | number
  ) {
    super(message);
    this.name = 'FawryError';
  }
}

export type ChargeItem = {
  itemId: string;
  description: string;
  price: number;
  quantity: number;
};

export type ChargeInput = {
  merchantRefNum: string;
  customerProfileId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  paymentMethod: 'CARD' | 'PAYATFAWRY';
  amount: number;
  description: string;
  chargeItems: ChargeItem[];
  paymentExpiry?: number;
};

export type ChargeResponse = {
  type: string;
  referenceNumber?: string;
  merchantRefNumber: string;
  orderAmount: number;
  paymentAmount: number;
  paymentMethod: string;
  statusCode: number;
  statusDescription: string;
  expirationTime?: number;
  nextAction?: { type: string; redirectUrl: string };
};

export type StatusResponse = {
  paymentStatus: 'NEW' | 'PAID' | 'EXPIRED' | 'REFUNDED' | 'CANCELED' | 'FAILED';
  fawryRefNumber?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  expirationTime?: number;
};

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
  throw new FawryError(lastError?.message ?? 'Network error', 'NETWORK');
}

export async function chargeRequest(input: ChargeInput): Promise<ChargeResponse> {
  const signature = buildChargeSignature(
    MERCHANT_CODE,
    input.merchantRefNum,
    input.customerProfileId,
    input.paymentMethod,
    input.amount,
    SECURITY_KEY
  );

  const body = {
    merchantCode: MERCHANT_CODE,
    merchantRefNum: input.merchantRefNum,
    customerProfileId: input.customerProfileId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerMobile: input.customerMobile,
    paymentMethod: input.paymentMethod,
    amount: input.amount.toFixed(2),
    currencyCode: 'EGP',
    description: input.description,
    chargeItems: input.chargeItems,
    paymentExpiry: input.paymentExpiry ?? Date.now() + 48 * 60 * 60 * 1000,
    signature,
  };

  const res = await fetchWithRetry(
    `${FAWRY_BASE_URL}/ECommerceWeb/Fawry/payments/charge`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new FawryError(`Fawry charge failed: ${res.status}`, res.status);
  }

  const data = (await res.json()) as ChargeResponse;
  if (data.statusCode !== 200) {
    throw new FawryError(data.statusDescription ?? 'Fawry error', data.statusCode);
  }

  return data;
}

export async function getPaymentStatus(merchantRefNum: string): Promise<StatusResponse> {
  const { createHash } = await import('crypto');
  const signature = createHash('sha256')
    .update(MERCHANT_CODE + merchantRefNum + SECURITY_KEY)
    .digest('hex');

  const url = new URL(`${FAWRY_BASE_URL}/ECommerceWeb/Fawry/payments/status/v2`);
  url.searchParams.set('merchantCode', MERCHANT_CODE);
  url.searchParams.set('merchantRefNumber', merchantRefNum);
  url.searchParams.set('signature', signature);

  const res = await fetchWithRetry(url.toString(), { method: 'GET' });
  if (!res.ok) throw new FawryError(`Fawry status check failed: ${res.status}`, res.status);
  return (await res.json()) as StatusResponse;
}
