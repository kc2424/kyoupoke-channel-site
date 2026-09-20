export function GiantTitle({ children }: { children: string }) {
  return (
    <h1 className="font-wordmark w-full text-center text-[clamp(2.5rem,12.8vw,9.5rem)] leading-none tracking-[-0.035em] drop-shadow-[2px_3px_0_rgba(90,30,10,0.12)] landscape-compact:text-[13vh]">
      <span className="bg-gradient-to-r from-brand via-brand-dark to-[#8f2d14] bg-clip-text text-transparent">{children}</span>
    </h1>
  );
}
