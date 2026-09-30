import { validateValue, looksLikeSpam, formatPhone, type FieldSpec, type Rule } from '@/lib/validation';
import { SITE } from '@/lib/site';

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function specFor(control: Control): FieldSpec {
  const rules = (control.dataset.rules ?? '').split(' ').filter(Boolean) as Rule[];
  const accept = control.dataset.accept?.split(',').filter(Boolean);
  return {
    label: control.dataset.label ?? control.name,
    rules,
    verb: control.dataset.verb === 'choose' ? 'choose' : 'enter',
    maxLength: control.dataset.maxlength ? Number(control.dataset.maxlength) : undefined,
    maxBytes: control.dataset.maxbytes ? Number(control.dataset.maxbytes) : undefined,
    accept,
  };
}

function showError(control: Control, message: string | null): void {
  const field = control.closest<HTMLElement>('[data-field]');
  const error = field?.querySelector<HTMLElement>('[data-error]');
  if (!error) return;
  if (message) {
    control.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
  } else {
    control.removeAttribute('aria-invalid');
    error.textContent = '';
    error.hidden = true;
  }
}

function validateControl(control: Control): string | null {
  const file = control instanceof HTMLInputElement && control.type === 'file' ? control.files?.[0] ?? null : null;
  const message = validateValue(control.value, specFor(control), file);
  showError(control, message);
  return message;
}

function renderSummary(form: HTMLFormElement, errors: { control: Control; message: string }[]): void {
  const summary = form.querySelector<HTMLElement>('[data-summary]');
  const list = form.querySelector<HTMLElement>('[data-summary-list]');
  const title = form.querySelector<HTMLElement>('[data-summary-title]');
  if (!summary || !list || !title) return;
  list.replaceChildren();
  if (errors.length === 0) {
    summary.hidden = true;
    return;
  }
  title.textContent =
    errors.length === 1 ? 'Please fix 1 problem before sending:' : `Please fix ${errors.length} problems before sending:`;
  for (const { control, message } of errors) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${control.id}`;
    a.textContent = message;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      control.focus();
    });
    li.append(a);
    list.append(li);
  }
  summary.hidden = false;
  summary.focus();
}

function encode(form: HTMLFormElement): { body: BodyInit; headers?: HeadersInit } {
  const data = new FormData(form);
  // Third-party endpoints accept multipart and reply with JSON.
  if (form.dataset.delivery === 'endpoint') return { body: data, headers: { Accept: 'application/json' } };
  if (form.enctype === 'multipart/form-data') return { body: data };
  const params = new URLSearchParams();
  data.forEach((value, key) => params.append(key, typeof value === 'string' ? value : value.name));
  return { body: params.toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
}

function trackConversion(formName: string): void {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', 'generate_lead', { form_name: formName });
}

function enhance(form: HTMLFormElement): void {
  if (form.dataset.enhanced) return;
  form.dataset.enhanced = 'true';
  form.noValidate = true;

  const shell = form.closest<HTMLElement>('[data-form-shell]');
  const success = shell?.querySelector<HTMLElement>('[data-success]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const controls = Array.from(form.querySelectorAll<Control>('[data-rules]'));
  let startedAt = 0;

  form.addEventListener('focusin', () => {
    if (!startedAt) startedAt = Date.now();
  });

  for (const control of controls) {
    control.addEventListener('blur', () => {
      if (control.value || control.getAttribute('aria-invalid')) validateControl(control);
      if (control instanceof HTMLInputElement && control.type === 'tel' && !control.getAttribute('aria-invalid')) {
        control.value = formatPhone(control.value);
      }
    });
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid')) validateControl(control);
    });
    control.addEventListener('change', () => {
      if (control.getAttribute('aria-invalid') || control instanceof HTMLSelectElement) validateControl(control);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.textContent = '';

    const errors = controls
      .map((control) => ({ control, message: validateControl(control) }))
      .filter((e): e is { control: Control; message: string } => Boolean(e.message));
    renderSummary(form, errors);
    if (errors.length) return;

    const honeypot = form.querySelector<HTMLInputElement>('[name="company_website"]')?.value ?? '';
    const showSuccess = () => {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    };

    if (looksLikeSpam({ honeypot, startedAt, now: Date.now() })) {
      // Don't tell bots they were caught.
      showSuccess();
      return;
    }

    button?.setAttribute('aria-busy', 'true');
    if (button) button.disabled = true;
    const original = label?.textContent ?? '';
    if (label) label.textContent = 'Sending…';

    try {
      if (form.dataset.delivery === 'preview') {
        showSuccess();
        return;
      }
      const { body, headers } = encode(form);
      const target = form.dataset.delivery === 'endpoint' && form.dataset.endpoint ? form.dataset.endpoint : '/';
      const response = await fetch(target, { method: 'POST', body, headers });
      if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`);
      trackConversion(form.name);
      showSuccess();
    } catch {
      if (status) {
        status.textContent = `Sorry — your message didn’t go through. Please try again, or call us at ${SITE.phone}.`;
      }
    } finally {
      button?.removeAttribute('aria-busy');
      if (button) button.disabled = false;
      if (label) label.textContent = original;
    }
  });
}

export function initForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-stars-form]').forEach(enhance);
}
