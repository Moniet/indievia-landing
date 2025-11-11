import {
  AlertCircleIcon,
  BellIcon,
  CheckCheck,
  CheckCircle2,
  Loader2,
  LucideCheckSquare2,
  LucideFileWarning,
  LucideFlame,
  LucideMessageCircleWarning,
  PenLineIcon,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationItem, useNotifications } from "@/hooks/use-notifications";
import { Empty, EmptyHeader, EmptyTitle } from "./ui/empty";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FetchingIndicator } from "@/pages/Admin/FetchingIndicator";

const Loading = () => {
  return (
    <div className="h-32">
      <div className="p-2 rounded-lg border border-white/10 flex items-center">
        <div>
          <Loader2 className="animate-spin mr-2" />
        </div>{" "}
        Loading ...
      </div>
    </div>
  );
};

const Notif = ({ notif }: { notif: NotificationItem }) => {
  const nav = useNavigate();
  const Icon = (() => {
    switch (notif.notif_type) {
      case "new_review":
      case "review_reply":
        return PenLineIcon;
      case "review_report":
        return LucideFileWarning;
      case "review_blocked":
        return LucideMessageCircleWarning;
      case "user_banned_review_blocked":
        return LucideMessageCircleWarning;
      case "user_ban":
        return LucideFlame;
      default:
        return AlertCircleIcon;
    }
  })();

  const bodyText = (() => {
    if (notif.notif_type === "reported_review_blocked")
      return `The review you reported has been blocked by moderators!`;
    if (notif.notif_type === "user_banned_review_blocked")
      return `The reported review ${notif.metadata.banned_user.full_name} has been blocked by moderators!`;
    if (notif.notif_type === "user_ban")
      return "You have been banned from making comments on IndieVia.";
    if (notif.notif_type === "review_blocked")
      return `The review you made on ${notif.metadata.full_name}'s profile has been blocked!`;
    if (notif.notif_type === "new_review")
      return `A new review was made on your profile!`;
    if (notif.notif_type === "review_reply")
      return `Someone replied: ${notif.metadata.reply_text.slice(0, 20)}...`;
    return "New review was reported";
  })();

  const handleClick = () => {
    switch (notif.notif_type) {
      case "review_reply":
        return nav(`/professional/${notif.metadata.slug}`);
      case "new_review":
        return nav("/professional/dashboard/manage-reviews");
    }
  };

  return (
    <div>
      <div
        className="flex gap-2 hover:bg-blue-600/20 items-start cursor-pointer border p-2 rounded-lg border-white/5"
        onClick={handleClick}
      >
        <div className="size-8 flex items-center justify-center border border-white/10 rounded-lg bg-white/5">
          {notif.notif_type === "review_reply" ? (
            <img
              src={notif.metadata.profile_picture_url}
              className="size-full object-cover rounded-lg"
            />
          ) : (
            <Icon className="size-4" />
          )}
        </div>
        <div>
          <div className="text-xs">{bodyText}</div>
        </div>
      </div>
    </div>
  );
};

export const Notifications = () => {
  const {
    notifications = [],
    isLoading,
    refetch,
    isFetching,
  } = useNotifications();
  const count = notifications?.length;
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () =>
      supabase.functions
        .invoke("notifications/read", {
          method: "PATCH",
          body: {
            notification_ids: notifications.map((n) => n.id),
          },
        })
        .then(({ error }) => {
          if (error) {
            throw error;
          }
        }),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div>
      <DropdownMenu>
        <div className="flex items-center">
          {count > 0 && (
            <div className="w-0 h-0 overflow-visible relative z-10 pointer-events-none select-none">
              <div className="size-[12px] md:size-[14px] flex font-medium rounded-full bg-red-500 text-white text-[6px] md:text-[8px] translate-x-2/3 -translate-y-4">
                <span className="m-auto">{count}</span>
              </div>
            </div>
          )}
          <DropdownMenuTrigger className="relative outline-none">
            <BellIcon className="size-4 md:size-5 fill-black pointer-events-none" />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="flex flex-col justify-center h-fit p-3 max-w-[300px]">
          {isLoading && <Loading />}
          {!isLoading && !notifications?.length && (
            <Empty>
              <EmptyHeader>
                <div className="p-2 border border-white/10 rounded-md">
                  <Search className="size-4 md:size-5" />
                </div>
                <EmptyTitle>No unread notifications</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
          <div className="flex flex-col gap-2">
            {notifications?.map((notif) => (
              <Notif notif={notif} key={notif.id} />
            ))}
          </div>

          {notifications?.length > 0 && (
            <>
              <div className="py-4">
                <Separator />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => mutate()}
                disabled={isPending}
                className="!text-xs font-medium bg-white/5"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin  mr-2" />
                    Marking all as read ...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2" />
                    Marked as read!
                  </>
                ) : (
                  <>
                    <LucideCheckSquare2 />
                    Mark all as read
                  </>
                )}
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isFetching && <FetchingIndicator />}
    </div>
  );
};
