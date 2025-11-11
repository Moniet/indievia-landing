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
import { UserNavItem } from "./UserNavItem";

export const ProfileNav = () => {
  const [{ user }, isLoadingUser] = useUser();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useProfile();

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
      <UserNavItem profile={profile} />
    </nav>
  );
};
