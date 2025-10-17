import { Route, Routes, useLoaderData, useLocation } from "react-router-dom";
import ProfessionalDashboardSidebar from "./ProfessionalDashboardSidebar";
import ManageReviews from "./ManageReviews/ManageReviews";
import Referrals from "./Referrals/Referrals";
import { Profile } from "./Profile";
import { motion, AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";

const FadeInOut = ({ children, id }: PropsWithChildren<{ id: string }>) => {
  return (
    <AnimatePresence>
      <motion.div
        key={id}
        exit={{ y: 20, opacity: 0 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const ProfessionalDashboard = () => {
  const loc = useLocation();
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
