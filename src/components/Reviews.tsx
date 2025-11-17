import { Reviews as TReviews } from "@/hooks/use-client-reviews";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "./RatingStars";
import { useClientProfile } from "@/hooks/use-client-profile";
import {
  AlertTriangleIcon,
  Flag,
  Loader2,
  LucideInfo,
  LucideShieldX,
  MessageSquare,
  PenSquare,
  Smartphone,
  ThumbsUp,
  Trash2,
  User2,
} from "lucide-react";
import { ProfessionalProfilePublicData } from "@/hooks/use-professional-profile-public";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis, PenIcon } from "lucide-react";
import { useReviewReply } from "@/hooks/use-review-reply";
import { ReportingReviewDialog } from "./ReportReviewDialog";
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

const EditReplyDialog = ({
  open,
  onOpenChange,
  review,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ProfessionalProfilePublicData["reviews"][0];
}) => {
  const [replyText, setReplyText] = useState(review.reply_text || "");
  const queryClient = useQueryClient();
  const { profileSlug } = useParams();

  const { editReply, isEditing, editError } = useReviewReply({
    onEdit: () => {
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
            {isEditing && <Loader2 className="size-4 animate-spin mr-2" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ReviewItem = ({
  mode,
  review,
  profileUrl,
  fullName,
  clientProfileId,
  professionalProfilePicture,
  isUsersReview = false,
}: {
  mode: ReviewsProps["mode"];
  review: ProfessionalProfilePublicData["reviews"][0];
  profileUrl: string;
  professionalProfilePicture?: string;
  fullName: string;
  isUsersReview?: boolean;
  clientProfileId: string;
}) => {
  const { profileSlug } = useParams();
  const queryClient = useQueryClient();
  const gallery = review?.gallery;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [{ user }] = useUser();
  const { data: profile } = useProfile();

  const isProfessional =
    user?.data?.user?.user_metadata?.role === "professional";
  const isOwnProfile = profile?.data?.slug === profileSlug;

  const {
    deleteReply,
    isDeleting: isDeletingReply,
    postReply,
    isLoading: isPostingReply,
  } = useReviewReply({
    onSubmit: () => {
      setIsReplying(false);
      setReplyText("");
    },
  });

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

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    postReply({ reply_to_id: review.id, reply_text: replyText });
  };

  return (
    <div className="flex gap-3 w-full">
      <EditReplyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        review={review}
      />
      <Link to={`/client/${clientProfileId}`}>
        <Avatar className="size-6 md:size-[35px] select-none pointer-events-none">
          <AvatarImage src={profileUrl} alt={`Picture of ${fullName}`} />
          <AvatarFallback>{fullName?.[0]}</AvatarFallback>
        </Avatar>
      </Link>

      {/*TODO: show badge if exists ^^ */}
      <div className="space-y-3 overflow-hidden">
        <div>
          <Link to={`/client/${clientProfileId}`}>
            <div className="flex gap-2 text-sm md:text-base items-center mb-1">
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
        <p
          className={`text-xs lg:text-sm leading-4 lg:leading-5 max-w-[500px] text-[#BDBDBD] text-pretty  ${review.is_blocked ? "blur-sm select-none" : ""}`}
        >
          {review.review}
        </p>
        {review.reply_text && (
          <div className="flex max-md:flex-col max-md:items-end items-center gap-2 pt-2">
            <div className="flex gap-2 border border-white/5 w-fit bg-white/5 rounded-lg p-2 md:items-center">
              <Avatar className="size-5 sm:size-6">
                <AvatarImage src={professionalProfilePicture} />
                <AvatarFallback>
                  <User2 className="size-3" />
                </AvatarFallback>
              </Avatar>
              <p
                className={`text-xs md:text-sm max-w-[500px] pr-1 text-white/80`}
              >
                {review.reply_text}{" "}
              </p>
            </div>
            {isProfessional && isOwnProfile && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="focus:ring-0 focus:outline-none rounded-full md:p-2 p-1 max-md:border">
                  <Ellipsis className="text-white/50 size-3 md:size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => setShowEditDialog(true)}
                      className="flex gap-2 py-1 px-2 text-xs items-center w-full"
                    >
                      <PenIcon className="size-3" />
                      <span>Edit</span>
                    </button>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex w-full hover:!bg-red-500 hover:text-white gap-2 text-xs items-center text-red-500 px-2 py-1.5 rounded-sm">
                        <Trash2 className="size-3" />
                        <span>Delete</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete your reply?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isDeletingReply}
                          onClick={() => {
                            if (review.reply_id) {
                              deleteReply(review.reply_id);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeletingReply && (
                            <Loader2 className="size-4 animate-spin" />
                          )}
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
        <div className="pt-2  flex justify-start items-center gap-2 w-full">
          {/*{mode === "professional-dashboard-public" &&
            user?.data?.user?.user_metadata?.role === "client" &&
            !isUsersReview && (
              <ReportingReviewDialog review_id={review.id + ""}>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs text-white/80 hover:bg-white/10 bg-white/5 rounded-full duration-300 font-light"
                >
                  <Flag className="size-3" strokeWidth={1.5} />
                  Report
                </Button>
              </ReportingReviewDialog>
            )}*/}

          {mode === "professional-dashboard-private" && !review?.reply_text && (
            <>
              {
                <ReportingReviewDialog review_id={review.id + ""}>
                  <Button
                    variant="ghost"
                    className="h-8 px-3 text-xs text-white/80 hover:bg-white/10 bg-white/5 rounded-full duration-300 font-light"
                  >
                    <Flag className="size-3" strokeWidth={1.5} />
                    Report
                  </Button>
                </ReportingReviewDialog>
              }
              <Button
                className="h-8 rounded-full px-4 text-xs bg-[#EE714E]  hover:bg-[#ED613A] transition-colors duration-300 font-light"
                onClick={() => setIsReplying((r) => !r)}
              >
                Reply
              </Button>
            </>
          )}
          {review.is_blocked && (
            <div className="border flex gap-1 font-medium items-center border-red-500/40 text-red-500 bg-red-500/20 p-2 rounded-full text-xs">
              <LucideShieldX className="size-4" /> This review has been blocked!
            </div>
          )}
          {(mode === "professional-dashboard-public" ||
            mode === "client-dashboard") &&
            isUsersReview && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-sm flex items-center font-light text-red-400 hover:text-red-500 ">
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
        {isReplying && (
          <div className="mt-3 p-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isPostingReply}
              className="w-full rounded-md bg-black/30 border border-white/10 text-sm text-white placeholder:text-white/40 p-3 outline-none focus:ring-2 focus:ring-brand"
              rows={3}
              placeholder="Write a public reply..."
            />
            <div className="mt-2 flex items-center gap-2">
              <Button
                onClick={handleSubmitReply}
                disabled={isPostingReply}
                className="h-8 px-4 text-xs bg-employIn-blue hover:bg-employIn-darkBlue"
              >
                {isPostingReply && <Loader2 className="size-4 animate-spin" />}
                Post reply
              </Button>
              <Button
                variant="ghost"
                disabled={isPostingReply}
                className="h-8 px-3 text-xs text-white/70 hover:bg-white/10"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
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
  professionalProfilePicture?: string;
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
  isPhoneVerified,
  hasAlreadyReviewed,
}: {
  open: boolean;
  onClose: () => void;
  isPhoneVerified: boolean;
  hasAlreadyReviewed: boolean;
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
      const errorBody = await error.context.json();
      setSubmitError(errorBody?.error || error.message || "Submission failed.");
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
        {!isPhoneVerified && (
          <>
            <Alert className="bg-white/5">
              <AlertTriangleIcon className="size-5 mr-2" />
              <AlertTitle>Verify your phone number</AlertTitle>
              <div className="mt-2">
                <AlertDescription>
                  <div>
                    In order to leave reviews and ratings, you are required to
                    verify your phone number.
                  </div>
                  <div className="flex">
                    <Button
                      size="sm"
                      asChild
                      className="w-fit mt-3"
                      variant="normal"
                    >
                      <Link to={"/auth/verify-phone"}>Verify Phone</Link>
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          </>
        )}
        {hasAlreadyReviewed && (
          <>
            <Alert className="bg-white/5">
              <AlertTriangleIcon className="size-5 mr-2" />
              <AlertTitle>Only one review per professional.</AlertTitle>
              <div className="mt-2">
                <AlertDescription>
                  <div>
                    You can only leave one review for each professional.
                    Alternatively, you can delete your review and create a new
                    one.
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          </>
        )}

        <div
          className={`space-y-5 p-1 pt-0 overflow-hidden ${
            hasAlreadyReviewed || !isPhoneVerified
              ? "blur-sm pointer-events-none select-none"
              : ""
          }`}
        >
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
                className={`text-xs font-light ${
                  250 - review?.length < 0 ? "text-red-500" : "text-white/50"
                }`}
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
                      disabled={!isPhoneVerified}
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
  professionalProfilePicture,
  isLoading = true,
  onClickViewMore,
}: ReviewsProps) => {
  useClientProfile();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { data: profile } = useProfile();
  const [{ user }] = useUser();
  const hasAlreadyReviewed = reviews?.some(
    (rev) => rev.client_id === profile?.data?.id,
  );

  const userRole = user?.data?.user?.user_metadata?.role;
  const isPhoneVerified = !user?.data?.user?.user_metadata?.phone_verified; //TODO: important to undo boolean

  return (
    <div className="flex flex-col items-end w-full mx-auto">
      {mode === "professional-dashboard-public" && userRole === "client" && (
        <button
          className="rounded-full bg-white text-black px-3 py-2"
          onClick={() => setShowReviewDialog(true)}
        >
          Write a review
        </button>
      )}
      <ReviewModal
        hasAlreadyReviewed={hasAlreadyReviewed}
        isPhoneVerified={isPhoneVerified}
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
      />
      <div className="w-full bg-white/5 rounded-xl p-3 py-5 md:p-5 relative mt-10">
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
                key={rev.id || rev.client_id}
                mode={mode}
                review={rev}
                clientProfileId={rev.client_id}
                isUsersReview={rev.isUserReview}
                fullName={
                  rev?.client_profiles?.full_name || rev?.client_full_name
                }
                professionalProfilePicture={professionalProfilePicture}
                profileUrl={
                  rev?.client_profiles?.profile_picture_url ||
                  rev?.client_profile_picture
                }
              />
            ))}

            <div className="flex justify-center"></div>
          </div>
          {!reviews?.length && (
            <div className="w-full h-full space-y-10  relative">
              <div className="space-y-10 blur-sm  select-none pointer-events-none">
                <ReviewItem
                  key="dummy1"
                  mode={mode}
                  review={{
                    id: 1,
                    rating: 5,
                    review:
                      "Outstanding service! Highly recommended to anyone who expects the best. The team was exceptionally attentive to every detail, keeping me informed from start to finish. Not only was the end result perfect, but the entire process was smooth, professional, and even enjoyable. I felt genuinely valued as a client, and I will absolutely use this service again for future projects.",
                    created_at: new Date().toISOString(),
                    userId: "dummy-user-1",
                    client_id: "dummy-client-1",
                    client_profiles: {
                      full_name: "Jane Doe",
                      profile_picture_url:
                        "https://randomuser.me/api/portraits/women/44.jpg",
                    },
                  }}
                  clientProfileId="dummy-client-1"
                  fullName="Jane Doe"
                  profileUrl="https://randomuser.me/api/portraits/women/44.jpg"
                />
                <ReviewItem
                  key="dummy2"
                  mode={mode}
                  review={{
                    id: 2,
                    rating: 4,
                    review:
                      "Very good experience overall, just a minor hiccup. The staff was helpful and the project was completed on time, which I really appreciated. There was a small issue with communication in the middle, but once I raised it, the team responded promptly and made sure everything was addressed. I'm happy with the outcome and will consider coming back in the future.",
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    userId: "dummy-user-2",
                    client_id: "dummy-client-2",
                    client_profiles: {
                      full_name: "John Smith",
                      profile_picture_url:
                        "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                  }}
                  clientProfileId="dummy-client-2"
                  fullName="John Smith"
                  profileUrl="https://randomuser.me/api/portraits/men/32.jpg"
                />
                <ReviewItem
                  key="dummy3"
                  mode={mode}
                  review={{
                    id: 3,
                    rating: 3,
                    review:
                      "It was okay, but there's room for improvement. While the service was delivered as promised, it sometimes felt like attention to detail was lacking. The team was friendly, however, and responded to my concerns. If a little more care was taken, I think this could easily become a top-tier service. For now, it's just average but shows potential.",
                    created_at: new Date(
                      Date.now() - 2 * 86400000,
                    ).toISOString(),
                    userId: "dummy-user-3",
                    client_id: "dummy-client-3",
                    client_profiles: {
                      full_name: "Alex Kim",
                      profile_picture_url:
                        "https://randomuser.me/api/portraits/men/11.jpg",
                    },
                  }}
                  clientProfileId="dummy-client-3"
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
        {!!hasMoreReviews && (
          <div className="flex justify-center py-5">
            <Button
              onClick={onClickViewMore}
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
