import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type ProfessionalProfilePublicData = {
  user_id: string;
  email: string;
  full_name: string;
  position: string;
  address: string;
  bio: string;
  slug: string;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  profile_picture_url: string;
  gallery: string[];
  referral_code: string;
  badge: string;
  reviews: {
    id: number;
    review: string;
    userId: string;
    rating: number;
    gallery?: string[];
    client_id: string;
    client_profiles: {
      full_name: string;
      profile_picture_url: string;
    };
  }[];
};

const fetchPublicProfile = (slug?: string) => async () => {
  if (!slug) return null;

  const { data, error } = await supabase.functions.invoke(
    "professional-public-profile",
    {
      body: {
        slug,
      },
    },
  );

  if (error) {
    return null;
  }
  return data as ProfessionalProfilePublicData | null;
};

export const useProfessionalProfilePublic = () => {
  const { profileSlug } = useParams<{ profileSlug: string }>();

  const {
    isLoading,
    data: profileData,
    ...rest
  } = useQuery({
    queryKey: ["professional-profile-public", profileSlug],
    queryFn: fetchPublicProfile(profileSlug),
    enabled: !!profileSlug,
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
