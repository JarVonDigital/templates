export type DueMode = 'before' | 'on' | 'after' | 'range';

export interface TaskFilterValues {
  readonly status: string;
  readonly state: string;
  readonly consultant: string;
  readonly due: string;
  readonly dueMode: DueMode;
  readonly dueEnd: string;
  readonly county: string;
  readonly city: string;
  readonly zip: string;
  readonly premiumMin: string;
  readonly premiumMax: string;
  readonly taskId: string;
  readonly policy: string;
  readonly client: string;
  readonly lastVisit: string;
  readonly cancelled: string;
  readonly reason: string;
}

export interface SavedTaskFilter extends TaskFilterValues {
  readonly name: string;
}
