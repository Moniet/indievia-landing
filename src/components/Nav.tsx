import { useProfile } from "@/hooks/use-profile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  Loader2,
  LucideUser,
  LucideArrowUpRightFromSquare,
  LucideBug,
  LucideMail,
  LucideSearch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUser from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Nav = () => {
  const location = useLocation();
  const isAbout = location.pathname.toLowerCase() == "/about";
  const { data: profile } = useProfile();
  const [{ user }] = useUser();
  const userRole = user?.data?.user?.user_metadata?.role;
  const [signingOut, setSigningOut] = useState(false);
  const nav = useNavigate();
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
    } finally {
      nav("/sign-in");
    }
  };

  return (
    <nav className="w-full h-[150px] flex items-center justify-between text-white">
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

      <div className="flex items-center gap-7 md:gap-10">
        <Link
          to="/"
          className={`font-light text-xs md:text-sm tracking-wide ${
            isAbout ? "opacity-50" : "opacity-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`font-light text-xs md:text-sm tracking-wide ${
            isAbout ? "opacity-100" : "opacity-50"
          }`}
        >
          About IndieVia
        </Link>
        {(!profile || profile.error) && (
          <Link
            to="/sign-in"
            className={`font-light text-xs md:text-sm tracking-wide ${
              isAbout ? "opacity-100" : "opacity-50"
            }`}
          >
            Sign in
          </Link>
        )}

        {profile && !profile.error && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-8 items-center justify-between">
                <div className="rounded-full bg-brand flex items-center justify-start w-fit py-[5px] px-[5px] pr-[5px]">
                  <Avatar className="size-[30px]">
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
                    <ChevronDown
                      className="text-white size-3"
                      strokeWidth={1.5}
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

export default Nav;
