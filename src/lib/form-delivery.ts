/**
 * Where form submissions go. Decided at build time:
 *
 * - `netlify`  (default)  Netlify Forms — production host.
 * - `endpoint`            POST to PUBLIC_FORM_ENDPOINT (e.g. Formspree/Basin),
 *                         for hosts without built-in forms such as Vercel.
 * - `preview`             Nothing is sent; the form shows a clear "preview"
 *                         notice. Automatic on Vercel when no endpoint is set,
 *                         so a temporary host never silently loses inquiries.
 */

export type FormMode = 'netlify' | 'endpoint' | 'preview';

export interface FormDelivery {
  mode: FormMode;
  endpoint: string | null;
}

export function resolveFormDelivery(env: {
  mode?: string | undefined;
  endpoint?: string | undefined;
  onVercel?: boolean;
}): FormDelivery {
  const endpoint = env.endpoint?.trim() || null;
  if (endpoint && !/^https:\/\//.test(endpoint)) {
    throw new Error(`PUBLIC_FORM_ENDPOINT must be an https:// URL (got "${endpoint}").`);
  }
  const explicit = env.mode?.trim();
  if (explicit === 'netlify' || explicit === 'preview') return { mode: explicit, endpoint: null };
  if (explicit === 'endpoint' || endpoint) {
    if (!endpoint) throw new Error('PUBLIC_FORM_MODE=endpoint requires PUBLIC_FORM_ENDPOINT.');
    return { mode: 'endpoint', endpoint };
  }
  if (explicit) throw new Error(`Unknown PUBLIC_FORM_MODE "${explicit}" (use netlify, endpoint or preview).`);
  return env.onVercel ? { mode: 'preview', endpoint: null } : { mode: 'netlify', endpoint: null };
}

/** Build-time delivery for this deploy (frontmatter runs in Node during the build). */
export function formDelivery(): FormDelivery {
  return resolveFormDelivery({
    mode: import.meta.env.PUBLIC_FORM_MODE,
    endpoint: import.meta.env.PUBLIC_FORM_ENDPOINT,
    onVercel: Boolean(process.env.VERCEL),
  });
}
