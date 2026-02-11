export const BEAT_PLAN_TABS = [
    { id: 'all', label: 'All' },
    { id: 'party', label: 'Parties' },
    { id: 'prospect', label: 'Prospects' },
    { id: 'site', label: 'Sites' },
] as const;

export type BeatPlanTabType = typeof BEAT_PLAN_TABS[number]['id'];
