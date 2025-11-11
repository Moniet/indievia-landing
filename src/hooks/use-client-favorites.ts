import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import useUser from "./use-user";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useParams } from "react-router-dom";
import { useProfile } from "./use-profile";
import { useClientProfile } from "./use-client-profile";

export type Favorite = {
  professional_profiles: {
    slug: string;
    position: string;
    full_name: string;
    avg_rating: number;
    profile_picture_url: string;
  };
};

export const fetchClientFavorites = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number;
  queryKey: [string, { clientId: string }];
}) => {
  const [_, { clientId }] = queryKey;
  const res = await supabase.functions.invoke(
    `favorite/${clientId}?page=${pageParam}`,
    {
      method: "GET",
    },
  );
  return res.data as {
    favs: Favorite[];
    total_pages: number;
  };
};

export const useClientFavorites = () => {
  const { clientId: clientIdParam } = useParams();
  const [{ profileData }] = useClientProfile();
  const clientId =
    clientIdParam !== "dashboard" ? clientIdParam : profileData?.id;

  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["client-favs", { clientId }],
    queryFn: fetchClientFavorites,
    enabled: !!clientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (pages?.length < lastPage?.total_pages) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  const favorites = data?.pages.flatMap((p) => p.favs) ?? [];
  return {
    favorites,
    ...rest,
  };
};
