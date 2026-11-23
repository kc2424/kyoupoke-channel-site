export function HeroStickers({ subscribers, views }: { subscribers?: string; views?: string }) {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
    {subscribers && <span className="absolute top-[16%] left-[5%] -rotate-6 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white shadow-sm sm:text-sm">登録者{subscribers}</span>}
    {views && <span className="absolute right-[5%] top-[47%] rotate-6 rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-sm sm:top-auto sm:bottom-[30%] sm:text-sm">総再生{views}</span>}
    <span className="absolute top-[13%] right-[6%] rotate-6 rounded-full border-2 border-brand-dark bg-white px-4 py-2 text-xs font-bold text-brand-dark shadow-sm sm:text-sm">対戦ガチ勢3人組</span>
  </div>;
}
