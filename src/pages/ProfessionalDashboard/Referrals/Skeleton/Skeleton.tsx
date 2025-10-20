import { Skeleton } from "@/components/ui/skeleton";

const ReferralsSkeleton = () => {
  return (
    <div className="size-full">
      <Skeleton className="h-6 w-32" />

      <div className="mt-10" />
      <div className="p-7 rounded-lg border border-white/5 bg-[#18181A]">
        <div className="flex gap-7">
          <Skeleton className="size-[60px] rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="border-t mt-8 pt-6 border-zinc-800 w-full">
          <div className="w-fit">
            <Skeleton className="h-12 w-64" />
          </div>
        </div>
      </div>
      <div className="flex w-full gap-7 mt-7 items-stretch">
        <div className="flex flex-col gap-7 flex-1">
          <div className="flex gap-7 w-full">
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A]">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A]">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <div className="border border-white/5 rounded-lg p-5 bg-[#18181A] flex-1 flex flex-col">
            <Skeleton className="h-5 w-1/3" />
            <div className="flex flex-col gap-5 mt-7 flex-1">
              {[...Array(3)].map((_, i) => (
                <div className="flex items-center gap-5" key={i}>
                  <div className="flex gap-3 w-full">
                    <Skeleton className="w-[40px] h-[40px] rounded-full" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="border border-white/5 rounded-lg p-5 bg-[#18181A] flex-1">
            <div className="flex items-baseline w-full justify-between">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 pt-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <Skeleton className="size-[60px] rounded-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsSkeleton;
