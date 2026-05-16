type ActionOk<T> = T extends void ? { ok: true } : { ok: true; data: T };
type ActionError = { ok: false; error: string; code?: string };

export type ActionResult<T = void> = ActionOk<T> | ActionError;
