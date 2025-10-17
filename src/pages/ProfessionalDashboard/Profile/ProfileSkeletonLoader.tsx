import React from "react";

// Simple skeleton utility component
const Skeleton = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse bg-white/10 rounded-md ${className}`}
    style={style}
  ></div>
);

const AvatarSkeleton = () => (
  <div className="relative">
    <Skeleton className="size-[100px] rounded-full bg-white/20" />
    <div className="absolute bottom-2 right-2">
      <Skeleton className="size-6 rounded-full bg-white/30" />
    </div>
  </div>
);

const BadgeDonutSkeleton = () => (
  <div className="rounded-full bg-neutral-800 size-[60px] flex items-center justify-center relative">
    <Skeleton className="w-[44px] h-[44px] rounded-full" />
    <div className="absolute top-0 left-0">
      <Skeleton className="w-[60px] h-[60px] rounded-full border-2 border-[#EE714E]/70" />
    </div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
      <Skeleton className="w-5 h-5 rounded-full bg-green-500/40" />
    </div>
  </div>
);

const GallerySkeleton = () => (
  <div className="flex mt-5 gap-4 max-w-full overflow-x-auto">
    <Skeleton className="size-48 rounded-lg border border-zinc-400 shrink-0" />
    {[1, 2, 3, 4].map((v) => (
      <Skeleton
        key={v}
        className="size-48 min-w-48 rounded-lg bg-white/5"
      />
    ))}
  </div>
);

const ProfileFormSkeleton = () => (
  <form className="space-y-10 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
    {[...Array(5)].map((_, i) => (
      <div key={i}>
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
    ))}
    <div>
      <Skeleton className="h-5 w-36 mb-2" />
      <Skeleton className="h-4 w-[178px] mb-5 mt-2" />
      <div className="gap-2 grid grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-5 w-24 mb-2" />
      <GallerySkeleton />
    </div>
    <div className="space-x-3 flex">
      <Skeleton className="px-8 h-10 w-28 rounded-md" />
      <Skeleton className="px-10 h-10 w-36 rounded-md" />
    </div>
  </form>
);

/**
 * Layout-matching skeleton loader for Professional Profile page.
 */
const ProfileSkeletonLoader: React.FC = () => (
  <div className="w-full h-full">
    {/* Header skeleton */}
    <div className="w-full relative flex flex-col lg:flex-row justify-between pt-20 px-4 lg:px-12 bg-gradient-to-b rounded-tl-lg rounded-tr-lg p-5 from-brand/40 via-brand/10 to-transparent">
      <div className="flex flex-row gap-6 items-center">
        <AvatarSkeleton />
        <div className="pl-0 lg:pl-5">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-7 w-52" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-8 lg:mt-0">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-4 w-52 mb-2" />
        <div className="flex gap-5 mt-2">
          {[1, 2, 3, 4].map((v) => (
            <BadgeDonutSkeleton key={v} />
          ))}
        </div>
      </div>
    </div>
    {/* Separator skeleton */}
    <div className="px-4 lg:px-12 flex-1 overflow-y-auto pb-20">
      <Skeleton className="h-[1px] w-full my-8" />
      <ProfileFormSkeleton />
    </div>
  </div>
);

export default ProfileSkeletonLoader;
