import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideBriefcaseBusiness, LucideCalendarDays, LucideCircleDollarSign, LucideShieldCheck } from '@lucide/angular';
import { WorkspaceData } from '../../shared/workspace-data/workspace-data';

@Component({
  selector: 'app-claim-detail-page',
  imports: [CurrencyPipe, LucideBriefcaseBusiness, LucideCalendarDays, LucideCircleDollarSign, LucideShieldCheck],
  templateUrl: './claim-detail-page.html',
  styleUrl: './claim-detail-page.scss',
})
export class ClaimDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceData = inject(WorkspaceData);
  readonly claimId = toSignal(this.route.paramMap.pipe(map((params) => params.get('claimId'))), { initialValue: this.route.snapshot.paramMap.get('claimId') });
  readonly policyId = toSignal(this.route.parent?.paramMap.pipe(map((params) => params.get('policyId'))) ?? this.route.paramMap.pipe(map(() => null)), { initialValue: this.route.parent?.snapshot.paramMap.get('policyId') ?? null });
  readonly claim = computed(() => this.workspaceData.claimFor(this.claimId()));
  readonly policy = computed(() => this.workspaceData.policyFor(this.policyId()));
}
