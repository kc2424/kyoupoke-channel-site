export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`bg-brand font-logo inline-flex shrink-0 items-center justify-center rounded-full text-white ${className ?? "h-9 w-9 text-lg"}`}
    >
      今
    </span>
  );
}
