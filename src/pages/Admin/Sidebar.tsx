import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import useUser from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Bug,
  HandHeart,
  Inbox,
  LogOut,
  Plus,
  ShieldEllipsis,
  Sidebar,
} from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = ({
  isLoadingAdmin = true,
}: {
  isLoadingAdmin?: boolean;
}) => {
  const loc = useLocation();
  const page = loc.pathname.split("/").at(-1);
  const [{ profileData }, isLoading] = useProfessionalProfile();
  const [{ user }] = useUser();
  const nav = useNavigate();
  const randomNum = useMemo(() => Math.random(), []);

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "global" });
    nav("/");
  };

  const profileCompletion = [
    profileData?.full_name,
    profileData?.bio,
    profileData?.email,
    profileData?.profile_picture_url,
    profileData?.slug,
    profileData?.address,
    !!profileData?.gallery,
  ];
  const profileCompletionProgress =
    profileCompletion.filter(Boolean).length / profileCompletion.length;

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  useLayoutEffect(() => {
    const trackWidth = () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (!mobile) {
          setIsOpen(false);
        }
      }, 100);
    };

    trackWidth();
    window.addEventListener("resize", trackWidth);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed md:hidden top-0 left-0 size-full bg-zinc-900/50 backdrop-blur-sm" />
      )}
      <div
        className={`
        md:w-[300px] lg:w-[400px] [transition:flex_1s_ease] overflow-hidden flex-grow-0 h-screen p-3 flex flex-col md:p-5 pb-20
        max-md:fixed max-md:w-full max-md:h-full max-md:z-[1000]
        ${isOpen && isMobile ? "max-md:pointer-events-auto" : "max-md:pointer-events-none"}
        ${isLoadingAdmin ? "blur-sm" : "blur-0"}
      `}
      >
        <motion.div
          className="px-7 pt-8 pb-8 bg-[#0F0F0F] flex flex-col justify-between h-full rounded-2xl"
          initial={{ opacity: 0, y: 20, x: 20, rotate: 2 }}
          animate={
            !isMobile
              ? { opacity: 1, y: 0, x: 0, rotate: 0 }
              : isOpen
                ? { opacity: 1, y: 0, x: 0, rotate: 0 }
                : { opacity: 0, y: 20, x: 20, rotate: 2 }
          }
        >
          <div>
            <img
              src="/indievia-text-logo.png"
              className="w-[100px] h-auto"
              alt="Indie-Via Logo"
            />
            <div className="pt-12 flex-1 flex-col space-y-2">
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "dashboard" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/admin/dashboard"
              >
                <ShieldEllipsis className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Moderation
                </span>
              </Link>
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "bug-reports" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/admin/dashboard/bug-reports"
              >
                <Bug className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Bug Reports
                </span>
              </Link>
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "help-and-support" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/admin/dashboard/help-and-support"
              >
                <HandHeart className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Help & Support
                </span>
              </Link>
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "inbox" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/admin/dashboard/inbox"
              >
                <Inbox className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">Inbox</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border-t pt-5 mt-10 flex gap-5">
              <div className="flex gap-3 w-full">
                <Avatar className="size-10">
                  <AvatarImage
                    src={
                      profileData?.profile_picture_url + `?random=${randomNum}`
                    }
                  />
                  <AvatarFallback>
                    {profileData?.full_name?.[0] ||
                      user?.data?.user?.user_metadata?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm flex items-center">
                    {isLoading ? (
                      <div className="w-40 h-3 rounded-lg bg-white/50 animate-pulse" />
                    ) : (
                      user?.data?.user?.user_metadata?.fullName ||
                      profileData?.full_name
                    )}
                    <div className="bg-brand text-[8px] w-fit h-fit p-[5px] ml-2 leading-[1] rounded-full text-white">
                      Admin
                    </div>
                  </div>
                  <div className="text-sm text-white/70 font-light">
                    {isLoading ? (
                      <div className="w-20 h-3 mt-2 rounded-lg bg-white/50 animate-pulse" />
                    ) : (
                      user?.data?.user?.email
                    )}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout}>
                <LogOut className="size-5 text-neutral-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <button
        onClick={() => setIsOpen((b) => !b)}
        className="lg:hidden md:hidden z-[10000] fixed bottom-5 flex right-5 size-10 rounded-full bg-white shadow-xl text-black"
      >
        {isOpen ? (
          <Plus className="size-5 m-auto rotate-45" />
        ) : (
          <Sidebar className="size-5 m-auto" />
        )}
      </button>
    </>
  );
};

export default AdminSidebar;
