export const BEAT_PLAN_TABS = [
    { id: 'all', label: 'All Stops' },
    { id: 'party', label: 'Parties' },
    { id: 'site', label: 'Sites' },
    { id: 'prospect', label: 'Prospects' },
] as const;

export type BeatPlanTabType = typeof BEAT_PLAN_TABS[number]['id'];
