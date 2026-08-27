import { Injectable } from '@angular/core';
import claimsTestData from '../../../../claims-test-data.json';

export interface PolicyProfile {
  readonly id: string;
  readonly name: string;
  readonly policyNumber: string;
  readonly status: 'Active' | 'Cancelled';
}

export interface ClaimKey {
  readonly fund: string;
  readonly member: number;
  readonly subCode: number;
  readonly fundYear: number;
  readonly claimNumber: number;
  readonly sequence: string;
  readonly monthEndPeriod: number;
}

export interface ClaimRecord {
  readonly claimId: string;
  readonly policyId: string;
  readonly claimKey: ClaimKey;
  readonly policyPeriod: { readonly start: string; readonly end: string };
  readonly iwName: string;
  readonly status: 'Open' | 'Closed';
  readonly dateOfInjury: string;
  readonly totalIncurred: number;
}

export interface PolicyTaskRecord {
  readonly id: string;
  readonly policyId: string;
  readonly policyNumber: string;
  readonly client: string;
  readonly status: string;
}

const DEMO_POLICY: PolicyProfile = {
  id: '0190-00765',
  name: 'Berkun-Air, Inc.',
  policyNumber: '0190-00765',
  status: 'Active',
};

const CLAIM_INPUT = claimsTestData as readonly Omit<ClaimRecord, 'claimId' | 'policyId'>[];

const CLAIMS: readonly ClaimRecord[] = CLAIM_INPUT.map((claim) => ({
  ...claim,
  claimId: String(claim.claimKey.claimNumber),
  policyId: DEMO_POLICY.id,
}));

const POLICY_TASKS: readonly PolicyTaskRecord[] = [
  { id: '800001', policyId: DEMO_POLICY.id, policyNumber: DEMO_POLICY.policyNumber, client: DEMO_POLICY.name, status: 'Pending' },
  { id: '800002', policyId: DEMO_POLICY.id, policyNumber: DEMO_POLICY.policyNumber, client: DEMO_POLICY.name, status: 'Pending' },
  { id: '800003', policyId: DEMO_POLICY.id, policyNumber: DEMO_POLICY.policyNumber, client: DEMO_POLICY.name, status: 'Scheduled' },
];

@Injectable({ providedIn: 'root' })
export class WorkspaceData {
  readonly demoPolicy = DEMO_POLICY;
  readonly claims = CLAIMS;
  readonly policyTasks = POLICY_TASKS;

  policyFor(id: string | null | undefined): PolicyProfile {
    return id === DEMO_POLICY.id ? DEMO_POLICY : { ...DEMO_POLICY, id: id ?? DEMO_POLICY.id, policyNumber: id ?? DEMO_POLICY.policyNumber };
  }

  claimFor(claimId: string | null | undefined): ClaimRecord | undefined {
    return this.claims.find((claim) => claim.claimId === claimId);
  }

  tasksForPolicy(policyId: string | null | undefined): readonly PolicyTaskRecord[] {
    return this.policyTasks.filter((task) => !policyId || task.policyId === policyId);
  }

  policyForTask(taskId: string | null | undefined): PolicyProfile {
    return this.policyFor(this.policyTasks.find((task) => task.id === taskId)?.policyId ?? DEMO_POLICY.id);
  }
}
