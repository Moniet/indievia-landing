import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Facebook,
  Instagram,
  LucideAward,
  LucideFacebook,
  MapPin,
  Pin,
  Star,
  Trophy,
  Twitter,
  YoutubeIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { badges } from "../ProfessionalDashboard/Referrals/Referrals";
import { ProfessionalProfilePublicData } from "@/hooks/use-professional-profile-public";
import RatingStars from "@/components/RatingStars";

const Badge = ({ name = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current.animate(
      [
        {
          left: "0%",
          top: 0,
          offset: 0,
          easing: "ease-in",
        },
        {
          left: "85%",
          top: 0,
          offset: 0.4,
        },
        {
          left: "85%",
          top: "90%",
          offset: 0.5,
        },
        {
          left: "-10%",
          top: "80%",
          offset: 0.8,
        },
        {
          left: "-10%",
          top: "0%",
          offset: 0.9,
          easing: "ease-out",
        },
        {
          left: "0%",
          top: "0%",
          offset: 1,
          easing: "ease-out",
        },
      ],
      {
        iterations: Infinity,
        duration: 4000,
      },
    );
  }, []);

  const title =
    badges.find((b) => b.name === name)?.title ||
    "Early supporter - Founding Year";

  return (
    <div className="rounded-[50px] w-fit h-fit p-[1px] relative overflow-hidden">
      <div
        className="w-[60px] h-[20px] bg-gradient-to-r from-transparent via-brand/80 to-transparent absolute top-0 left-0"
        ref={ref}
      />
      <div className="bg-neutral-800 relative z-2 flex text-xs font-light items-center py-2.5 px-4 rounded-[50px]">
        <Trophy className="size-4 mr-2" strokeWidth={1.5} />{" "}
        {name === "early_supporter" ? "Early Supporter - Founding Year" : title}
      </div>
      {/*<BorderBeam />*/}
    </div>
  );
};

type BasicInfoProps = {
  profileData?: ProfessionalProfilePublicData;
  isLoading?: boolean;
};

const BasicInfo = ({ profileData, isLoading }: BasicInfoProps) => {
  const badge = profileData?.badge;
  return (
    <div className="flex max-md:flex-col w-full text-white justify-center gap-8">
      <div className=" bg-white/10 flex items-center w-fit max-md:h-fit flex-col rounded-[20px] p-2 relative">
        {!isLoading && (
          <img
            src={profileData?.profile_picture_url}
            alt="Sample user"
            className="rounded-[18px] aspect-video w-[450px] h-[280px] object-cover"
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        )}
        {isLoading && (
          <div className="animate-pulse  bg-white/10 rounded-[18px] max-sm:w-[88vw] max-sm:aspect-square aspect-video h-[280px] w-[450px]" />
        )}
        <div className="flex items-center py-3 justify-center gap-3">
          <RatingStars rating={Number(profileData?.reviews_metadata?.avg)} />
          <div className="text-sm flex gap-2 uppercase text-white/50 font-bold">
            {Number(profileData?.reviews_metadata?.avg || "0").toFixed(1)}{" "}
            <span>|</span> {profileData?.reviews_metadata?.count} reviews{" "}
          </div>
        </div>
      </div>
      <div className="max-w-[500px]">
        {profileData?.badge && <Badge name={profileData.badge} />}
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-2xl font-medium font-profile-header mt-4 flex items-center gap-2 ${
                badge === "5_referrals" ? "bg-anim" : ""
              }`}
            >
              {profileData?.full_name ||
                (isLoading ? (
                  <span className="animate-pulse bg-neutral-800 px-10 py-2 rounded w-[180px] inline-block" />
                ) : (
                  "Unknown User"
                ))}{" "}
              {profileData?.phone_verified && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <BadgeCheck className="size-6 text-blue-400 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>Phone number has been verified!</div>
                  </TooltipContent>
                </Tooltip>
              )}
            </h1>
            {badge === "5_referrals" && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button className="p-1 mt-4 ml-1 size-fit border rounded-full bg-yellow-500/80 border-yellow-500/50 cursor-pointer">
                    <LucideAward className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-normal font-profile-para">
                    Highly referred professional.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            {badge === "verified_og" && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button className=" cursor-pointer">
                    <img
                      src="/badge-verified-og.png"
                      className="size-10 object-contain translate-y-[13px] -translate-x-[5px]"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-normal font-profile-para">
                    Verified OG - Highly recommended professional!
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="font-bold font-profile-para text-xs text-white/50 uppercase mt-2">
            {profileData?.position ||
              (isLoading ? (
                <span className="animate-pulse bg-neutral-800 px-7 rounded" />
              ) : (
                "-"
              ))}
          </p>

          <div className="h-full">
            <div
              className={`${!isLoading ? "max-w-[500px]" : "sm:w-[300px] lg:w-[500px]"} space-y-3 mt-5 text-sm text-white/50 leading-6`}
            >
              <p className="font-profile-para text-sm  lg:text-base font-light">
                {profileData?.bio ||
                  (isLoading ? (
                    <span className="animate-pulse bg-neutral-800 px-10 rounded w-full h-[24px] inline-block" />
                  ) : (
                    "No bio provided."
                  ))}
              </p>
            </div>
            <div className="flex max-md:flex-col gap-5 justify-between max-md:mt-8 mt-5 ">
              <address className="flex items-center text-xs gap-1 text-white/50 font-extralight">
                {!isLoading && <MapPin className="size-3.5 rotate-[9deg]" />}
                {isLoading ? (
                  <span className="animate-pulse bg-neutral-800 px-5 rounded w-48" />
                ) : (
                  [
                    profileData?.street_address,
                    profileData?.city,
                    profileData.state,
                  ].join(", ")
                )}
              </address>
              <div className="flex items-center gap-5 text-white/60">
                {profileData?.facebook && (
                  <a
                    href={profileData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LucideFacebook className="size-5" />
                  </a>
                )}
                {profileData?.instagram && (
                  <a
                    href={profileData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="size-5" />
                  </a>
                )}
                {profileData?.twitter && (
                  <a
                    href={profileData.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="size-5" />
                  </a>
                )}
                {profileData?.youtube && (
                  <a
                    href={profileData.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YoutubeIcon className="size-5.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
