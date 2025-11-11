import { Route, Routes, useNavigate } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import { Moderation } from "./Moderation";
import { BugReports } from "./BugReport";
import { HelpAndSupport } from "./HelpAndSupport";
import { ContactMessages } from "./ContactMessages";
import { useProfile } from "@/hooks/use-profile";
import { useEffect } from "react";
import useUser from "@/hooks/use-user";

export const AdminPage = () => {
  const [{ user }, isLoadingUser] = useUser();
  const { isLoading, data } = useProfile();
  const nav = useNavigate();

  useEffect(() => {
    const isNotAdmin =
      (!user && !isLoadingUser) ||
      (!isLoading &&
        data &&
        data?.data?.profile?.role !== "admin" &&
        data?.data?.role !== "admin");

    if (isNotAdmin) {
      nav("/", {
        replace: true,
      });
    }
  }, [isLoading, data]);

  return (
    <div className="w-full min-h-screen flex bg-[#191919]">
      <AdminSidebar isLoadingAdmin={isLoadingUser || isLoading} />
      <div className="flex-1 max-md:pl-5">
        <Routes>
          <Route path="/" element={<Moderation />} />
          <Route path="bug-reports" element={<BugReports />} />
          <Route path="help-and-support" element={<HelpAndSupport />} />
          <Route path="inbox" element={<ContactMessages />} />
        </Routes>
      </div>
    </div>
  );
};
