import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Loader2,
  LucideArrowUpRightFromSquare,
  LucideBug,
  LucideMail,
  LucideSearch,
  LucideUser,
} from "lucide-react";
import useUser from "@/hooks/use-user";
import { useStore } from "@/hooks/use-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useProfile } from "@/hooks/use-profile";

export const ProfileNav = () => {
  const [{ user }, isLoadingUser] = useUser();
  const userRole = user?.data?.user?.user_metadata?.role;
  const profileUrl = useStore((s) => s.userProfileUrl);
  const fullName = useStore((s) => s.fullName);
  const [signingOut, setSigningOut] = useState(false);
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useProfile();
  const nav = useNavigate();
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
    } finally {
      nav("/sign-in");
    }
  };

  const isProfessional = profile?.data?.role === "professional";

  return (
    <nav
      id="profile-nav"
      aria-label="Main Navigation"
      className="flex items-center justify-between max-sm:py-10 sm:h-[100px] lg:h-[150px]"
    >
      <Link to="/">
        <h1 className="flex items-center">
          <img
            src="/indievia-text-logo.png"
            className="w-[80px] md:w-[100px] h-auto mb-1"
          />
          <span className="opacity-0 w-0 h-0 absolute top-0 -left-[1000]">
            Indie-Via
          </span>
        </h1>
      </Link>
      <div className="flex items-center gap-10">
        {isProfessional && <Bell className="size-5 text-white" />}
        {profile && !profileError && !profile?.error && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-8 items-center justify-between">
                <div className="rounded-full bg-brand flex items-center justify-start w-fit py-[5px] px-[5px] pr-[5px]">
                  <Avatar className="size-[30px]">
                    <AvatarImage
                      src={profileUrl || undefined}
                      alt={fullName || "User avatar"}
                      className={profileUrl ? "" : "animate-pulse"}
                    />
                    <AvatarFallback>
                      {fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex items-center justify-center w-[30px]">
                    <ChevronDown
                      className="text-white size-4"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"center"}>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    userRole === "client"
                      ? `/client/dashboard`
                      : "/professional/dashboard"
                  }
                >
                  <LucideUser className="size-4 mr-2" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideSearch className="size-4 mr-2" /> Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideMail className="size-4 mr-2" /> Contact
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideBug className="size-4 mr-2" /> Report Bugs
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:!bg-red-600"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LucideArrowUpRightFromSquare className="size-4 mr-2" />
                )}{" "}
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};
