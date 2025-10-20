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
  Search,
  User,
  Users,
} from "lucide-react";
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div className="flex-[400px] [transition:flex_1s_ease] overflow-hidden flex-grow-0 h-screen p-5">
      <motion.div className="px-7 pt-8 pb-8 bg-[#0F0F0F] flex flex-col justify-between h-full rounded-2xl">
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
              <span className="text-sm mb-0 !pb-0 tracking-wide">Profile</span>
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
            <Link
              className={`flex gap-5 items-center p-3 rounded-lg -ml-3 transition-colors`}
              to="/professional/dashboard/search"
            >
              <Search className="size-5" />
              <span className="text-sm mb-0 !pb-0 tracking-wide">Search</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <Link
            className={`flex gap-5 items-center`}
            to="/professional/dashboard/profile"
          >
            <Bug className="size-5" />
            <span className="text-sm mb-0 !pb-0 tracking-wide">
              Report a bug
            </span>
          </Link>
          <Link
            className="flex gap-5 items-center mt-4"
            to="/professional/dashboard/profile"
          >
            <Flag className="size-5" />
            <span className="text-sm mb-0 !pb-0 tracking-wide">
              Help and support
            </span>
          </Link>
          <div className="mt-7 rounded-md bg-zinc-800 p-4">
            <DonutProgress progress={0.8} />
            <div className="text-xs mt-3 font-medium">Profile Filled Out</div>
            <div className="text-xs mt-1 font-light text-white/70">
              Add missing info and portfolio photos to reach more clients
            </div>
            <div className="flex gap-3 mt-2.5">
              <button className="text-xs font-medium">Dismiss</button>
              <button className="text-xs font-medium">Edit</button>
            </div>
          </div>
          <div className="border-t pt-5 mt-10 flex gap-5">
            <div className="flex gap-3 w-full">
              <Avatar className="size-10">
                <AvatarImage src={profileData?.profile_picture_url} />
                <AvatarFallback>
                  {profileData?.full_name?.[0] ||
                    user?.data?.user?.user_metadata?.fullName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm">
                  {profileData?.full_name ||
                    user?.data?.user?.user_metadata?.fullName}
                  {isLoading && (
                    <div className="w-40 h-3 rounded-lg bg-white/50 animate-pulse" />
                  )}
                </div>
                <div className="text-sm font-light">
                  {profileData?.email || user?.data?.user?.email}{" "}
                  {isLoading && (
                    <div className="w-20 h-3 mt-2 rounded-lg bg-white/50 animate-pulse" />
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
  );
};

export default ProfessionalDashboardSidebar;
