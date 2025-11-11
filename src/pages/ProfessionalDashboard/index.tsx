import { Route, Routes, useLoaderData, useLocation } from "react-router-dom";
import ProfessionalDashboardSidebar from "./ProfessionalDashboardSidebar";
import ManageReviews from "./ManageReviews/ManageReviews";
import Referrals from "./Referrals/Referrals";
import { Profile } from "./Profile";
import { motion, AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";

const ProfessionalDashboard = () => {
  return (
    <div className="flex w-full h-full min-h-screen max-w-screen bg-[#191919]">
      <ProfessionalDashboardSidebar />
      <div className="w-full h-screen max-h-screen overflow-y-auto flex-1  bg-[#191919] p-5">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="referrals" element={<Referrals />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfessionalDashboard;
