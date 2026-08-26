import { Component, computed, effect, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { Tab, TabList, Tabs } from '@openng/optimus-ui/tabs';
import { FormsModule } from '@angular/forms';
import { LucideAlertTriangle, LucideBuilding2, LucideChevronRight, LucideCirclePlus, LucideMail, LucidePencil, LucidePhone, LucideSave, LucideSearch, LucideTrash2, LucideX } from '@lucide/angular';
import { LossPreventionContactsState } from '../loss-prevention-contacts-state/loss-prevention-contacts-state';

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
type ContactTab = 'locations' | 'loss-prevention' | 'policy';

interface DirectoryItem {
  readonly email?: string;
  readonly id: number;
  readonly meta: string;
  readonly phone?: string;
  readonly title: string;
}

@Component({ selector: 'app-policy-summary', imports: [ButtonDirective, FormsModule, InputText, Select, Tab, TabList, Tabs, LucideAlertTriangle, LucideBuilding2, LucideChevronRight, LucideCirclePlus, LucideMail, LucidePencil, LucidePhone, LucideSave, LucideSearch, LucideTrash2, LucideX], templateUrl: './policy-summary.html', styleUrl: './policy-summary.scss' })
export class PolicySummary {
  private readonly contactsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('contactsDialog');
  private readonly editorHeading = viewChild<ElementRef<HTMLHeadingElement>>('editorHeading');
  private readonly contactsState = inject(LossPreventionContactsState);
  private nextContactId = 3;
  readonly contacts = signal<readonly LossPreventionContact[]>([
    { id: 1, firstName: 'Benjamin', lastName: 'Hammerton', email: 'benjamin.hammerton@something.com', office: '812-234-1233', cell: '812-234-1233', method: 'Office', notes: '' },
    { id: 2, firstName: 'Susie', lastName: 'Hammerton', email: 'susie.hammerton@something.com', office: '', cell: '812-234-1233', method: 'Cell', notes: '' },
  ]);
  readonly searchQuery = signal('');
  readonly activeContactTab = signal<ContactTab>('loss-prevention');
  readonly contactTabs: readonly { readonly id: ContactTab; readonly label: string }[] = [
    { id: 'loss-prevention', label: 'LP contacts' },
    { id: 'policy', label: 'Policy contacts' },
    { id: 'locations', label: 'Locations' },
  ];
  readonly policyContacts: readonly DirectoryItem[] = [
    { id: 1, title: 'Robert Hollins', meta: 'Policy consultant', phone: '812-555-0196', email: 'robert.hollins@something.com' },
    { id: 2, title: 'Sonya Burgess', meta: 'Underwriter', phone: '812-555-0167', email: 'sonya.burgess@something.com' },
  ];
  readonly locations: readonly DirectoryItem[] = [
    { id: 1, title: 'Berkun-Air headquarters', meta: 'Indianapolis, IN', phone: '812-234-1233' },
    { id: 2, title: 'Berkun-Air warehouse', meta: 'Carmel, IN', phone: '812-234-1288' },
  ];
  readonly filteredContacts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.contacts();
    return this.contacts().filter((contact) => [contact.firstName, contact.lastName, contact.email, contact.office, contact.cell, contact.method].some((value) => value.toLowerCase().includes(query)));
  });
  readonly filteredDirectoryItems = computed(() => {
    const items = this.activeContactTab() === 'policy' ? this.policyContacts : this.locations;
    const query = this.searchQuery().trim().toLowerCase();
    return query ? items.filter((item) => [item.title, item.meta, item.phone ?? '', item.email ?? ''].some((value) => value.toLowerCase().includes(query))) : items;
  });
  readonly draft = signal<LossPreventionContact>({ ...EMPTY_CONTACT });
  readonly mode = signal<ContactMode>('idle');
  readonly statusMessage = signal('');
  readonly selectedContact = computed(() => this.contacts().find((contact) => contact.id === this.draft().id));
  readonly contactSelected = output<string>();
  readonly isSelectingContact = signal(false);

  private readonly openFromSidebar = effect(() => {
    if (!this.contactsState.openRequested()) return;
    this.openContacts();
    this.contactsState.clearOpenRequest();
  });

  openContacts(selectForVisit = false): void {
    this.mode.set('idle');
    this.searchQuery.set('');
    this.statusMessage.set('');
    this.isSelectingContact.set(selectForVisit);
    this.contactsDialog().nativeElement.showModal();
  }

  closeContacts(): void { this.isSelectingContact.set(false); this.contactsDialog().nativeElement.close(); }

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

  switchContactTab(value: string | number | undefined): void {
    if (!this.contactTabs.some((tab) => tab.id === value)) return;
    this.activeContactTab.set(value as ContactTab);
    this.searchQuery.set('');
    this.mode.set('idle');
  }

  updateMethod(method: LossPreventionContact['method']): void { this.draft.update((contact) => ({ ...contact, method })); }

  chooseOrEditContact(contact: LossPreventionContact): void {
    if (this.isSelectingContact()) {
      this.contactSelected.emit(`${contact.firstName} ${contact.lastName}`);
      this.closeContacts();
      return;
    }
    this.editContact(contact);
  }

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
