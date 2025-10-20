import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import useUser from "./use-user";
import { useStore } from "./use-store";

export type ProfessionalProfileData = {
  id: string;
  email: string;
  full_name: string;
  position: string;
  address: string;
  bio: string;
  slug: string;
  referral_count: number;
  badge: string;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  profile_picture_url?: string | null;
  current_badge?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const fetchProfessionalProfile = (userId: string) => async () => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("professional_profiles" as never)
    .select("*")
    .eq("user_id", userId)
    .single();

  const { data: profile } = await supabase
    .from("profiles" as never)
    .select("referral_count,badge,referral_code")
    .eq("user_id", userId)
    .single();

  if (error) {
    // Optionally: throw or handle error
    return null;
  }

  return { ...(data || {}), ...profile } as ProfessionalProfileData;
};

export const useProfessionalProfile = () => {
  const [{ user }, isLoading] = useUser();
  const setProfileUrl = useStore((s) => s.setUserProfileUrl);
  const setFullName = useStore((s) => s.setFullName);

  const {
    isLoading: isLoadingProfile,
    data: profileData,
    ...rest
  } = useQuery({
    queryKey: ["professional-profile"],
    queryFn: fetchProfessionalProfile(user?.data?.user?.id),
    enabled: !!user?.data?.user?.id,
    staleTime: 10 * 60 * 1000,
  });

  if (profileData?.profile_picture_url) {
    setProfileUrl(profileData.profile_picture_url);
  }
  if (profileData?.full_name) {
    setFullName(profileData.full_name);
  }

  return [
    {
      ...rest,
      profileData,
    },
    isLoading || isLoadingProfile,
  ] as const;
};
