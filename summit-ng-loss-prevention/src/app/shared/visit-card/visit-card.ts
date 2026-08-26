import { Component, ElementRef, input, linkedSignal, output, signal, viewChild } from '@angular/core';
import { InputText } from '@openng/optimus-ui/inputtext';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideCalendarPlus, LucideCheck, LucideCirclePlus, LucideMapPin, LucidePencil, LucideShieldPlus, LucideTrash2, LucideUsers, LucideX } from '@lucide/angular';
import { UiField } from '../ui-field/ui-field';
import { RecommendationDialog } from '../recommendation-dialog/recommendation-dialog';

export interface VisitDetails { readonly id: number; readonly title: string; readonly location: string; readonly description: string; readonly date: string; readonly badge?: string; readonly contact: string; readonly timing: 'past' | 'present' | 'future'; }

interface VisitAddress {
  readonly city: string;
  readonly postalCode: string;
  readonly state: string;
  readonly street: string;
  readonly unit: string;
}

const VERIFIED_ADDRESSES: readonly VisitAddress[] = [
  { street: '123 Main St', unit: '', city: 'Somewhere', state: 'TX', postalCode: '21333' },
  { street: '22 Main St', unit: '', city: 'Elsewhere', state: 'TX', postalCode: '31333' },
  { street: '600 Congress Ave', unit: 'Suite 1400', city: 'Austin', state: 'TX', postalCode: '78701' },
];

@Component({ selector: 'app-visit-card', imports: [ButtonDirective, InputText, LucideCalendarPlus, LucideCheck, LucideCirclePlus, LucideMapPin, LucidePencil, LucideShieldPlus, LucideTrash2, LucideUsers, LucideX, RecommendationDialog, UiField], templateUrl: './visit-card.html', styleUrl: './visit-card.scss' })
export class VisitCard {
  private readonly addressDialog = viewChild.required<ElementRef<HTMLDialogElement>>('addressDialog');
  private readonly recommendationDialog = viewChild.required(RecommendationDialog);
  readonly visit = input.required<VisitDetails>();
  readonly canRemove = input(false);
  readonly canAdd = input(true);
  readonly removeVisit = output<number>();
  readonly addVisit = output<void>();
  readonly locationChange = output<string>();
  readonly contactPicker = output<void>();
  readonly verifiedAddresses = VERIFIED_ADDRESSES;
  readonly address = signal<VisitAddress>(VERIFIED_ADDRESSES[0]);
  readonly recommendationCount = linkedSignal(() => Number(this.visit().badge ?? 0));

  openRecommendationDialog(): void {
    this.recommendationDialog().open();
  }

  recommendationSaved(): void {
    this.recommendationCount.update((count) => count + 1);
  }

  downloadCalendarInvite(): void {
    const visit = this.visit();
    const date = visit.date.split('/');
    const startDate = date.length === 3 ? `${date[2]}${date[0]}${date[1]}` : '20260826';
    const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Summit//Loss Prevention Visit//EN', 'BEGIN:VEVENT', `UID:visit-${visit.id}@summit`, `DTSTAMP:${startDate}T120000Z`, `DTSTART;VALUE=DATE:${startDate}`, `SUMMARY:Loss Prevention — ${visit.title}`, `LOCATION:${visit.location}`, `DESCRIPTION:Loss prevention visit for ${visit.contact}.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
    link.download = `${visit.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  openAddressDialog(): void {
    const match = VERIFIED_ADDRESSES.find((address) => this.formatAddress(address) === this.visit().location);
    this.address.set(match ?? { street: this.visit().location, unit: '', city: '', state: '', postalCode: '' });
    this.addressDialog().nativeElement.showModal();
  }

  closeAddressDialog(): void {
    this.addressDialog().nativeElement.close();
  }

  selectVerifiedAddress(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const match = VERIFIED_ADDRESSES.find((address) => this.formatAddress(address) === value);
    if (match) this.address.set(match);
  }

  updateAddress(field: keyof VisitAddress, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.address.update((address) => ({ ...address, [field]: value }));
  }

  saveAddress(): void {
    this.locationChange.emit(this.formatAddress(this.address()));
    this.closeAddressDialog();
  }

  formatAddress(address: VisitAddress): string {
    const street = [address.street, address.unit].filter(Boolean).join(', ');
    const locality = [address.city, address.state, address.postalCode].filter(Boolean).join(' ');
    return [street, locality].filter(Boolean).join(', ');
  }
}
