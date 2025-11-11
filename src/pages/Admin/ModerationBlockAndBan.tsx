import { Button } from "@/components/ui/button";
import { PropsWithChildren, useState } from "react";
import { useModeration, Report } from "./useModeration";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ModerationBlockAndBan = ({
  report_id,
  ban_user,
  review_id,
  status,
  onSuccess,
}: {
  report_id: string;
  review_id: string;
  status: Report["status"];
  ban_user: { client_id: string };
  onSuccess: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBlock = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke(
        `admin/moderation/block/${report_id}`,
        {
          method: "PATCH",
          body: {
            ban_user,
            review_id,
          },
        },
      );

      if (error) {
        throw error;
      }

      toast.success("User & Review have been blocked");
      setSuccess(true);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-full text-xs text-white/80"
        >
          Ban User{" "}
          {status !== "blocked" ? <>&amp; Block Review</> : "From Commenting"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to ban this user?{" "}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will block the user from making future comments and
            unpublish the offending comment (if not unpublished).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading || success}
            onClick={handleBlock}
          >
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            {isLoading ? "Loading..." : "Block User & Review"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
