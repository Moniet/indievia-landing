const BadgeProgress = () => {
  const progress = 67;
  return (
    <div className="w-full space-y-3">
      <div className="text-sm font-light text-white/50">
        Early supporter - Founding Year
      </div>

      <div className="text-lg font-medium">Lena Herrera</div>

      <div>
        <div className="w-full rounded-full h-3 bg-white/20 relative">
          <div
            className="rounded-full bg-gradient-to-r from-[#F59980] to-[#EB623C] h-full"
            style={{
              willChange: "width",
              transition: "width 0.3s ease",
              width: progress + "%",
            }}
          />
          <div className="flex justify-evenly w-full items-center absolute top-0 left-0 -translate-y-1/4">
            <div className="size-5 rounded-full bg-white" />
            <div className="size-5 rounded-full bg-white" />
          </div>
        </div>
        <div className="w-full flex justify-between items-center mt-2">
          <span className="font-medium text-sm">Level 1</span>

          <div className="font-light text-sm">
            Referrals required to reach next badge:{" "}
            <span className="font-medium text-brand">2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeProgress;
