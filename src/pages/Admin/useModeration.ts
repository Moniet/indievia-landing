import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";

export type Report = {
  client_full_name: string;
  client_id: string;
  created_at: string;
  custom_message: string;
  has_been_read: boolean;
  id: string;
  c_profile_picture: string;
  p_full_name: string;
  p_picture: string;
  p_slug: string;
  report_type: string[];
  reported_by_user_id: string;
  reported_on: string;
  review: string;
  review_id: string;
  status: "open" | "ignored" | "closed" | "blocked" | "blocked_and_banned";
};

const fetchReports = async ({
  pageParam: page = 1,
  queryKey,
}: {
  pageParam: number;
  queryKey: [string, { filter: Filter }];
}) => {
  const [_, { filter }] = queryKey;
  return await supabase.functions
    .invoke(`admin/moderation?page=${page}&filters=${filter}`, {
      method: "GET",
    })
    .then((d) => {
      if (d.error) {
        throw d.error;
      }
      return d.data as { total_pages: number; reports: Report[] };
    });
};

export type Filter = "ignored" | "read" | "open" | "blocked" | "banned";

export const useModeration = ({ filter = "open" }: { filter: Filter }) => {
  const res = useInfiniteQuery({
    queryFn: fetchReports,
    queryKey: ["moderation_reports", { filter }],
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      console.log({ pages, lastPage });
      if (pages.length < lastPage.total_pages) return pages.length + 1;

      return undefined;
    },
    // staleTime: 1000 * 60 * 5,
  });

  return res;
};
