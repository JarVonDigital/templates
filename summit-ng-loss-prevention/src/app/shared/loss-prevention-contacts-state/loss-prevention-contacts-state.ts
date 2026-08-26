import { Service, signal } from '@angular/core';

@Service()
export class LossPreventionContactsState {
  readonly openRequested = signal(false);

  requestOpen(): void { this.openRequested.set(true); }
  clearOpenRequest(): void { this.openRequested.set(false); }
}
