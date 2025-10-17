import { useQueries, useQuery } from "@tanstack/react-query";
import useUser from "./use-user";
import { supabase } from "@/integrations/supabase/client";

export const fetchClientFavorites = (userId: string) => async () => {
  const res = await supabase
    .from("favorites" as never)
    .select("*")
    .eq("user_id", userId)
    .limit(4);
  return res.data;
};

export const useClientFavorites = () => {
  const [{ user }] = useUser();
  const userId = user?.data?.user?.id;
  const { data: favorites, ...rest } = useQuery({
    queryKey: ["client-favs"],
    queryFn: fetchClientFavorites(userId),
    enabled: !!userId,
  });

  return {
    favorites,
    ...rest,
  };
};
