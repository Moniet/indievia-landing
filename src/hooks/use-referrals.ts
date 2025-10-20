import { supabase } from "@/integrations/supabase/client";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useProfessionalProfile } from "./use-professional-profile";
import { useProfile } from "./use-profile";

type Referrals = {
  role: "professional" | "client";
  email: string;
  fullName: string;
  createdAt: string;
}[];

const fetchRefs = () => {
  return supabase.functions.invoke("referral_profiles", { method: "GET" });
};

export const useRecentReferrals = () => {
  const { data } = useProfile();
  const { data: referrals, ...rest } = useQuery({
    queryKey: ["recent-referrals"],
    queryFn: fetchRefs,
    enabled: !!data?.data?.profile?.id,
    staleTime: 10 * 1000 * 60,
  });

  return {
    referrals,
    ...rest,
  };
};
