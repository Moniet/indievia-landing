import { useState } from "react";
import { Copy, Info, Check, CheckCircle2 } from "lucide-react";
import BadgeProgress from "../BadgeProgress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Donut from "./Donut";
import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import { useRecentReferrals } from "@/hooks/use-referrals";
import ReferralsSkeleton from "./Skeleton/Skeleton";
import { useProfile } from "@/hooks/use-profile";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const BadgeDonut = ({
  src,
  progress,
  children,
}: {
  src: string;
  progress: number;
  children?: React.ReactNode;
}) => (
  <div className="rounded-full select-none bg-neutral-700 size-[60px] p-2 flex items-center justify-center relative">
    <img
      src={src}
      className="translate-y-[9px] w-full h-auto"
      alt=""
      style={{
        filter: `saturate(${progress})`,
        transition: "filter 0.35s cubic-bezier(.42,0,.58,1)",
      }}
    />
    <div className="absolute top-0 left-0">
      <Donut
        radius={30}
        strokeColor="stroke-[#EE714E]"
        progress={progress}
        stroke={2}
      />
    </div>
    {progress === 1 && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-fit h-fit rounded-full">
        <CheckCircle2 className="size-5 text-white fill-green-500" />
      </div>
    )}
    {children}
  </div>
);

export const badges = [
  {
    referrals: 3,
    name: "early_supporter",
    src: "/badge-founding-year.png",
    title: "Early supporter",
  },
  {
    referrals: 5,
    name: "5_referrals",
    src: "/badge-5-refs.png",
    title: "Golden Profile Name",
  },
  {
    referrals: 10,
    name: "10_referrals",
    src: "/badge-10-refs.png",
    title: "Front page showcase",
  },
  {
    referrals: 20,
    name: "verified_og",
    src: "/badge-verified-og.png",
    title: "Verified OG",
  },
];

const Referrals = () => {
  const [copied, setCopied] = useState(false);
  const [{ profileData }, profileIsLoading] = useProfessionalProfile();
  const { referrals = [], isLoading: referralsIsLoading } =
    useRecentReferrals();

  const isLoading = profileIsLoading || referralsIsLoading;

  const referralCode = profileData?.referral_code;
  const referralCount = profileData?.referral_count || 0;
  console.log({ profileData });

  const badgesWithProgress = badges.map((badge) => ({
    ...badge,
    progress: Math.min(1, referralCount / badge.referrals),
  }));

  const earnedBadges = badgesWithProgress.filter((b) => b.progress === 1);
  const currentBadge = earnedBadges.length
    ? earnedBadges[earnedBadges.length - 1]
    : null;

  const handleCopy = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // fallback or error handling can be placed here if needed
    }
  };

  if (isLoading) {
    return <ReferralsSkeleton />;
  }

  const formatRefDate = (createdAt: string | undefined) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
    }
  };

  return (
    <div className="size-full overflow-x-hidden">
      <div className="text-xl font-medium text-white">Referrals</div>
      <div className="mt-10" />
      <div className="p-4 sm:p-7 rounded-lg border border-white/5 bg-[#18181A]">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
          <div className="w-fit h-fit rounded-full bg-zinc-800 relative mx-auto sm:mx-0 mb-3 sm:mb-0">
            <BadgeDonut
              src={badgesWithProgress[0].src}
              progress={badgesWithProgress[0].progress}
            />
          </div>
          <BadgeProgress />
        </div>
        <div className="border-t mt-6 sm:mt-8 pt-4 sm:pt-6 border-zinc-800 w-full">
          <div className="w-fit">
            {referralCount < 20 && (
              <div className="text-white/70 max-md:hidden text-xs font-light mb-5 sm:mb-7 flex items-center">
                <Info className="size-4 mr-3" /> Invite{" "}
                {[3, 5, 10, 20].find((n) => n > referralCount) - referralCount}{" "}
                more people to reach your next milestone
              </div>
            )}
            <div className="bg-white/10 min-w-[250px] rounded-md pl-4 h-12 max-md:w-full flex items-center uppercase">
              <span>{referralCode}</span>
              <button
                className="rounded-md bg-[#F38B6F] size-9 mr-1.5 flex items-center justify-center ml-auto"
                aria-label="Copy referral code"
                type="button"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="size-4 text-white" />
                ) : (
                  <Copy className="size-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Responsive Flex: stack on mobile, row on lg+ */}
      <div className="flex flex-col lg:flex-row flex-1 w-full gap-5 lg:gap-7 items-stretch mt-7">
        <div className="flex flex-col gap-5 lg:gap-7 flex-1">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 w-full">
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A]">
              <div className="font-medium text-sm">No. badges earned</div>
              <div className="text-3xl font-medium">{earnedBadges.length}</div>
              <div className="text-sm text-white/50">
                Level {earnedBadges.length + 1}
              </div>
            </div>
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A] mt-4 sm:mt-0">
              <div className="font-medium text-sm">No. of referrals</div>
              <div className="text-3xl font-medium">{referralCount}</div>
              <div className="text-sm text-white/50">Referrals by you</div>
            </div>
          </div>
          <div className="border border-white/5 rounded-lg p-4 sm:p-5 bg-[#18181A] flex-1 flex flex-col">
            <div className="font-medium text-sm">Recently referrals</div>
            <div className="flex flex-col gap-5 mt-5 sm:mt-7 flex-1 max-h-full overflow-y-auto">
              {Array.isArray(referrals?.data) &&
                referrals?.data?.map((ref) => {
                  return (
                    <div
                      className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5"
                      key={ref?.email}
                    >
                      <div className="flex gap-3 w-full">
                        <div>
                          <div className="text-sm">
                            {ref.fullName || "*<No Name Found*"}
                          </div>
                          <div className="text-sm font-light">{ref.email}</div>
                        </div>
                      </div>
                      <div className="text-white text-sm whitespace-nowrap font-light text-white/70 mt-1 sm:mt-0">
                        {formatRefDate(ref.createdAt)}
                      </div>
                    </div>
                  );
                })}
              {!referrals?.data && (
                <div>
                  <Empty className="border bg-white/5">
                    <EmptyHeader>
                      <Info />
                      <EmptyTitle>No referrals found</EmptyTitle>
                      <EmptyDescription>
                        Share your referral code with customers and get featured
                        on our homepage.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-1 mt-5 lg:mt-0">
          <div className="border border-white/5 rounded-lg p-4 sm:p-5 bg-[#18181A] flex-1">
            <div className="flex flex-col sm:flex-row items-baseline w-full justify-between gap-3">
              <div className="text-lg">Badges</div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <div className="text-sm text-white/50 underline cursor-pointer">
                    How do I earn badges?
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[250px] text-center text-pretty">
                    Share your referral code. And for every few referrals,
                    you'll earn new badges!
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid mt-5 grid-cols-2 gap-6 sm:gap-10 pt-5">
              {badgesWithProgress.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <BadgeDonut src={badge.src} progress={badge.progress} />
                  <div className="font-medium text-sm">{badge.title}</div>
                  {badge.progress === 1 ? (
                    currentBadge?.name === badge.name ? (
                      <div className="text-sm text-purple-400">
                        Current Badge
                      </div>
                    ) : (
                      <div className="text-sm text-green-400">Earned</div>
                    )
                  ) : (
                    <div className="text-sm text-white/50">{`${badge.referrals} Referrals`}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
