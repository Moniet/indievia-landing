export type InboxMessage = {
  id: string;
  created_at: string; // ISO 8601 timestamp
  message: string;
  subject: string;
  from_email: string;
  message_type: "bug_report" | "contact_form" | "help_and_support" | string;
  status: "open" | "closed" | "resolved" | string;
  has_been_read: boolean;
  user_id: string | null;
  full_name?: string | null;
  profile_picture_url?: string | null;
  slug?: string | null;
};
