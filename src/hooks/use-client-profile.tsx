import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import useUser from "./use-user";
import { useStore } from "./use-store";
import { useLocation, useParams } from "react-router-dom";

export type ProfileData = {
  address: string;
  bio: string;
  created_at: string;
  current_badge: string | null;
  facebook: string | null;
  full_name: string;
  id: string;
  instagram: string | null;
  position: string;
  profile_picture_url: string | null;
  slug: string | null;
  twitter: string | null;
  user_id: string;
  youtube: string | null;
  referral_code: string;
  badge: string;
  referral_count: number;
};

export const fetchClientProfile =
  (userId: string, isDashboard = false) =>
  async () => {
    const res = await supabase.functions.invoke(
      "client_profile/" + (isDashboard ? "dashboard" : userId),
      { method: "GET" },
    );

    if (res.error) {
      throw res.error;
    }
    return res.data as ProfileData;
  };

export const useClientProfile = () => {
  const [{ user }, isLoading] = useUser();
  const { pathname } = useLocation();
  const { clientId } = useParams();
  const isDashboard = pathname.includes("/client/dashboard");

  const userId = isDashboard ? user?.data?.user?.id : clientId;

  const {
    isLoading: isLoadingProfile,
    data: profileData,
    ...rest
  } = useQuery({
    queryKey: ["client-profile", { userId }],
    queryFn: fetchClientProfile(userId, isDashboard),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  return [
    {
      ...rest,
      profileData,
    },
    isLoading,
  ] as const;
};
