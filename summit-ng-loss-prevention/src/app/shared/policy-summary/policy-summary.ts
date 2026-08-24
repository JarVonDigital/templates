import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideAlertTriangle, LucideBuilding2, LucideChevronRight, LucideCirclePlus, LucideMail, LucidePencil, LucidePhone, LucideSave, LucideSearch, LucideTrash2, LucideX } from '@lucide/angular';

interface LossPreventionContact {
  readonly cell: string;
  readonly email: string;
  readonly firstName: string;
  readonly id: number;
  readonly lastName: string;
  readonly method: 'Cell' | 'Email' | 'Office';
  readonly notes: string;
  readonly office: string;
}

const EMPTY_CONTACT: LossPreventionContact = { id: 0, firstName: '', lastName: '', office: '', cell: '', email: '', method: 'Email', notes: '' };
type ContactMode = 'create' | 'delete' | 'edit' | 'idle';

@Component({ selector: 'app-policy-summary', imports: [ButtonDirective, LucideAlertTriangle, LucideBuilding2, LucideChevronRight, LucideCirclePlus, LucideMail, LucidePencil, LucidePhone, LucideSave, LucideSearch, LucideTrash2, LucideX], templateUrl: './policy-summary.html', styleUrl: './policy-summary.scss' })
export class PolicySummary {
  private readonly contactsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('contactsDialog');
  private readonly editorHeading = viewChild<ElementRef<HTMLHeadingElement>>('editorHeading');
  private nextContactId = 3;
  readonly contacts = signal<readonly LossPreventionContact[]>([
    { id: 1, firstName: 'Benjamin', lastName: 'Hammerton', email: 'benjamin.hammerton@something.com', office: '812-234-1233', cell: '812-234-1233', method: 'Office', notes: '' },
    { id: 2, firstName: 'Susie', lastName: 'Hammerton', email: 'susie.hammerton@something.com', office: '', cell: '812-234-1233', method: 'Cell', notes: '' },
  ]);
  readonly searchQuery = signal('');
  readonly filteredContacts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.contacts();
    return this.contacts().filter((contact) => [contact.firstName, contact.lastName, contact.email, contact.office, contact.cell, contact.method].some((value) => value.toLowerCase().includes(query)));
  });
  readonly draft = signal<LossPreventionContact>({ ...EMPTY_CONTACT });
  readonly mode = signal<ContactMode>('idle');
  readonly statusMessage = signal('');
  readonly selectedContact = computed(() => this.contacts().find((contact) => contact.id === this.draft().id));

  openContacts(): void {
    this.mode.set('idle');
    this.searchQuery.set('');
    this.statusMessage.set('');
    this.contactsDialog().nativeElement.showModal();
  }

  closeContacts(): void { this.contactsDialog().nativeElement.close(); }

  addContact(): void {
    this.draft.set({ ...EMPTY_CONTACT, id: this.nextContactId });
    this.setMode('create');
  }

  editContact(contact: LossPreventionContact): void {
    this.draft.set({ ...contact });
    this.setMode('edit');
  }

  cancelAction(): void {
    if (this.mode() === 'delete') {
      this.setMode('edit');
      return;
    }
    this.mode.set('idle');
  }

  requestDelete(): void { this.setMode('delete'); }

  updateDraft(field: keyof LossPreventionContact, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    this.draft.update((contact) => ({ ...contact, [field]: value }));
  }

  updateSearch(event: Event): void { this.searchQuery.set((event.target as HTMLInputElement).value); }

  saveContact(): void {
    const draft = this.draft();
    const exists = this.contacts().some((contact) => contact.id === draft.id);
    this.contacts.update((contacts) => exists ? contacts.map((contact) => contact.id === draft.id ? draft : contact) : [...contacts, draft]);
    if (!exists) this.nextContactId++;
    this.statusMessage.set(`${draft.firstName} ${draft.lastName}`.trim() + (exists ? ' was updated.' : ' was added.'));
    this.mode.set('idle');
  }

  deleteContact(): void {
    const contact = this.draft();
    const id = contact.id;
    this.contacts.update((contacts) => contacts.filter((contact) => contact.id !== id));
    this.statusMessage.set(`${contact.firstName} ${contact.lastName}`.trim() + ' was deleted.');
    this.mode.set('idle');
  }


  private setMode(mode: ContactMode): void {
    this.mode.set(mode);
    setTimeout(() => this.editorHeading()?.nativeElement.focus());
  }
}
