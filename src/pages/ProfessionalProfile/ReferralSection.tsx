import { useState } from "react";
import { Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

type ReferralSectionProps = {
  referralCode: string;
  isLoading: boolean;
};

const ReferralSection = ({ referralCode, isLoading }: ReferralSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Optionally handle copy error
    }
  };

  return (
    <section>
      <div className="w-full flex-wrap bg-gradient-to-r from-white/10 to-[rgba(255,255,255,0.01)] p-4 sm:p-7 rounded-xl flex flex-col md:flex-row gap-6 justify-between  items-start md:items-center">
        <div className="flex flex-col gap-3 flex-1">
          <div className="font-profile-header text-xl text-white">
            Refer a friend
          </div>
          <p className="max-w-full sm:max-w-[500px] leading-6 font-profile-para text-pretty text-xs text-white/50">
            Invite your friends to join and enjoy exclusive perks together. When
            they sign up using your referral code, they’ll get a special welcome
            bonus — and you’ll earn rewards for every successful referral. It’s
            our way of saying thanks for spreading the word.
          </p>

          <div className="bg-white/10 mt-5 text-white flex items-center p-3 rounded-lg min-w-0 sm:min-w-[400px] max-w-full sm:max-w-[500px] justify-between">
            <div className="tracking-wide font-profile-para uppercase text-lg overflow-x-auto">
              {referralCode}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center outline-none"
              type="button"
              aria-label="Copy referral code"
              tabIndex={0}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
          <div className="h-0 overflow-visible -mt-1 ml-auto">
            {copied && <div className="text-xs">Copied!</div>}
          </div>
        </div>

        <div className="md:ml-10 max-md:hidden sm:mt-0 flex justify-start items-center w-full sm:w-auto">
          <QRCode
            value={`${globalThis?.window?.location?.origin}/sign-up?referralCode=${referralCode}`}
            className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] border"
          />
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
