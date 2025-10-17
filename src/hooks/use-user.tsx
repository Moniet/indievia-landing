import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const fetchUser = () => supabase.auth.getUser();

const useUser = () => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 10 * 60 * 1000,
  });

  return [{ user, error }, isLoading] as const;
};

export default useUser;
