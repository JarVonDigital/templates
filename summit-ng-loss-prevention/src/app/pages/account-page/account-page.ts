import { Component, input, signal } from '@angular/core';
import { Menu } from '@openng/optimus-ui/menu';
import { MenuItem } from '@openng/optimus-ui/api';
import { Badge } from '@openng/optimus-ui/badge';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { Card } from '@openng/optimus-ui/card';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@openng/optimus-ui/tabs';
import { TableModule } from '@openng/optimus-ui/table';
import {
  LucideBuilding2,
  LucideCalendarDays,
  LucideCircleDollarSign,
  LucideExternalLink,
  LucideGrid2X2,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucidePrinter,
  LucideShieldCheck,
} from '@lucide/angular';

export interface AccountProfile {
  readonly cancelDate: string;
  readonly legalNature: string;
  readonly mailingAddress: readonly string[];
  readonly name: string;
  readonly phoneNumber: string;
  readonly physicalAddress: readonly string[];
  readonly policyNumber: string;
  readonly policyPeriod: string;
  readonly riskId: string;
  readonly stateWritten: string;
  readonly fein: string;
  readonly faxNumber: string;
}

export interface AgencyProfile {
  readonly name: string;
  readonly number: string;
  readonly contactName: string;
  readonly contactNumber: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly physicalAddress: readonly string[];
  readonly mailingAddress: readonly string[];
}

export interface PremiumProfile {
  readonly total: string;
  readonly paymentSchedule: string;
  readonly plan: string;
  readonly additionalItems: readonly string[];
  readonly experienceModificationRate: string;
  readonly experienceModificationEffectiveDate: string;
}

export interface Workplace {
  readonly name: string;
  readonly address: readonly string[];
  readonly effectiveDate: string;
  readonly cancellationDate: string;
  readonly fein: string;
}

export interface PayrollClassification {
  readonly workCode: string;
  readonly classification: string;
  readonly rate: string;
  readonly startDate: string;
  readonly stopDate: string;
  readonly estimatedPayroll: string;
  readonly auditedPayroll: string;
}

export interface Officer {
  readonly name: string;
  readonly title: string;
  readonly startDate: string;
  readonly stopDate: string;
}

export interface Owner extends Officer {
  readonly ownership: string;
}

export interface PolicyContact {
  readonly name: string;
  readonly email: string;
  readonly contactType: string;
  readonly startDate: string;
  readonly stopDate: string;
}

export interface WebUser {
  readonly name: string;
  readonly email: string;
  readonly cellPhone: string;
}

export interface InclusionStatus {
  readonly entityName: string;
  readonly fein: string;
  readonly officers: OfficerInclusion[];
}

export interface OfficerInclusion extends Officer {
  readonly state: string;
  readonly status: string;
}

type AccountTab = 'policy' | 'agency' | 'premium' | 'workplaces' | 'payroll' | 'contacts' | 'inclusions';

const DEFAULT_ACCOUNT: AccountProfile = {
  name: 'Berkun-Air, Inc.',
  policyNumber: '0190-00765',
  policyPeriod: '05/01/2026 – 05/01/2027',
  stateWritten: 'North Carolina · Single State',
  cancelDate: 'Not cancelled',
  physicalAddress: ['54 Main Rd', 'Asheville, NC 28806'],
  mailingAddress: ['54 Main Rd', 'Asheville, NC 28806'],
  phoneNumber: '(828) 555-0184',
  faxNumber: '(828) 555-0185',
  legalNature: 'Corporation',
  fein: '12-3456789',
  riskId: '800001',
};

const DEFAULT_AGENCY: AgencyProfile = {
  name: 'Blue Ridge Risk Partners',
  number: '7596',
  contactName: 'Morgan Hale',
  contactNumber: '14549',
  email: 'morgan.hale@example.test',
  phoneNumber: '(828) 555-0138',
  physicalAddress: ['1201 Town Park Ln', 'Asheville, NC 28801'],
  mailingAddress: ['PO Box 812', 'Asheville, NC 28802'],
};

const DEFAULT_PREMIUM: PremiumProfile = {
  total: '$7,248.00',
  paymentSchedule: 'Monthly',
  plan: 'Guaranteed cost',
  additionalItems: ['Drug-free workplace credit', 'Increased employer liability'],
  experienceModificationRate: '0.91',
  experienceModificationEffectiveDate: '05/01/2026',
};

const DEFAULT_WORKPLACES: Workplace[] = [
  {
    name: 'Berkun-Air, Inc. · Asheville office',
    address: ['54 Main Rd', 'Asheville, NC 28806'],
    effectiveDate: '05/01/2026',
    cancellationDate: 'Not cancelled',
    fein: '12-3456789',
  },
];

