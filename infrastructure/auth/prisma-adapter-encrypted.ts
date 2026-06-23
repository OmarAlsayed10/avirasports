import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import type { Adapter, AdapterAccount } from 'next-auth/adapters';
import { encryptToken, decryptToken } from '@/infrastructure/crypto/token-cipher';

function encryptAccount(account: AdapterAccount): AdapterAccount {
  return {
    ...account,
    access_token: account.access_token ? encryptToken(account.access_token) : account.access_token,
    refresh_token: account.refresh_token ? encryptToken(account.refresh_token) : account.refresh_token,
  };
}

function decryptAccount(account: AdapterAccount | null): AdapterAccount | null {
  if (!account) return null;
  return {
    ...account,
    access_token: account.access_token ? decryptToken(account.access_token) : account.access_token,
    refresh_token: account.refresh_token ? decryptToken(account.refresh_token) : account.refresh_token,
  };
}

export function encryptedPrismaAdapter(prisma: PrismaClient): Adapter {
  const base = PrismaAdapter(prisma);
  return {
    ...base,
    linkAccount: async (account) => {
      await base.linkAccount!(encryptAccount(account));
    },
    getAccount: base.getAccount
      ? async (providerAccountId, provider) => {
          const account = await base.getAccount!(providerAccountId, provider);
          return decryptAccount(account);
        }
      : undefined,
  };
}
