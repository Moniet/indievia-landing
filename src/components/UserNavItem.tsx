import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";
import { Button } from "./ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Notifications } from "./Notifications";

export const UserNavItem = ({ profile }) => {
  const [signingOut, setSigningOut] = useState(false);
  // const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const [{ user, refetch }] = useUser();
  const nav = useNavigate();
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut({ scope: "global" });
      await refetch();
    } finally {
      nav("/sign-in");
    }
  };

  const userRole = profile?.data?.profile?.role;

  if (!profile || profile?.error || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-7 md:gap-10">
      {profile && <Notifications />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-8 items-center justify-between">
            <div className="rounded-full bg-brand flex items-center justify-start w-fit p-[3px] md:p-[5px]">
              <Avatar className="size-[25px] md:size-[30px]">
                <AvatarImage
                  src={profile.data?.profile_picture_url || undefined}
                  alt={profile?.data?.full_name || "User avatar"}
                  className={
                    profile.data?.profile_picture_url ? "" : "animate-pulse"
                  }
                />
                <AvatarFallback>
                  {profile?.data?.full_name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center justify-center w-[30px]">
                <ChevronDown className="text-white size-3" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"center"}>
          <DropdownMenuItem asChild>
            <Link
              to={
                userRole === "professional"
                  ? "/professional/dashboard"
                  : userRole === "admin"
                    ? "/admin/dashboard"
                    : `/client/dashboard`
              }
            >
              <LucideUser className="size-4 mr-2" /> Dashboard
            </Link>
          </DropdownMenuItem>
          {profile?.data?.slug && (
            <DropdownMenuItem asChild>
              <Link to={"/professional/" + profile.data.slug}>
                <LucideArrowUpRightFromSquare className="size-4 mr-2" /> Public
                Profile
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link to="/" className="flex items-center">
              <LucideSearch className="size-4 mr-2" /> Search
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              className="w-full"
              onClick={() => {
                document.querySelector("footer")?.scrollIntoView();
              }}
            >
              <LucideMail className="size-4 mr-2" /> Contact
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:!bg-red-600"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <LucideArrowUpRightFromSquare className="size-4 mr-2" />
            )}{" "}
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
