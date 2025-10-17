import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Facebook,
  Instagram,
  LucideFacebook,
  MapPin,
  Pencil,
  Pin,
  Star,
  Trophy,
  Twitter,
  YoutubeIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { useClientProfile } from "@/hooks/use-client-profile";
import { useLocation, useParams } from "react-router-dom";
import useUser from "@/hooks/use-user";

export const EarlySupporterPill = ({ isSmall = false }) => {
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
          easing: "linear",
        },
        {
          left: "80%",
          top: "90%",
          offset: 0.5,
          easing: "linear",
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
        className={`w-[60px] h-[20px] bg-gradient-to-r from-transparent via-brand/80 to-transparent absolute top-0 left-0`}
        ref={ref}
      />
      <div
        className={`bg-neutral-800 relative z-2 flex  font-light items-center py-2.5 px-4 rounded-[50px] text-xs`}
      >
        <Trophy className="size-4 mr-2" strokeWidth={1.5} /> Early Supporter -
        Founding Year
      </div>
      {/*<BorderBeam />*/}
    </div>
  );
};

const BasicInfo = () => {
  const [editActive, setEditActive] = useState(false);
  const [{ profileData }] = useClientProfile();
  const [{ user }] = useUser();
  const { clientId } = useParams();
  const { pathname } = useLocation();
  const showEdit =
    pathname.includes("/client/dashboard") || user?.data?.user?.id === clientId;

  // Provide defaults to avoid undefined errors
  const fullName = profileData?.full_name || "Full Name";
  const profilePicture =
    profileData?.profile_picture_url ||
    "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHNob3R8ZW58MHwwfDB8fHww";
  const bio = profileData?.bio || "Bio not provided.";
  const position = profileData?.position || "Position not specified";
  const address = profileData?.address || "No address provided";
  const facebook = profileData?.facebook;
  const instagram = profileData?.instagram;
  const twitter = profileData?.twitter;
  const youtube = profileData?.youtube;

  return (
    <div>
      {showEdit && (
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-5 -mt-20 bg-zinc-900 border-zinc-800 hover:bg-brand/20 hover:text-brand hover:border-brand/20"
            onClick={() => setEditActive(true)}
          >
            <Pencil /> Edit Profile
          </Button>
        </div>
      )}

      {showEdit && (
        <EditProfileModal
          mode="editing"
          onClose={() => setEditActive(false)}
          open={editActive}
          defaultValues={profileData}
        />
      )}
      <div className="flex w-full text-white justify-between gap-10">
        <div className=" bg-white/10 rounded-[20px] h-fit p-2">
          <img
            src={profilePicture}
            alt={fullName}
            className="rounded-[18px] aspect-square w-[250px] h-fit object-cover"
          />
          <div className="flex items-center py-3 justify-center gap-3">
            <div className="text-sm text-white/50 font-bold">163 reviews</div>
          </div>
        </div>
        <div className="lg:w-[500px]">
          <EarlySupporterPill />
          <div>
            <h1 className="text-2xl font-medium font-profile-header mt-4 flex items-center gap-2">
              {fullName} <BadgeCheck className="text-sky-400" />
            </h1>
            <p className="font-bold font-profile-para text-xs text-white/50 uppercase mt-2">
              {position}
            </p>

            <div className="h-full">
              <div className="max-w-[500px] space-y-3 mt-5 text-sm text-white/50 leading-6">
                <p className="font-profile-para font-light">{bio}</p>
              </div>
              <div className="flex justify-between mt-5 ">
                <address className="flex items-center text-xs gap-1 text-white/50 font-extralight">
                  <MapPin className="size-3.5 rotate-[9deg]" />
                  {address}
                </address>
                <div className="flex items-center gap-5 text-white/60">
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LucideFacebook className="size-5" />
                    </a>
                  )}
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="size-5" />
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="size-5" />
                    </a>
                  )}
                  {youtube && (
                    <a href={youtube} target="_blank" rel="noopener noreferrer">
                      <YoutubeIcon className="size-5.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
