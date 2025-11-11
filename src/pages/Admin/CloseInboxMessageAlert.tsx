import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const closeTicket = async ({ report_id, refetch }) => {
  const { data, error } = await supabase.functions.invoke(
    `admin/inbox/${report_id}/status/closed`,
    {
      method: "PATCH",
    },
  );

  if (data?.error || error) {
    throw data.error || error;
  }

  toast.success("Closed ticket!");

  await refetch();

  return data;
};

export const CloseInboxMessageAlert = ({
  title,
  ctaLabel,
  report_id,
  refetch,
}: {
  title: string;
  ctaLabel: string;
  report_id: string;
  refetch: () => void;
}) => {
  const {
    isError,
    isPending: isLoading,
    isSuccess: success,
    mutate,
  } = useMutation({
    mutationFn: closeTicket,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="normal"
          size="sm"
          className="rounded-full bg-white/5 text-white text-xs px-5"
        >
          Close
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This ticket will be marked as closed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isError && (
          <div className="text-sm text-red-500">
            Oops! Something went wrong!
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={isLoading || success}
            onClick={() => mutate({ report_id, refetch })}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin size-4 mr-2" />
                Processing ...
              </>
            ) : (
              ctaLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
