import { useState } from "react";
import { Copy, Info, Check } from "lucide-react";
import BadgeProgress from "../BadgeProgress";
import Donut from "./Donut";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";

const Referrals = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "4ab-ab1-bbabs";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // fallback or error handling can be placed here if needed
    }
  };

  return (
    <div className="size-full">
      <div className="text-xl font-medium text-white">Referrals</div>

      <div className="mt-10" />
      <div className="p-7 rounded-lg border border-white/5 bg-[#18181A]">
        <div className="flex gap-7">
          <div className="w-fit h-fit rounded-full bg-zinc-800 relative">
            <Donut
              progress={0.8}
              strokeColor={"stroke-[#F38B6F]"}
              radius={40}
            />
            <img
              src="/badge-founding-year.png"
              className="w-14 h-auto absolute -translate-x-1/2 top-1/2 -translate-y-1/3 left-1/2"
            />
          </div>
          <BadgeProgress />
        </div>
        <div className="border-t mt-8 pt-6 border-zinc-800 w-full">
          <div className="w-fit">
            <div className="text-white/70 text-xs font-light mb-7 flex items-center">
              <Info className="size-4 mr-3" /> Invite 2 more people to reach
              your next milestone
            </div>
            <div className="bg-white/10 rounded-md pl-4  h-12 flex items-center uppercase">
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
      <div className="flex w-full gap-7 mt-7 items-stretch">
        <div className="flex flex-col gap-7 flex-1">
          <div className="flex gap-7 w-full">
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A]">
              <div className="font-medium text-sm">No. badges earned</div>
              <div className="text-3xl font-medium">1</div>
              <div className="text-sm text-white/50">Level 1</div>
            </div>
            <div className="flex-1 border border-white/5 rounded-lg px-5 py-3 space-y-2 bg-[#18181A]">
              <div className="font-medium text-sm">No. of referrals</div>
              <div className="text-3xl font-medium">3</div>
              <div className="text-sm text-white/50">Referrals by you</div>
            </div>
          </div>
          <div className="border border-white/5 rounded-lg p-5 bg-[#18181A] flex-1 flex flex-col">
            <div className="font-medium text-sm">Recently used referrals</div>
            <div className="text-sm text-white/50 font-light mt-1">
              3 referrals were used
            </div>
            <div className="flex flex-col gap-5 mt-7">
              <div className="flex items-center gap-5">
                <div className="flex gap-3 w-full">
                  <img
                    src=""
                    alt=""
                    className="bg-white/50 w-[40px] h-[40px] rounded-full"
                  />
                  <div>
                    <div className="text-sm">Olivia Rodriguez</div>
                    <div className="text-sm font-light">
                      olivia123@gmail.com
                    </div>
                  </div>
                </div>
                <div className="text-white text-sm">Today</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="border border-white/5 rounded-lg p-5 bg-[#18181A] flex-1">
            <div className="flex items-baseline w-full justify-between">
              <div className="text-lg">Badges</div>
              <div className="text-sm text-white/50 underline">
                How do I earn badges?
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
