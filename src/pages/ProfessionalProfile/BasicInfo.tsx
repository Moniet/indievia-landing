import { motion } from "framer-motion";
import {
  BadgeCheck,
  Facebook,
  Instagram,
  LucideFacebook,
  MapPin,
  Pin,
  Star,
  Trophy,
  Twitter,
  YoutubeIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

const EarlySupporterPill = () => {
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

  return (
    <div className="rounded-[50px] w-fit h-fit p-[1px] relative overflow-hidden">
      <div
        className="w-[60px] h-[20px] bg-gradient-to-r from-transparent via-brand/80 to-transparent absolute top-0 left-0"
        ref={ref}
      />
      <div className="bg-neutral-800 relative z-2 flex text-xs font-light items-center py-2.5 px-4 rounded-[50px]">
        <Trophy className="size-4 mr-2" strokeWidth={1.5} /> Early Supporter -
        Founding Year
      </div>
      {/*<BorderBeam />*/}
    </div>
  );
};

type BasicInfoProps = {
  profileData?: {
    full_name: string;
    position: string;
    address: string;
    bio: string;
    profile_picture_url: string | null;
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    // Add other fields as needed
  };
  isLoading?: boolean;
};

const BasicInfo = ({ profileData, isLoading }: BasicInfoProps) => {
  return (
    <div className="flex w-full text-white justify-center gap-8">
      <div className=" bg-white/10 rounded-[20px] p-2">
        <img
          src={profileData?.profile_picture_url}
          alt="Sample user"
          className="rounded-[18px] aspect-video w-[450px] h-[280px] object-cover"
        />
        <div className="flex items-center py-3 justify-center gap-3">
          <div className="flex gap-1 ">
            <Star className="size-3 fill-brand stroke-brand" />
            <Star className="size-3 fill-brand stroke-brand" />
            <Star className="size-3 fill-brand stroke-brand" />
            <Star className="size-3 fill-brand stroke-brand" />
            <Star className="size-3 fill-brand stroke-brand" />
          </div>
          <div className="text-sm text-white/50 font-bold">
            4.5 | 100 reviews{" "}
          </div>
        </div>
      </div>
      <div className="">
        <EarlySupporterPill />
        <div>
          <h1 className="text-2xl font-medium font-profile-header mt-4 flex items-center gap-2">
            {profileData?.full_name ||
              (isLoading ? (
                <span className="animate-pulse bg-neutral-800 px-10 py-2 rounded w-[180px] inline-block" />
              ) : (
                "Unknown User"
              ))}{" "}
            <BadgeCheck className="text-sky-400" />
          </h1>
          <p className="font-bold font-profile-para text-xs text-white/50 uppercase mt-2">
            {profileData?.position ||
              (isLoading ? (
                <span className="animate-pulse bg-neutral-800 px-7 rounded" />
              ) : (
                "-"
              ))}
          </p>

          <div className="h-full">
            <div className="max-w-[500px] space-y-3 mt-5 text-sm text-white/50 leading-6">
              <p className="font-profile-para font-light">
                {profileData?.bio ||
                  (isLoading ? (
                    <span className="animate-pulse bg-neutral-800 px-10 rounded w-full h-[24px] inline-block" />
                  ) : (
                    "No bio provided."
                  ))}
              </p>
            </div>
            <div className="flex justify-between mt-5 ">
              <address className="flex items-center text-xs gap-1 text-white/50 font-extralight">
                <MapPin className="size-3.5 rotate-[9deg]" />
                {profileData?.address ||
                  (isLoading ? (
                    <span className="animate-pulse bg-neutral-800 px-5 rounded" />
                  ) : (
                    "-"
                  ))}
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
