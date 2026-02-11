export interface TrustStat {
  id: string;
  value: string;
  label: string;
}

export interface TrustSignalsProps {
  title?: string;
  stats: TrustStat[];
  className?: string;
}
