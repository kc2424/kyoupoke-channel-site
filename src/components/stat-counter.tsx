export function StatCounter({ value, suffix = "", decimals = 0, className }: {
  value: number; suffix?: string; decimals?: number; className?: string;
}) {
  return <span className={className}>{value.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  })}{suffix}</span>;
}
