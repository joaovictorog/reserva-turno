import { Check, createElement } from 'lucide';

const confirmation = document.createElement('dialog');
confirmation.className = 'confirmation-dialog';
confirmation.setAttribute('aria-labelledby', 'confirmation-title');
confirmation.setAttribute('aria-describedby', 'confirmation-message');
confirmation.innerHTML = `
  <h2 id="confirmation-title">Cancelar reserva?</h2>
  <p id="confirmation-message"></p>
  <div class="dialog-actions">
    <button type="button" class="keep-reservation" autofocus>Manter reserva</button>
    <button type="button" class="confirm-cancellation">Confirmar cancelamento</button>
  </div>
`;
document.body.append(confirmation);

let pendingAction: (() => void) | undefined;
let previousFocus: HTMLElement | null = null;

export function confirmCancellation(message: string, action: () => void): void {
  previousFocus = document.activeElement as HTMLElement;
  confirmation.querySelector('#confirmation-message')!.textContent = message;
  pendingAction = action;
  confirmation.returnValue = '';
  confirmation.showModal();
}

confirmation.querySelector('.keep-reservation')!.addEventListener('click', () => {
  confirmation.close();
});

confirmation.querySelector('.confirm-cancellation')!.addEventListener('click', () => {
  const action = pendingAction;
  pendingAction = undefined;
  confirmation.close('confirmed');
  action?.();
});

confirmation.addEventListener('close', () => {
  if (confirmation.open) {
    return;
  }
  pendingAction = undefined;
  if (confirmation.returnValue !== 'confirmed' && previousFocus?.isConnected) {
    previousFocus.focus();
  }
});

confirmation.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') {
    return;
  }
  const first = confirmation.querySelector<HTMLButtonElement>('.keep-reservation')!;
  const last = confirmation.querySelector<HTMLButtonElement>('.confirm-cancellation')!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const toast = document.createElement('div');
toast.className = 'feedback-toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
toast.hidden = true;
const icon = createElement(Check);
icon.setAttribute('aria-hidden', 'true');
const message = document.createElement('span');
toast.append(icon, message);
document.body.append(toast);
let toastTimeout: ReturnType<typeof setTimeout>;

export function notifySuccess(text: string): void {
  clearTimeout(toastTimeout);
  message.textContent = text;
  toast.hidden = false;
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 4500);
}
