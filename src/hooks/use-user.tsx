import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const fetchUser = () => supabase.auth.getUser();

const useUser = () => {
  const {
    data: user,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        rest.refetch();
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, []);

  return [{ user, ...rest }, isLoading] as const;
};

export default useUser;
