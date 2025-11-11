import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InboxMessage } from "./types";
import { useState } from "react";

const fetchReports = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam: number;
  queryKey: [string, { status: string }];
}) => {
  const [_, { status = "open" }] = queryKey;
  const res = await supabase.functions.invoke(
    `admin/inbox/bug_reports?page=${pageParam}&status=${status}`,
    {
      method: "GET",
    },
  );

  if (res.error) {
    throw res.error;
  }

  return res?.data as {
    total_pages: number;
    reports: InboxMessage[];
  };
};

export const useBugReports = (defaultStatus = "open") => {
  const [status, setStatus] = useState(defaultStatus);
  const res = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["bug_reports", { status }],
    queryFn: fetchReports,
    getNextPageParam(lastPage, pages) {
      if (pages.length < lastPage.total_pages) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  return { ...res, setStatus, status };
};
