import { supabase } from "@/integrations/supabase/client";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import useUser from "./use-user";

export type NotificationItem =
  | {
      id: string;
      notif_type: "new_review";
      has_been_read: boolean;
      professional_id: string;
      metadata: {
        review_made_by_user: string;
      };
    }
  | {
      id: string;
      notif_type: "review_report";
      has_been_read: false;
      with_admin: true;
      metadata: {
        analysis: string;
        review_id: string;
        reported_by_ai: boolean;
      };
    }
  | {
      id: string;
      client_id: string;
      notif_type: "review_reply";
      has_been_read: false;
      metadata: {
        professional_id: string;
        profile_picture_url: string;
        slug: string;
        reply_text: string;
      };
    }
  | {
      id: string;
      client_id: string;
      notif_type: "review_blocked";
      has_been_read: boolean;
      metadata: {
        full_name: string;
      };
    }
  | {
      id: string;
      client_id: string;
      notif_type: "user_ban";
      has_been_read: boolean;
    }
  | {
      id: string;
      professional_id: string;
      notif_type: "reported_review_blocked";
      has_been_read: boolean;
    }
  | {
      id: string;
      professional_id: string;
      notif_type: "user_banned_review_blocked";
      has_been_read: false;
      metadata: {
        banned_user: {
          full_name: string;
        };
      };
    };

const fetchNotifs = () =>
  supabase.functions
    .invoke("notifications", { method: "GET" })
    .then(
      (d) =>
        d.data as {
          notifications: (NotificationItem & { created_at: string })[];
        },
    );

export const useNotifications = () => {
  const [{ user }] = useUser();
  const { data, ...rest } = useQuery({
    queryKey: ["notifs"],
    queryFn: fetchNotifs,
    enabled: !!user,
  });

  return { ...rest, notifications: data?.notifications };
};
