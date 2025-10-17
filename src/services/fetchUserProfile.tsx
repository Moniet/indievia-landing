import { supabase } from "@/integrations/supabase/client";

export type UserProfile = {
  id: number;
  created_at: string;
  user_id: string;
  role: string;
};

export const fetchUserProfile = async (userId: string) => {
  const res = await supabase
    .from("profiles" as never)
    .select("*")
    .eq("user_id", userId)
    .single();

  return {
    ...res,
    data: res.data as UserProfile,
  };
};
