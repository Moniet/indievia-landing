import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchReviews = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: [string, { slug: string }];
}) => {
  const [, { slug }] = queryKey;
  return supabase.functions.invoke(`review?slug=${slug}&page=${pageParam}`, {
    method: "GET",
  });
};

/* Fetch reviews for public professional view */
export const useReviews = (slug: string) => {
  const res = useInfiniteQuery({
    queryKey: ["reviews", { slug }],
    queryFn: fetchReviews,
    initialPageParam: 1,
    enabled: !!slug,
    getNextPageParam: (lastPage, pages) => {
      // You may need to customize this based on your API's pagination.
      // For example, check if lastPage.data.hasMore or similar field exists:
      // return lastPage.data.hasMore ? pages.length + 1 : undefined;

      // Placeholder: always increment page (not for production!)
      return pages.length + 1;
    },
  });

  return res;
};