const DEFAULT_PAYROLL: PayrollClassification[] = [
  { workCode: '5183', classification: 'Plumbing - NOC & drivers', rate: '0.0462', startDate: '05/01/2026', stopDate: '—', estimatedPayroll: '$82,000', auditedPayroll: '$0' },
  { workCode: '5537', classification: 'HVAC installation, service & repair', rate: '0.0529', startDate: '05/01/2026', stopDate: '—', estimatedPayroll: '$146,000', auditedPayroll: '$0' },
  { workCode: '8810', classification: 'Clerical office employees - NOC', rate: '0.0017', startDate: '05/01/2026', stopDate: '—', estimatedPayroll: '$64,000', auditedPayroll: '$0' },
];

const DEFAULT_OFFICERS: Officer[] = [
  { name: 'Jordan Park', title: 'President', startDate: '06/01/2020', stopDate: '—' },
];

const DEFAULT_OWNERS: Owner[] = [
  { name: 'Jordan Park', title: 'President', startDate: '06/01/2020', stopDate: '—', ownership: '100%' },
];

const DEFAULT_CONTACTS: PolicyContact[] = [
  { name: 'Avery Brooks', email: 'avery.brooks@example.test', contactType: 'Billing', startDate: '05/01/2026', stopDate: '—' },
  { name: 'Jordan Park', email: 'jordan.park@example.test', contactType: 'Principal', startDate: '06/01/2020', stopDate: '—' },
];

const DEFAULT_WEB_USERS: WebUser[] = [
  { name: 'Avery Brooks', email: 'avery.brooks@example.test', cellPhone: '(828) 555-0128' },
];

const DEFAULT_INCLUSION: InclusionStatus = {
  entityName: 'Berkun-Air, Inc.',
  fein: '12-3456789',
  officers: [{ name: 'Jordan Park', title: 'President', state: 'NC', startDate: '06/01/2020', stopDate: '—', status: 'Included' }],
};

@Component({
  selector: 'app-account-page',
  imports: [Badge, ButtonDirective, Card, Menu, TableModule, Tab, TabList, TabPanel, TabPanels, Tabs, LucideBuilding2, LucideCalendarDays, LucideCircleDollarSign, LucideExternalLink, LucideGrid2X2, LucideMail, LucideMapPin, LucidePhone, LucidePrinter, LucideShieldCheck],
  templateUrl: './account-page.html',
  styleUrl: './account-page.scss',
})
export class AccountPage {
  readonly account = input<AccountProfile>(DEFAULT_ACCOUNT);
  readonly agency = input<AgencyProfile>(DEFAULT_AGENCY);
  readonly premium = input<PremiumProfile>(DEFAULT_PREMIUM);
  readonly workplaces = input<Workplace[]>(DEFAULT_WORKPLACES);
  readonly payroll = input<PayrollClassification[]>(DEFAULT_PAYROLL);
  readonly officers = input<Officer[]>(DEFAULT_OFFICERS);
  readonly owners = input<Owner[]>(DEFAULT_OWNERS);
  readonly contacts = input<PolicyContact[]>(DEFAULT_CONTACTS);
  readonly webUsers = input<WebUser[]>(DEFAULT_WEB_USERS);
  readonly inclusion = input<InclusionStatus>(DEFAULT_INCLUSION);
  readonly activeTab = signal<AccountTab>('policy');
  readonly tabs: readonly { readonly label: string; readonly value: AccountTab }[] = [
    { label: 'Policy', value: 'policy' },
    { label: 'Agency', value: 'agency' },
    { label: 'Premium', value: 'premium' },
    { label: 'Workplaces', value: 'workplaces' },
    { label: 'Payroll', value: 'payroll' },
    { label: 'Contacts & officers', value: 'contacts' },
    { label: 'Inclusions & exclusions', value: 'inclusions' },
  ];
  readonly applications: MenuItem[] = [
    { label: 'View policy' },
    { label: 'Claims search' },
    { label: 'Policy change request' },
    { label: 'View policy documents' },
    { label: 'Request physician panels' },
    { label: 'Manage COI / waivers' },
    { label: 'Monthly payroll reporting' },
    { label: 'Make a payment' },
    { label: 'Billing' },
    { label: 'Audit details online' },
  ];

  setActiveTab(value: string | number | undefined): void {
    if (this.tabs.some((tab) => tab.value === value)) this.activeTab.set(value as AccountTab);
  }

  print(): void {
    if (typeof window !== 'undefined') window.print();
  }
}
