import { type ZodErrorMap, ZodIssueCode } from 'zod';
import type { Translations } from './translations';

export function createZodErrorMap(t: Translations): ZodErrorMap {
  return (issue, ctx) => {
    const lastPath = issue.path[issue.path.length - 1];

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === 'undefined' || issue.received === 'null') {
          return { message: t.validation.required };
        }
        return { message: t.validation.invalidValue };

      case ZodIssueCode.too_small:
        if (issue.type === 'string') {
          if (issue.minimum === 1) return { message: t.validation.required };
          return { message: t.validation.tooShort(Number(issue.minimum)) };
        }
        return { message: ctx.defaultError };

      case ZodIssueCode.too_big:
        if (issue.type === 'string') {
          return { message: t.validation.tooLong(Number(issue.maximum)) };
        }
        return { message: ctx.defaultError };

      case ZodIssueCode.invalid_string:
        if (issue.validation === 'email') return { message: t.validation.emailInvalid };
        return { message: ctx.defaultError };

      case ZodIssueCode.invalid_enum_value:
        if (lastPath === 'governorate') return { message: t.validation.selectGovernorate };
        return { message: t.validation.invalidValue };

      case ZodIssueCode.custom:
        if (ctx.defaultError === 'Invalid Egyptian mobile number') {
          return { message: t.validation.phoneInvalid };
        }
        return { message: ctx.defaultError };

      default:
        return { message: ctx.defaultError };
    }
  };
}
