import { Button } from "@/components/ui/button";
import { PropsWithChildren, useState } from "react";
import { useModeration } from "./useModeration";
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

export const ModerationBlock = ({
  report_id,
  review_id,
  onSuccess,
}: {
  report_id: string;
  review_id: string;
  onSuccess: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBlock = async () => {
    setIsLoading(true);

    try {
      await supabase.functions.invoke(`admin/moderation/block/${report_id}`, {
        method: "PATCH",
        body: {
          review_id,
        },
      });

      toast.success("Review has been blocked");
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
          variant="default"
          size="sm"
          className="rounded-full text-xs text-white/80"
        >
          Block Review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to block this review?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This review will be blocked and not viewable anymore on IndieVia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={isLoading || success} onClick={handleBlock}>
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            {isLoading ? "Loading..." : "Block Review"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
