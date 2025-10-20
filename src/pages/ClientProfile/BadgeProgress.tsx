const BadgeProgress = ({
  fullName,
  totalReferrals = 0,
  currentBadge = "",
}: {
  currentBadge: string;
  totalReferrals: number;
  fullName: string;
}) => {
  const progress = Math.min(1, (totalReferrals || 0) / 3) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="text-sm text-white/50">{currentBadge || ""}</div>

      <div className="text-lg font-medium">{fullName || "Name not found"}</div>

      <div>
        <div className="w-full rounded-full h-3 bg-white/20 relative">
          <div
            className="rounded-full bg-gradient-to-r from-[#F59980] to-[#EB623C] h-full"
            style={{
              willChange: "width",
              transition: "width 0.3s ease",
              width: (progress || 0) + "%",
            }}
          />
          <div className="flex justify-between w-full items-center absolute top-0 left-0 -translate-y-1/4">
            {/*<div />*/}
            <div className="size-5 rounded-full bg-white " />
            <div className="size-5 rounded-full bg-white" />
          </div>
          <div className="flex justify-between w-full items-center absolute top-0 -translate-y-full -mt-3">
            <div />
            <img
              className="w-14 translate-x-1/3 pointer-events-none select-none"
              src="/badge-founding-year.png"
            />
            {/*<img
              src="/badge-3-refs.png"
              className={`w-14 pointer-events-none select-none -translate-x-1/2 ${totalReferrals < 3 ? `saturate-0` : ``}`}
            />*/}
          </div>
        </div>
        <div className="w-full flex justify-between items-center mt-2">
          <span className="font-medium text-sm">Level 1</span>

          <div className="font-light text-sm">
            Referrals required to reach next badge:{" "}
            <span className="font-medium text-brand">
              {totalReferrals >= 3 ? 0 : 3 - totalReferrals}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeProgress;
