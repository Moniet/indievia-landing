import GlobalFooter from "@/components/Footer";
import Layout from "@/components/Layout";
import { ProfileNav } from "@/components/ProfileNav";

export const Loading = () => {
  return (
    <>
      <Layout>
        <ProfileNav />
        <div className="space-y-20 max-w-[750px] mx-auto">
          <div className="w-full h-full">
            <div className="flex w-full flex-col md:flex-row text-white justify-between gap-10 animate-pulse">
              <div className="bg-white/10 rounded-[20px] h-fit p-2 flex flex-col items-center">
                <div className="rounded-[18px] aspect-square w-[180px] md:w-[250px] h-[180px] md:h-[250px] bg-neutral-700/60" />
                <div className="flex items-center py-3 justify-center gap-3">
                  <div className="h-3 w-24 rounded bg-neutral-700/50" />
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-0 space-y-4">
                {/* Early Supporter pill skeleton */}
                <div className="w-[180px] h-7 bg-neutral-800/50 rounded-[50px]" />
                <div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-6 w-40 bg-neutral-700/60 rounded" />
                    <div className="size-5 bg-sky-800/70 rounded-full" />
                  </div>
                  <div className="h-4 w-48 mt-2 bg-neutral-700/40 rounded" />
                </div>
                <div className="max-w-[500px] space-y-3 mt-5">
                  <div className="h-4 w-full bg-neutral-700/40 rounded" />
                  <div className="h-4 w-2/3 bg-neutral-700/30 rounded" />
                </div>
                <div className="flex justify-between mt-5 items-center">
                  <div className="flex items-center gap-2">
                    <div className="size-4 bg-neutral-700/50 rounded-full" />
                    <div className="h-3 w-24 bg-neutral-700/30 rounded" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-6 bg-neutral-700/40 rounded-full" />
                    <div className="size-6 bg-neutral-700/40 rounded-full" />
                    <div className="size-6 bg-neutral-700/40 rounded-full" />
                    <div className="size-6 bg-neutral-700/40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="space-y-3">
              <div className="h-4 w-40 bg-neutral-700/40 rounded" />
              <div className="h-6 w-48 bg-neutral-700/30 rounded" />

              <div>
                <div className="w-full rounded-full h-3 bg-neutral-700/20 relative ">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-600/40 to-neutral-700/60 rounded-full animate-pulse"
                    style={{ width: "67%" }}
                  />
                  <div className="flex justify-evenly w-full items-center absolute top-0 left-0 pointer-events-none">
                    <div className="size-5 rounded-full bg-white/80 -translate-y-1" />
                    <div className="size-5 rounded-full bg-white/80 -translate-y-1" />
                  </div>
                </div>
                <div className="w-full flex flex-col xs:flex-row justify-between items-center mt-2 gap-2 xs:gap-0">
                  <div className="h-4 w-16 bg-neutral-700/40 rounded" />
                  <div className="h-4 w-40 bg-neutral-700/30 rounded" />
                </div>
              </div>
            </div>
          </div>
          {/* Reviews Skeleton Section */}
          <div>
            <div className="h-4 w-48 bg-neutral-700/40 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="size-12 rounded-full bg-neutral-700/30" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-neutral-700/40 rounded" />
                    <div className="h-3 w-48 bg-neutral-700/30 rounded" />
                    <div className="h-3 w-4/5 bg-neutral-700/20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Artists Skeleton Section */}
          <div className="w-full mt-10">
            <div className="h-7 w-44 bg-neutral-700/40 rounded mb-6" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-full flex flex-col animate-pulse"
                >
                  <div className="w-full h-full relative">
                    <div className="w-full min-h-[300px] aspect-[0.9] bg-neutral-800/40 rounded-lg" />
                    <div className="absolute top-3 left-3 bg-white/10 rounded-full p-2 flex gap-2 items-center text-xs">
                      <div className="size-5 bg-neutral-700/30 rounded-full" />
                      <div className="h-4 w-20 bg-neutral-700/30 rounded" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-20 bg-neutral-700/40 rounded" />
                      <div className="flex items-center gap-2">
                        <div className="size-4 bg-yellow-400/80 rounded-full" />
                        <div className="h-3 w-8 bg-neutral-700/30 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-12 bg-brand/20 rounded" />
                      <div className="h-3 w-28 bg-neutral-700/20 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
      <GlobalFooter />
    </>
  );
};
