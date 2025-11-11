import { supabase } from "@/integrations/supabase/client";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { ProfessionalProfilePublicData } from "./use-professional-profile-public";

type TReview = ProfessionalProfilePublicData["reviews"][0];

export const useReviewReply = (args?: {
  onSubmit?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { profileSlug } = useParams();
  const queryKey = ["reviews", { slug: profileSlug as string }];

  type TReviewsPage = {
    reviews: TReview[];
    nextPage: number | null;
  };

  const {
    mutate: postReply,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async ({
      reply_to_id,
      reply_text,
    }: {
      reply_to_id: string;
      reply_text: string;
    }) => {
      const { error, data } = await supabase.functions.invoke(
        "/review_replies",
        {
          body: {
            reply_to_id,
            reply_text,
          },
        },
      );
      if (error) {
        throw new Error(error.message || "Oops! Failed to post reply.");
      }
      return data;
    },
    onMutate: async (newReply) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews =
        queryClient.getQueryData<InfiniteData<TReviewsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<TReviewsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((review) =>
              review.id === newReply.reply_to_id
                ? {
                    ...review,
                    reply_text: newReply.reply_text,
                    reply_id: "temp-id",
                  }
                : review,
            ),
          })),
        };
      });

      return { previousReviews };
    },
    onError: (err, newReply, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
      toast.error(
        err.message ||
          "Oops! Failed to post reply. Try again, or contact us if it the issue persists.",
      );
    },
    onSuccess: () => {
      args?.onSubmit?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const {
    mutate: deleteReply,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke(
        "/review_replies/" + id,
        {
          method: "DELETE",
        },
      );
      if (error)
        throw new Error(error.message || "Oops! Failed to delete reply.");
    },
    onMutate: async (deletedReplyId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews =
        queryClient.getQueryData<InfiniteData<TReviewsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<TReviewsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((review) =>
              review.reply_id === deletedReplyId
                ? {
                    ...review,
                    reply_text: null,
                    reply_id: null,
                  }
                : review,
            ),
          })),
        };
      });

      return { previousReviews };
    },
    onError: (err, deletedReplyId, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
      toast.error(
        err.message || "Oops! there was an issue when deleting your reply.",
      );
    },
    onSuccess: () => {
      args?.onDelete?.();
      toast("Reply has been deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const {
    mutate: editReply,
    isPending: isEditing,
    error: editError,
  } = useMutation({
    mutationFn: async ({
      id,
      reply_text,
    }: {
      id: string;
      reply_text: string;
    }) => {
      const { error } = await supabase.functions.invoke(
        "/review_replies/" + id,
        {
          method: "PATCH",
          body: {
            reply_text,
          },
        },
      );
      if (error)
        throw new Error(error.message || "Oops! Failed to edit reply.");
    },
    onMutate: async (updatedReply) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews =
        queryClient.getQueryData<InfiniteData<TReviewsPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<TReviewsPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.reviews.map((review) =>
              review.reply_id === updatedReply.id
                ? {
                    ...review,
                    reply_text: updatedReply.reply_text,
                  }
                : review,
            ),
          })),
        };
      });

      return { previousReviews };
    },
    onError: (err, updatedReply, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
      toast.error(
        err.message || "Oops! there was an issue when editing your reply.",
      );
    },
    onSuccess: () => {
      args?.onEdit?.();
      toast("Reply has been updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    postReply,
    isLoading,
    error,
    deleteReply,
    isDeleting,
    deleteError,
    editReply,
    isEditing,
    editError,
  };
};
