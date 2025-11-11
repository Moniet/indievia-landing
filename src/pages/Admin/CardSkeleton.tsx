export const CardSkeleton = () => {
  return (
    <div className="rounded-xl w-full max-w-[750px] border border-white/5 bg-[#18181A] p-5 overflow-hidden animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-full bg-white/10"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between max-w-full">
            <div className="h-5 bg-white/10 rounded w-1/3"></div>
            <div className="h-5 bg-white/10 rounded w-24"></div>
          </div>
          <div className="space-y-2 w-2/3">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
          <div className="pt-2 flex justify-end items-center gap-2">
            <div className="h-8 w-24 bg-white/5 rounded-full"></div>
            <div className="h-8 w-20 bg-[#EE714E]/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
