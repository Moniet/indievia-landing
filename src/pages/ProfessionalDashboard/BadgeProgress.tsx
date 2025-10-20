import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import { badges } from "./Referrals/Referrals";

const BadgeProgress = () => {
  const [{ profileData }] = useProfessionalProfile();
  const refCount = profileData?.referral_count || 0;
  const progress = Math.min(1, refCount / 20) * 100;
  const refsRequiredForNextBadge = [3, 5, 10, 20].find((n) => n > refCount);
  const badge = badges.find((b) => b.name === profileData?.badge);
  return (
    <div className="w-full space-y-3">
      {badge && (
        <div className="text-sm font-light text-white/50">{badge?.title}</div>
      )}

      <div className="text-lg font-medium">{profileData?.full_name}</div>

      <div>
        <div className="w-full rounded-full h-3 bg-white/20 relative">
          <div
            className="rounded-full bg-gradient-to-r from-[#F59980] to-[#EB623C] h-full"
            style={{
              willChange: "width",
              transition: "width 0.3s ease",
              width: progress + 1 + "%",
            }}
          />
          <div className="grid grid-cols-4 w-full items-center absolute top-0 left-0 translate-x-1/4 -ml-2 -translate-y-1/4">
            <div className="size-5 rounded-full bg-white" />
            <div className="size-5 rounded-full bg-white" />
            <div className="size-5 rounded-full bg-white" />
            <div className="size-5 rounded-full bg-white" />
          </div>
        </div>
        <div className="w-full flex justify-between items-center mt-2">
          <span className="font-medium text-sm">Level 1</span>

          <div className="font-light text-sm">
            {!refsRequiredForNextBadge ? (
              "Hooray! you've won all the badges"
            ) : (
              <>
                Referrals required to reach next badge:{" "}
                <span className="font-medium text-brand">
                  {refsRequiredForNextBadge - refCount}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeProgress;
