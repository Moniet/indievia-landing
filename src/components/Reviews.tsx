const SUPABASE_REVIEW_FUNCTION_URL =
  "https://jhnoomtsnovadyxgiurt.supabase.co/functions/v1/reviews";
import { Reviews as TReviews } from "@/hooks/use-client-reviews";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "./RatingStars";
import { useClientProfile } from "@/hooks/use-client-profile";
import { Loader2, LucideInfo, PenSquare, ThumbsUp, Trash2 } from "lucide-react";
import { ProfessionalProfilePublicData } from "@/hooks/use-professional-profile-public";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useReviews } from "@/hooks/user-reviews";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "./ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import useUser from "@/hooks/use-user";
const GalleryImage = ({ src = "", id = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="size-[150px] min-w-[150px]">
      <motion.img
        onClick={() => setIsOpen(true)}
        className="size-[150px] object-cover rounded-xl border border-white/5"
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
              className="w-[500px] shadow-xl z-[1000] -translate-x-1/2 -translate-y-1/2  h-auto object-cover border  rounded-xl  border-white/5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ReviewItem = ({
  mode,
  review,
  profileUrl,
  fullName,
  clientProfileId,
  isUsersReview = false,
}: {
  mode: ReviewsProps["mode"];
  review: ProfessionalProfilePublicData["reviews"][0];
  profileUrl: string;
  fullName: string;
  isUsersReview?: boolean;
  clientProfileId: string;
}) => {
  const { profileSlug } = useParams();
  const queryClient = useQueryClient();
  const gallery = review?.gallery;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Get the current session's access token for Authorization
      const session = await supabase.auth.getSession();
      const accessToken = session?.data.session?.access_token;
      const { error } = await supabase.functions.invoke(`review/${review.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!error) {
        await queryClient.invalidateQueries({
          queryKey: ["reviews", { slug: profileSlug as string }],
        });
      } else {
        alert("Could not delete review: " + error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <Avatar className="size-[35px]">
        <AvatarImage src={profileUrl} alt={`Picture of ${fullName}`} />
        <AvatarFallback>{fullName?.[0]}</AvatarFallback>
      </Avatar>

      {/*TODO: show badge if exists ^^ */}
      <div className="space-y-3 overflow-hidden">
        <div>
          <Link to={`/client/${clientProfileId}`}>
            <div className="flex gap-2 items-center mb-1">
              <div className="text-white">{fullName}</div>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <RatingStars
              color={"fill-yellow-500"}
              rating={review.rating}
              totalRatingValue={5}
            />
            <div className="text-white/50 font-light text-xs">
              {new Date(review.created_at || new Date())
                .toString()
                .slice(0, 10)
                .replace(" ", ", ")}
            </div>
          </div>
        </div>
        {!!gallery?.length && (
          <div className="max-w-full w-full overflow-hidden">
            <div className="flex gap-2 overflow-x-auto max-w-full flex-1">
              {gallery.map((src, idx) => (
                <GalleryImage key={idx} src={src} id={`img-${idx}`} />
              ))}
            </div>
          </div>
        )}
        <p className="text-xs lg:text-sm leading-5 max-w-[500px] text-[#BDBDBD] text-pretty">
          {review.review}
        </p>
        <div className="flex pt-2 w-full">
          <div>
            {mode === "professional-dashboard-private" && (
              <div className="pt-2">
                <button className="text-sm font-medium space-x-2">
                  Reply{" "}
                </button>
              </div>
            )}
            {mode === "professional-dashboard-private" && (
              <div className="pt-2">
                <button className="text-sm font-medium space-x-2">
                  Report
                </button>
              </div>
            )}
          </div>
          <div>
            {(mode === "professional-dashboard-public" ||
              mode === "client-dashboard") &&
              isUsersReview && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex items-center font-light text-red-400 hover:text-red-500 ">
                      <Trash2 className="size-4 mr-1" />{" "}
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete your review?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please note that this action cannot be undone!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!justify-start mt-5">
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-400"
                        onClick={handleDelete}
                      >
                        Yes, Delete it
                      </AlertDialogAction>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for ReviewItem
export const ReviewItemSkeleton = () => (
  <div className="flex gap-3 w-full max-w-xl">
    <Skeleton className="size-[35px] rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div>
        <div className="flex gap-2 items-center mb-1">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="text-white/50 text-xs">|</div>
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <div className="flex gap-1 mb-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
        <Skeleton className="h-14 w-20 md:w-32 rounded-md" />
        <Skeleton className="h-14 w-20 md:w-32 rounded-md" />
      </div>
      <Skeleton className="h-5 w-48 md:w-80 rounded" />
      <Skeleton className="h-4 w-36 rounded" />
    </div>
  </div>
);

export const Rating = ({ rating = 4, numReviews = 143 }) => {
  return (
    <div className="absolute top-5 right-5 w-fit h-fit">
      <div className="text-5xl font-profile-header mb-1">
        {rating.toFixed(1)}
      </div>
      <RatingStars rating={rating} totalRatingValue={5} />
      <div className="font-medium text-xs mt-1">({numReviews} reviews)</div>
    </div>
  );
};

export type ReviewsProps = {
  mode:
    | "professional-dashboard-private"
    | "professional-dashboard-public"
    | "client-dashboard-public"
    | "signed-out"
    | "client-dashboard";
  reviews: ProfessionalProfilePublicData["reviews"];
  isLoading?: boolean;
  hasMoreReviews?: boolean;
  isLoadingViewMore?: boolean;
  onClickViewMore: () => void;
};

const reviewModal = z.object({
  rating: z.number().min(1).max(5),
  review: z
    .string({ message: "Review must have min 30 chars and at max 250 chars" })
    .max(250)
    .min(30),
});

const ReviewModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<z.infer<typeof reviewModal>>({
    resolver: zodResolver(reviewModal),
    mode: "onChange",
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const queryClient = useQueryClient();
  const { profileSlug } = useParams();

  const rating = watch("rating");
  const [galleryItems, setGalleryItems] = useState<File[]>([]);
  const [galleryItemsError, setGalleryItemsError] = useState("");
  const review = watch("review");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitLoading(true);
    setSubmitError(null);

    // Get user id from session
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSubmitError("You must be signed in to leave a review.");
      setSubmitLoading(false);
      return;
    }

    const form = new FormData();
    form.append("rating", values.rating.toString());
    form.append("review", values.review);
    form.append("slug", profileSlug);
    galleryItems.forEach((file) => form.append("gallery", file));

    const { error } = await supabase.functions.invoke("review", {
      body: form,
    });

    setSubmitLoading(false);

    if (error) {
      setSubmitError(error.message || "Submission failed.");
      return;
    }

    // Optionally reset fields or close dialog
    onClose();
    await queryClient.invalidateQueries({
      queryKey: ["reviews", { slug: profileSlug as string }],
    });
  });

  // Memoize gallery information only (not JSX)
  const gallery = useMemo(
    () =>
      galleryItems.map((item) => ({
        url: URL.createObjectURL(item),
        isImage: item.type.startsWith("image"),
        name: item.name,
        type: item.type,
      })),
    [galleryItems],
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? null : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PenSquare className="size-5 mr-2" /> Write a review
          </DialogTitle>
          <div className="pb-3" />
          <Separator />
        </DialogHeader>
        <div className="space-y-5 p-1 pt-0 overflow-hidden">
          <div>
            <Label className="text-xs">Rating</Label>
            <div className="py-2 mt-1 px-3 rounded-full bg-white/5 w-fit">
              <RatingStars
                rating={rating}
                setRating={(rating) => setValue("rating", rating)}
                mode="write"
                size="size-[15px]"
              />
            </div>
          </div>
          <div>
            <Label id="review" className="text-xs">
              Upload Images or Videos
            </Label>
            <Textarea
              {...register("review")}
              id={"review"}
              rows={5}
              className="text-xs tracking-wide mt-1 max-h-[200px] border-0 bg-white/10 text-white/80"
              placeholder="Write your review"
            />
            <div className="flex justify-between items-baseline mt-[5px]">
              <span
                className={`text-xs font-light ${250 - review?.length < 0 ? "text-red-500" : "text-white/50"}`}
              >
                {250 - review.length} chars left
              </span>
              <span className="text-xs text-red-400">
                {errors?.review?.message}
              </span>
            </div>
          </div>
          <div>
            <Label htmlFor="gallery" className="text-xs">
              Upload Images or Videos
            </Label>

            <Input
              id="gallery"
              type="file"
              multiple={true}
              className="mt-1 bg-white/10 border-0"
              accept="image/png,image/jpg,image/jpeg,video/mp4"
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;

                if ((files.length || 0) + galleryItems.length > 10) {
                  setGalleryItemsError("Too many files uploaded");
                  return;
                }
                // Fix: limit each file max size to 2MB
                if (
                  !Array.from(files).every(
                    (file) => file.size <= 2 * 1024 * 1024,
                  )
                ) {
                  setGalleryItemsError("Each file must be less than 2MB");
                  return;
                }
                setGalleryItemsError("");
                setGalleryItems((prev) => [...prev, ...Array.from(files)]);
              }}
            />
            {galleryItemsError && (
              <div className="text-xs text-red-500">{galleryItemsError}</div>
            )}
            {/* Carousel row of attachments */}
            {gallery.length > 0 && (
              <div className="flex mt-5 gap-3 overflow-x-auto pb-2 pt-1 max-w-full">
                {gallery.map((file, idx) => (
                  <div
                    key={file.url}
                    className="relative w-[72px] h-[72px] rounded overflow-hidden flex-shrink-0 border border-neutral-700 bg-neutral-900"
                  >
                    {file.isImage ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="object-cover w-full h-full"
                        controls={false}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryItems((items) =>
                          items.filter((_, i) => i !== idx),
                        )
                      }
                      className="absolute top-1 right-1 z-10 bg-black/70 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white hover:bg-black/90"
                      aria-label="Remove"
                      tabIndex={0}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {submitError && (
            <div className="text-xs text-red-500">{submitError}</div>
          )}
          <Button
            size="sm"
            className="bg-white hover:bg-white/80 text-black/80"
            onClick={onSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Reviews = ({
  mode = "signed-out",
  reviews,
  hasMoreReviews = false,
  isLoadingViewMore,
  isLoading = true,
}: ReviewsProps) => {
  const [{ profileData }] = useClientProfile();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { data: profile } = useProfile();
  const { profileSlug } = useParams();
  const [{ user }] = useUser();

  const userRole = user?.data?.user?.user_metadata?.role;

  return (
    <div className="flex flex-col items-end w-full px-16 mx-auto">
      {mode === "professional-dashboard-public" && userRole === "client" && (
        <button
          className="rounded-full bg-white text-black px-3 py-2"
          onClick={() => setShowReviewDialog(true)}
        >
          Write a review
        </button>
      )}
      <ReviewModal
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
      />
      <div className="w-full bg-white/5 rounded-xl p-5 relative mt-10">
        <div
          style={{ display: isLoading ? "block" : "none" }}
          className="space-y-10"
        >
          <ReviewItemSkeleton />
          <ReviewItemSkeleton />
          <ReviewItemSkeleton />
        </div>
        <div
          className="size-full"
          style={{ display: isLoading ? "none" : "block" }}
        >
          <div className="font-profile-header text-white text-xl">
            {mode === "client-dashboard" ? "My Reviews" : "Reviews"}
          </div>
          {["professional-dashboard"].includes(mode) && (
            <Rating rating={4} numReviews={123} />
          )}
          <div className="w-[90%] space-y-10 mt-10">
            {reviews?.map((rev) => (
              <ReviewItem
                key={rev.id}
                mode={mode}
                review={rev}
                clientProfileId={rev?.client_profiles?.id}
                isUsersReview={rev?.client_profiles?.id === profile?.data?.id}
                fullName={rev?.client_profiles?.full_name}
                profileUrl={rev?.client_profiles?.profile_picture_url}
              />
            ))}

            <div className="flex justify-center"></div>
          </div>
          {(!reviews || !reviews?.length) && mode === "client-dashboard" && (
            <div className="w-full h-full space-y-10  relative">
              <div className="space-y-10 blur-sm  select-none pointer-events-none">
                <ReviewItem
                  key="dummy1"
                  mode={mode}
                  review={{
                    professional_id: "",
                    id: "dummy1",
                    rating: 5,
                    review:
                      "Outstanding service! Highly recommended to anyone who expects the best. The team was exceptionally attentive to every detail, keeping me informed from start to finish. Not only was the end result perfect, but the entire process was smooth, professional, and even enjoyable. I felt genuinely valued as a client, and I will absolutely use this service again for future projects.",
                    created_at: new Date().toISOString(),
                  }}
                  fullName="Jane Doe"
                  profileUrl="https://randomuser.me/api/portraits/women/44.jpg"
                />
                <ReviewItem
                  key="dummy2"
                  mode={mode}
                  f
                  review={{
                    professional_id: "",
                    id: "dummy2",
                    rating: 4,
                    review:
                      "Very good experience overall, just a minor hiccup. The staff was helpful and the project was completed on time, which I really appreciated. There was a small issue with communication in the middle, but once I raised it, the team responded promptly and made sure everything was addressed. I'm happy with the outcome and will consider coming back in the future.",
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                  }}
                  fullName="John Smith"
                  profileUrl="https://randomuser.me/api/portraits/men/32.jpg"
                />
                <ReviewItem
                  key="dummy3"
                  mode={mode}
                  review={{
                    professional_id: "",
                    id: "dummy3",
                    rating: 3,
                    review:
                      "It was okay, but there's room for improvement. While the service was delivered as promised, it sometimes felt like attention to detail was lacking. The team was friendly, however, and responded to my concerns. If a little more care was taken, I think this could easily become a top-tier service. For now, it's just average but shows potential.",
                    created_at: new Date(
                      Date.now() - 2 * 86400000,
                    ).toISOString(),
                  }}
                  fullName="Alex Kim"
                  profileUrl="https://randomuser.me/api/portraits/men/11.jpg"
                />
              </div>

              <div className="border border-neutral-800 max-w-[400px] absolute top-1/3 left-1/2 rounded-lg shadow-2xl -translate-x-1/2 -translate-y-1/4 w-2/3 text-center  p-5 bg-black/80 text-white">
                <div className="text-base font-medium flex items-center gap-2 w-fit mx-auto">
                  <LucideInfo className="size-4" /> No Reviews Found
                </div>
                <div className="text-white/50 text-sm mt-2 text-balance">
                  {mode === "client-dashboard"
                    ? "Search for experts, write a review and it will show up here."
                    : "Once this profile has reviews, they will show up here!"}
                </div>
              </div>
            </div>
          )}
        </div>
        {hasMoreReviews && (
          <div className="flex justify-center py-5">
            <Button
              disabled={isLoadingViewMore}
              size="sm"
              className="bg-white text-black rounded-full hover:bg-white hover:text-black hover:opacity-50 transition-all"
            >
              {isLoadingViewMore && (
                <Loader2 className="size-4 animate-spin mr-2" />
              )}
              View More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
