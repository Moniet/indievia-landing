import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import useUser from "./use-user";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "./use-profile";

export type Review = {
  id: string;
  review: string;
  rating: number;
  professional_id: string;
  media_urls?: string[];
  created_at: string;
};

export type Reviews = Review[];

// Type guard helpers
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const getNumber = (v: unknown): number | undefined =>
  typeof v === "number" && !Number.isNaN(v) ? v : undefined;

const getArray = (v: unknown): unknown[] | undefined =>
  Array.isArray(v) ? v : undefined;

// Extract an array of items (reviews) from a page with flexible shapes
const extractItemsFromPage = (page: unknown): unknown[] => {
  if (Array.isArray(page)) return page;

  if (!isRecord(page)) return [];

  const candidates: unknown[] = [
    page["reviews"],
    page["items"],
    page["data"],
    isRecord(page["data"])
      ? (page["data"] as Record<string, unknown>)["reviews"]
      : undefined,
    isRecord(page["data"])
      ? (page["data"] as Record<string, unknown>)["items"]
      : undefined,
    isRecord(page["payload"])
      ? (page["payload"] as Record<string, unknown>)["reviews"]
      : undefined,
    isRecord(page["payload"])
      ? (page["payload"] as Record<string, unknown>)["items"]
      : undefined,
  ];

  for (const c of candidates) {
    const arr = getArray(c);
    if (arr) return arr;
  }
  return [];
};

// Extract total count from a page with flexible shapes
const extractCountFromPage = (page: unknown): number | undefined => {
  if (!isRecord(page)) return undefined;

  const candidates: unknown[] = [
    page["count"],
    isRecord(page["data"])
      ? (page["data"] as Record<string, unknown>)["count"]
      : undefined,
    isRecord(page["meta"])
      ? (page["meta"] as Record<string, unknown>)["count"]
      : undefined,
    isRecord(page["pagination"])
      ? (page["pagination"] as Record<string, unknown>)["count"]
      : undefined,
    page["total"],
  ];

  for (const c of candidates) {
    const num = getNumber(c);
    if (typeof num === "number") return num;
  }
  return undefined;
};

// Extract current page index if provided by the server (1-based typical)
const extractPageIndexFromPage = (page: unknown): number | undefined => {
  if (!isRecord(page)) return undefined;

  const candidates: unknown[] = [
    page["page"],
    page["currentPage"],
    isRecord(page["meta"])
      ? (page["meta"] as Record<string, unknown>)["page"]
      : undefined,
    // Private hint we add in fetcher when shape is unknown
    page["_page"],
  ];

  for (const c of candidates) {
    const num = getNumber(c);
    if (typeof num === "number") return num;
  }
  return undefined;
};

// Extract page size/limit if provided by the server
const extractPageSizeFromPage = (page: unknown): number | undefined => {
  if (!isRecord(page)) return undefined;

  const candidates: unknown[] = [
    page["pageSize"],
    page["limit"],
    page["perPage"],
    (page as Record<string, unknown>)["per_page"],
    isRecord(page["meta"])
      ? (page["meta"] as Record<string, unknown>)["pageSize"]
      : undefined,
    isRecord(page["meta"])
      ? (page["meta"] as Record<string, unknown>)["limit"]
      : undefined,
    isRecord(page["meta"])
      ? (page["meta"] as Record<string, unknown>)["per_page"]
      : undefined,
  ];

  for (const c of candidates) {
    const num = getNumber(c);
    if (typeof num === "number") return num;
  }

  // Fallback to items length if we don't get an explicit page size
  const itemsLen = extractItemsFromPage(page).length;
  return itemsLen > 0 ? itemsLen : undefined;
};

// Fetch a single page of client reviews for the given userId and page number
export const fetchClientReviewsPage = async ({
  pageParam: page = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: [string, { id: string }];
}) => {
  const [, { id: userId }] = queryKey;
  const res = await supabase.functions.invoke(
    `client_reviews/${userId}?page=${page}`,
    {
      method: "GET",
    },
  );

  return res;
};

/**
 * Hook: useClientReviews
 *
 * TanStack useInfiniteQuery implementation with pageParam and next page logic.
 * - Caches per-user using the userId in the queryKey.
 * - Uses initialPageParam.
 * - Derives hasNextPage using the total count returned by the edge function
 *   (via Supabase `select('*', { count: 'exact' })`).
 * - Also supports `nextPage` and `hasMore` hints if provided by the edge function.
 */
export const useClientReviews = () => {
  const [{ user }] = useUser();
  const { data: profile, isLoading } = useProfile();
  const { clientId } = useParams();

  const id: string | undefined =
    clientId && clientId !== "dashboard" ? clientId : profile?.data?.id;

  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["client-reviews", { id }],
    enabled: !!id && !isLoading,
    initialPageParam: 1 as number,
    queryFn: fetchClientReviewsPage,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.length === 0 || !lastPage) {
        return;
      }

      return allPages.length + 1;
    },
  });

  const reviews = data?.pages.flatMap((page) => page.data);

  return {
    reviews,
    ...rest,
  };
};
