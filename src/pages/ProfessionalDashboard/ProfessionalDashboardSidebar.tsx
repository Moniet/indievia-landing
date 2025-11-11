import { ContactMessage } from "@/components/ContactMessageDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import useUser from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Bug,
  ChartColumn,
  ChartNoAxesColumn,
  Flag,
  Layers,
  LogOut,
  Plus,
  Search,
  Sidebar,
  User,
  Users,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const DonutProgress = ({ progress = 0.75 }) => {
  // Simple donut SVG: 75% progress as an example
  const radius = 24;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        stroke="#555"
        fill="transparent"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
      />
      <circle
        stroke="#fff"
        fill="transparent"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={circumference - progress * circumference}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.35s",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      <text
        x="50%"
        y="50%"
        style={{ transform: "translate(1%,3%)" }}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="10"
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
};

const ProfessionalDashboardSidebar = () => {
  const loc = useLocation();
  const page = loc.pathname.split("/").at(-1);
  const [{ profileData }, isLoading] = useProfessionalProfile();
  const [{ user }] = useUser();
  const nav = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const randomNum = useMemo(() => Math.random(), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const profileCompletionProgress =
    profileCompletion.filter(Boolean).length / profileCompletion.length;

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
        <div
          className={`fixed md:hidden top-0 left-0 size-full bg-zinc-900/50 backdrop-blur-sm`}
        />
      )}
      <div
        className={`
        md:w-[300px] lg:w-[400px] [transition:flex_1s_ease] overflow-hidden flex-grow-0 h-screen p-3 flex flex-col md:p-5 pb-20
        max-md:fixed max-md:w-full max-md:h-full max-md:z-[1000]
        ${isOpen && isMobile ? "max-md:pointer-events-auto" : "max-md:pointer-events-none"}
      `}
      >
        <motion.div
          className="px-7 pt-8 pb-8 bg-[#0F0F0F] flex flex-col justify-between h-full rounded-2xl"
          initial={{ opacity: 0, y: 20, x: 20, rotate: 2 }}
          animate={
            !isMobile
              ? {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  rotate: 0,
                }
              : isOpen
                ? {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    rotate: 0,
                  }
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
                to="/professional/dashboard"
              >
                <Users className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Profile
                </span>
              </Link>
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "reviews" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/professional/dashboard/reviews"
              >
                <ChartNoAxesColumn className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Manage reviews
                </span>
              </Link>
              <Link
                className={`flex gap-5 items-center p-3 rounded-lg -ml-3 ${page === "referrals" ? "bg-white/5 text-[#EB623C]" : "text-white"} transition-colors`}
                to="/professional/dashboard/referrals"
              >
                <Layers className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Referrals
                </span>
              </Link>
              {/*<Link
              className={`flex gap-5 items-center p-3 rounded-lg -ml-3 transition-colors`}
              to="/professional/dashboard/search"
            >
              <Search className="size-5" />
              <span className="text-sm mb-0 !pb-0 tracking-wide">Search</span>
            </Link>*/}
            </div>
          </div>
          <div className="flex flex-col">
            <ContactMessage mode="bug_report">
              <button className={`flex gap-5 items-center`}>
                <Bug className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Report a bug
                </span>
              </button>
            </ContactMessage>
            <ContactMessage mode="help_and_support">
              <button className="flex gap-5 items-center mt-4">
                <Flag className="size-5" />
                <span className="text-sm mb-0 !pb-0 tracking-wide">
                  Help and support
                </span>
              </button>
            </ContactMessage>
            {!dismissed && profileCompletionProgress < 0.9 && !isLoading && (
              <div className="mt-7 rounded-md bg-zinc-800 p-4">
                <DonutProgress progress={profileCompletionProgress} />
                <div className="text-xs mt-3 font-medium">
                  Profile Filled Out
                </div>
                <div className="text-xs mt-1 font-light text-white/70">
                  Add missing info and portfolio photos to reach more clients
                </div>
                <div className="flex gap-3 mt-2.5">
                  <button
                    onClick={() => setDismissed(true)}
                    className="text-xs font-medium"
                  >
                    Dismiss
                  </button>
                  <Link
                    to="/professional/dashboard"
                    className="text-xs font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )}
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
                  <div className="text-sm">
                    {isLoading ? (
                      <div className="w-40 h-3 rounded-lg bg-white/50 animate-pulse" />
                    ) : (
                      user?.data?.user?.user_metadata?.fullName ||
                      profileData?.full_name
                    )}
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

export default ProfessionalDashboardSidebar;
