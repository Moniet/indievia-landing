import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profile } from "console";

const fetchReviews = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: [string, { id: string }];
}) => {
  const [, { id }] = queryKey;
  return supabase.functions.invoke(
    `professional_dashboard_reviews?page=${pageParam}`,
    { method: "GET" },
  );
  // .range(pageParam * 5, pageParam * 5 + 5);
};

/* Fetch reviews for public professional view */
export const useReviews = () => {
  const [{ profileData }] = useProfessionalProfile();
  const id = profileData?.id;
  const res = useInfiniteQuery({
    queryKey: ["pro-reviews", { id }],
    queryFn: fetchReviews,
    initialPageParam: 1,
    enabled: !!id,
    getNextPageParam: (lastPage, pages) => {
      console.log({ lastPage });
      if (lastPage?.data?.count >= pages?.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    staleTime: 1000 * 60 * 5,
  });

  return res;
};
