import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  Star,
  Flag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User2,
  Trash2Icon,
  PenIcon,
  Ellipsis,
  PencilRulerIcon,
  LucideInfo,
} from "lucide-react";
import { motion, AnimatePresence, useUnmountEffect } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReviewStats } from "./useReviewsStats";
import { useReviews } from "./useReviews";
import { Separator } from "@/components/ui/separator";
import { useReviewReply } from "@/hooks/use-review-reply";
import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ReportingReviewDialog } from "@/components/ReportReviewDialog";
import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";

type Review = {
  review: string;
  rating: string;
  reply_id?: string;
  client_id: string;
  created_at: string;
  profile_picture_url: string;
  id: string;
  reply_text?: string;
  full_name: string;
  gallery?: string[];
  is_reported?: boolean;
};

type SortKey = "newest" | "oldest" | "highest" | "lowest";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `Today | ${hh}:${mm}`;
  }

  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  if (isYesterday) {
    return "Yesterday";
  }

  // dd-mm-yyyy
  return d.toDateString().slice(0, 10);
};

const Stars = ({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      {new Array(5).fill(null).map((_, i) => (
        <Star
          key={i}
          className={cn(
            `size-3 md:size-4 ${
              i < rating
                ? "fill-yellow-500 stroke-yellow-500 stroke-none"
                : "fill-white/20 stroke-none"
            }`,
            className,
          )}
        />
      ))}
    </div>
  );
};

const DistributionRow = ({
  stars,
  count,
  total,
  color = "bg-brand",
}: {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
  total: number;
  color?: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-[42px] justify-end">
        <span className="text-xs text-white/70">★</span>
        <span className="text-xs text-white/70">{stars}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 w-full sm:w-[240px] overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-xs text-white/70">{count}</div>
    </div>
  );
};

const GalleryImage = ({ src }: { src: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="size-[100px] min-w-[100px] cursor-pointer select-none">
      <motion.img
        onClick={() => setIsOpen(true)}
        className="size-full object-cover rounded-xl border border-white/5"
        src={src}
        alt=""
      />
      {isOpen && (
        <AnimatePresence>
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed z-[10000000] bg-black/50 top-0 left-0 w-screen h-screen flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          />
        </AnimatePresence>
      )}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-fit h-fit z-[10000001] fixed top-1/2 left-1/2 "
            style={{
              transformOrigin: "left center",
            }}
          >
            <img
              src={src}
              className="w-[90vw] sm:w-[500px] max-h-[80vh] shadow-xl z-[1000] -translate-x-1/2 -translate-y-1/2  h-auto object-cover border  rounded-xl  border-white/5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReviewGallery = ({ gallery }: { gallery: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkForScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(
        isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth,
      );
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkForScroll();
      el.addEventListener("scroll", checkForScroll, { passive: true });
      window.addEventListener("resize", checkForScroll);
      return () => {
        el.removeEventListener("scroll", checkForScroll);
        window.removeEventListener("resize", checkForScroll);
      };
    }
  }, [gallery]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === "left"
          ? -scrollRef.current.clientWidth / 2
          : scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <div className="relative max-w-full overflow-hidden group">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {gallery.map((src, idx) => (
          <GalleryImage key={idx} src={src} />
        ))}
      </div>
      {canScrollLeft && (
        <Button
          onClick={() => scroll("left")}
          variant="ghost"
          className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="size-5" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          onClick={() => scroll("right")}
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="size-5" />
        </Button>
      )}
    </div>
  );
};

