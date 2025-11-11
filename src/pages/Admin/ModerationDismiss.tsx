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

export const ModerationDismiss = ({
  report_id,
  onSuccess,
}: PropsWithChildren<{ report_id: string; onSuccess: () => void }>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleIgnore = async () => {
    setIsLoading(true);

    try {
      await supabase.functions.invoke(`admin/moderation/ignore/${report_id}`, {
        method: "PATCH",
      });
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
          variant="ghost"
          className="rounded-full text-xs text-white/80"
        >
          Dismiss
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to dismiss this report?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This report will be dismissed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={isLoading} onClick={handleIgnore}>
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            {isLoading ? "Loading..." : "Dismiss report"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
