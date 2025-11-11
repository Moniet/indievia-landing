import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useStore } from "./use-store";

export const fetchProfile = () =>
  supabase.functions.invoke("me", { method: "GET" });

export const useProfile = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchProfile,
    staleTime: Infinity,
  });

  const setProfileUrl = useStore((s) => s.setUserProfileUrl);
  const setFullName = useStore((s) => s.setFullName);

  useEffect(() => {
    if (data) {
      setProfileUrl(data?.data?.profile_picture_url);
      setFullName(data?.data?.full_name);
    }
  }, [data]);

  return { data, ...rest };
};