const EditReplyDialog = ({
  open,
  onOpenChange,
  review,
  refetchReviews,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review;
  refetchReviews?: () => void;
}) => {
  const [replyText, setReplyText] = useState(review.reply_text || "");
  const { editReply, isEditing, editError } = useReviewReply({
    onEdit: () => {
      refetchReviews?.();
      onOpenChange(false);
    },
  });

  const handleSubmit = () => {
    if (review.reply_id) {
      editReply({ id: review.reply_id, reply_text: replyText });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181A] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Edit your reply</DialogTitle>
          <DialogDescription>
            Make changes to your reply. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full rounded-md bg-black/30 border border-white/10 text-sm text-white placeholder:text-white/40 p-3 outline-none focus:ring-2 focus:ring-brand"
            rows={4}
          />
          {editError && (
            <p className="text-red-500 text-xs mt-2">
              {String(editError) || "An error occurred"}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isEditing || !replyText.trim()}
            className="bg-brand hover:bg-brand/90"
          >
            {isEditing && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReviewCard = ({
  review,
  refetchReviews,
}: {
  review: Review;
  refetchReviews?: () => void;
}) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [{ profileData }] = useProfessionalProfile();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {
    postReply,
    isLoading: isReplying,
    error: replyError,
    deleteReply,
    isDeleting,
  } = useReviewReply({
    onSubmit: () => {
      refetchReviews?.();
      setReplying(false);
    },
    onDelete: () => {
      refetchReviews?.();
    },
  });

  return (
    <div className="rounded-xl w-full max-w-[750px] border border-white/5 bg-[#18181A] p-4 sm:p-5 overflow-hidden">
      <EditReplyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        review={review}
        refetchReviews={refetchReviews}
      />
      <div className="text-white/50 text-xs font-light mb-4">
        {formatDate(review?.created_at)}
      </div>
      <div className="flex items-start gap-4">
        <Avatar className="size-8 md:size-10">
          <AvatarImage src={review.profile_picture_url} />
          <AvatarFallback className="bg-white/10 text-white text-sm">
            {review.full_name
              ?.split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 flex flex-col max-w-full overflow-hidden">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center gap-2">
              <div className="text-white text-sm font-medium">
                {review.full_name}
              </div>
            </div>
            <Stars rating={parseInt(review.rating, 10)} />
          </div>
          {!!review.gallery?.length && (
            <div className="w-full overflow-hidden py-2">
              <ReviewGallery gallery={review.gallery} />
            </div>
          )}
          <p className="text-xs md:text-sm font-light leading-5 text-white/50 w-full md:w-2/3">
            {review.review}
          </p>
          <div className="pt-4 flex justify-end items-center gap-4">
            {!review.reply_text && !review.is_reported && (
              <ReportingReviewDialog review_id={review.id}>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs text-white/80 hover:bg-white/10 bg-white/5 rounded-full duration-300 font-light"
                >
                  <Flag className="size-3.5" strokeWidth={1.5} />
                  Report
                </Button>
              </ReportingReviewDialog>
            )}
            {review.is_reported && (
              <div className="p-2 rounded-full flex items-center gap-1 bg-amber-500/20 border border-amber-500 text-amber-500 text-xs">
                <LucideInfo className="size-4" />
                This review has been reported.
              </div>
            )}
            {!review.reply_text && (
              <Button
                className="h-8 rounded-full px-4 text-xs bg-[#EE714E]  hover:bg-[#ED613A] transition-colors duration-300 font-light"
                onClick={() => {
                  setReplying(true);
                }}
              >
                Reply
              </Button>
            )}
          </div>

          {replying && (
            <div className="mt-3">
              <textarea
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full rounded-md bg-black/30 border border-white/10 text-sm text-white placeholder:text-white/40 p-3 outline-none focus:ring-2 focus:ring-brand"
                rows={3}
                placeholder="Write a public reply..."
              />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  className="h-8 px-4 text-xs bg-employIn-blue hover:bg-employIn-darkBlue"
                  onClick={() => {
                    postReply({
                      reply_to_id: review?.id,
                      reply_text: replyText,
                    });
                  }}
                  disabled={isReplying}
                >
                  {isReplying && <Loader2 className="size-4 animate-spin" />}
                  Submit
                </Button>
                <Button
                  disabled={isReplying}
                  variant="outline"
                  className="h-8 px-3 text-xs text-white/70 hover:bg-white/10"
                  onClick={() => setReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {review.reply_text && (
            <div className="flex items-center gap-2 border-t pt-5 border-t-white/5">
              <div className="flex w-fit rounded-full gap-2 items-center">
                <Avatar className="size-8 border-white/5 border">
                  <AvatarImage src={profileData?.profile_picture_url} alt="" />
                  <AvatarFallback>
                    {profileData?.full_name?.[0] || (
                      <User2 className="size-3" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs md:text-sm  bg-white/5 border border-white/5 p-2 rounded-lg max-w-[400px] text-pretty">
                  {review.reply_text}
                </p>
              </div>
              <div className="flex gap-1 justify-center flex-col">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className=" focus:ring-0 focus:outline-none rounded-full">
                    <Ellipsis className="text-white/50 size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          setShowDeleteAlert(true);
                        }}
                        className="flex w-full  hover:!bg-red-500 gap-2 text-xs items-center text-red-500"
                      >
                        <Trash2Icon className="size-3" />
                        <span>Delete</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => setShowEditDialog(true)}
                        className="flex gap-2 text-xs items-center w-full"
                      >
                        <PenIcon className="size-3" />
                        <span>Edit</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialog open={showDeleteAlert}>
                  <AlertDialogContent className="bg-[#18181A] text-white border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your reply.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowDeleteAlert(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <AlertDialogAction
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (review.reply_id) {
                            deleteReply(review.reply_id);
                          }
                        }}
                      >
                        {isDeleting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          ""
                        )}
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <div className="rounded-xl w-full max-w-[750px] border border-white/5 bg-[#18181A] p-4 sm:p-5 overflow-hidden animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-full bg-white/10"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between max-w-full">
            <div className="h-5 bg-white/10 rounded w-1/3"></div>
            <div className="h-5 bg-white/10 rounded w-24"></div>
          </div>
          <div className="space-y-2 w-full md:w-2/3">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
          <div className="pt-2 flex justify-end items-center gap-2">
            <div className="h-8 w-24 bg-white/5 rounded-full"></div>
            <div className="h-8 w-20 bg-[#EE714E]/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 max-w-[750px] lg:divide-x divide-white/10 gap-y-4 animate-pulse">
      <div className="">
        <div className="h-5 bg-white/10 rounded w-3/4"></div>
        <div className="h-8 bg-white/10 rounded w-1/2 mt-2"></div>
      </div>
      <div className="pl-5">
        <div className="h-5 bg-white/10 rounded w-3/4"></div>
        <div className="h-8 bg-white/10 rounded w-1/2 mt-2"></div>
      </div>
      <div className="pl-5">
        <div className="space-y-2">
          {new Array(5).fill(null).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-[42px] h-4 bg-white/10 rounded"></div>
              <div className="h-2 rounded-full bg-white/10 w-full sm:w-[240px]"></div>
              <div className="w-8 h-4 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ManageReviews = () => {
  const [_, isLoadingUser] = useUser();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const {
    data: reviews,
    hasNextPage: hasMoreReviews,
    fetchNextPage: fetchMoreReviews,
    refetch: refetchReviews,
    isRefetching,
    isFetchingNextPage: isFetchingMoreReviews,
    isLoading: isLoadingReviews,
  } = useReviews();

  const {
    data: reviewStats,
    avgRating,
    totalReviewCount = 0,
    isLoading: isLoadingStats,
  } = useReviewStats();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const allReviews =
      reviews?.pages.flatMap((page) => page.data?.reviews) ?? [];
    let arr: Review[] = [...allReviews].filter(Boolean);

    if (q) {
      arr = arr.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.review.toLowerCase().includes(q) ||
          formatDate(r?.created_at).toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "newest":
        arr.sort((a, b) => +new Date(b?.created_at) - +new Date(a?.created_at));
        break;
      case "oldest":
        arr.sort((a, b) => +new Date(a?.created_at) - +new Date(b?.created_at));
        break;
      case "highest":
        arr.sort((a, b) => parseInt(b.rating, 10) - parseInt(a.rating, 10));
        break;
      case "lowest":
        arr.sort((a, b) => parseInt(a.rating, 10) - parseInt(b.rating, 10));
        break;
    }
    return arr.filter(Boolean);
  }, [query, sort, reviews]);

  return (
    <div className="w-full text-white md:px-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <h1 className="text-lg sm:text-xl">Manage reviews</h1>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
          <Input
            className="pl-9 bg-[#0f0f0f] border-white/10 placeholder:text-white/50 text-sm"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats + Distribution */}
      <div className="w-full rounded-xl mt-10">
        {isLoadingStats ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 max-w-[750px] lg:divide-x divide-white/10 gap-y-4">
            <div className="">
              <div className="text-base font-medium">Total Reviews</div>
              <div className="text-3xl mt-1">{totalReviewCount}</div>
              {/*<div className="text-[11px] text-white/40 mt-1">
              Growth in reviews
            </div>*/}
            </div>
            <div className="lg:pl-5">
              <div className="text-base font-medium">Average Rating</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="text-3xl">{avgRating}</div>
              </div>
              {/*<div className="text-[11px] text-white/40 mt-1">
              Growth in reviews
            </div>*/}
            </div>
            <div className="lg:pl-5">
              <div className="space-y-2">
                <DistributionRow
                  stars={5}
                  count={reviewStats?.[5]?.count ?? 0}
                  total={totalReviewCount}
                  color={"bg-green-400"}
                />
                <DistributionRow
                  stars={4}
                  color={"bg-purple-400"}
                  count={reviewStats?.[4]?.count ?? 0}
                  total={totalReviewCount}
                />
                <DistributionRow
                  stars={3}
                  color={"bg-yellow-400"}
                  count={reviewStats?.[3]?.count ?? 0}
                  total={totalReviewCount}
                />
                <DistributionRow
                  stars={2}
                  color={"bg-blue-400"}
                  count={reviewStats?.[2]?.count ?? 0}
                  total={totalReviewCount}
                />
                <DistributionRow
                  color={"bg-red-400"}
                  stars={1}
                  count={reviewStats?.[1]?.count ?? 0}
                  total={totalReviewCount}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List header */}
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="text-lg text-white capitalize">{sort}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs bg-[#141414] border border-white/10 hover:bg-white/10"
            >
              Sort by
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setSort("newest")}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("oldest")}>
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("highest")}>
              Highest rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("lowest")}>
              Lowest rating
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {isLoadingReviews || isLoadingUser ? (
          <>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </>
        ) : (
          <>
            {filtered?.map((r) => (
              <ReviewCard
                key={r?.client_id}
                review={r}
                refetchReviews={() => refetchReviews()}
              />
            ))}
            {filtered.length === 0 && query && (
              <div className="text-center text-white/60 text-sm py-10">
                No reviews match your search.
              </div>
            )}
            {!isLoadingReviews &&
              !isLoadingStats &&
              (!reviews || reviews?.pages?.length === 0) && (
                <Empty className="max-w-[750px] border bg-white/5">
                  <EmptyHeader>
                    <LucideInfo />
                    <EmptyTitle>Looks like there's no reviews</EmptyTitle>
                    <EmptyDescription>
                      Try sharing your profile with friends to get some initial
                      impressions!
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            {!hasMoreReviews && (
              <div className="pt-10 max-w-[750px] text-sm font-light text-white/50 text-center">
                <Separator />{" "}
                <div className="bg-[#191919] px-3 -translate-y-1/2 w-fit mx-auto">
                  End Of Page
                </div>
              </div>
            )}
            {hasMoreReviews && !query && filtered?.length && (
              <Button
                className="rounded-full"
                variant="normal"
                disabled={!hasMoreReviews}
                onClick={() => fetchMoreReviews()}
              >
                {isFetchingMoreReviews && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                View more
              </Button>
            )}
          </>
        )}
        <AnimatePresence>
          {isRefetching && (
            <motion.div
              exit={{ y: 20, opacity: 0 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-4 right-4 md:bottom-10 md:right-10 flex items-center text-xs md:text-sm bg-black/70 border border-white/10 backdrop-blur px-3 py-2 rounded-full"
            >
              <Loader2 className="size-5 animate-spin mr-2" />
              Fetching latest reviews
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageReviews;
