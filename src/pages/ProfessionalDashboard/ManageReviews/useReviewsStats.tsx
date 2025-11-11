import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchReviews = () =>
  supabase.functions
    .invoke("review_stats", {
      method: "GET",
    })
    .then((r) => {
      if (r.error) {
        throw new Error(r.error.message);
      }

      return r?.data;
    });

export const useReviewStats = () => {
  const res = useQuery({
    queryKey: ["review_stats"],
    queryFn: fetchReviews,
    staleTime: 60 * 1000 * 5,
  });

  const data = res?.data?.reduce((pv, cv) => {
    pv[cv.rating] = cv;
    return pv;
  }, {});

  const totalReviewCount = res?.data?.reduce(
    (pv, cv) => pv + Number(cv?.count || 0),
    0,
  );
  const avgRating = Number(res?.data?.[0]?.average_rating ?? 0)?.toFixed(1);
  return { ...res, data, totalReviewCount, avgRating };
};
