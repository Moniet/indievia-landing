import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, LucideInfo } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function AdminSignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke("admin/sign-in", {
        body: {
          email,
        },
      });

      if (error || data?.error) {
        const ctx = await error.context.json();
        console.log({ ctx });
        const message =
          ctx?.error ||
          error?.message ||
          data?.error ||
          "Sign in failed. Please try again.";
        setError(message);
        toast.error(message);
      } else {
        setError("");
        setSuccess(true);
        toast.success("Magic link sent to your email");
      }
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : "Failed to connect to authentication server.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-neutral-800 rounded-lg p-4 sm:p-6 md:p-7">
      <div
        className={cn("mt-6 sm:mt-7 flex flex-col gap-5 sm:gap-6", className)}
        {...props}
      >
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <img src="/logo-with-text.png" className="w-20 mb-2" />
              <h1 className="text-lg sm:text-xl font-bold">
                Welcome to IndieVia
              </h1>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <Field>
              <Button
                disabled={loading}
                type="submit"
                className="w-full sm:w-auto bg-brand hover:bg-brand/80"
              >
                {loading && (
                  <Loader2 className="animate-spin duration-2000 size-4 mr-2" />
                )}
                {loading ? "Loading ..." : "Sign In"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
        {success && (
          <Alert className="bg-white/5">
            <Sparkles className="size-4" />
            <AlertTitle>Magic link sent to your email</AlertTitle>
            <AlertDescription>
              Click on the link to sign in! Easy as pie 🥧. You will the email
              only receive if you're an admin.
            </AlertDescription>
          </Alert>
        )}
        <FieldDescription className="px-4 sm:px-6 text-amber-500 text-center text-balance flex justify-center items-center">
          <LucideInfo className="size-4 mr-2 animate-bounce" /> You must be an
          administrator to sign in.
        </FieldDescription>
      </div>
    </div>
  );
}
