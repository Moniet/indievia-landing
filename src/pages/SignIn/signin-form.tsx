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

import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"client" | "pro">("client");

  const handleSignup: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke("sign-in", {
        body: {
          email,
          redirectTo: window.location.origin + "/auth/confirm",
        },
      });

      if (error || data?.error) {
        const message =
          error?.message || data?.error || "Sign in failed. Please try again.";
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
    <div className="border border-neutral-800 rounded-lg p-7">
      <div className="w-full h-12 bg-white/5 mb-5 rounded-lg flex items-center justify-center p-1">
        <button
          onClick={() => setMode("client")}
          className={`transition-colors duration-300 flex-1 cursor-pointer tracking-wide flex items-center justify-center rounded-sm h-full text-center text-sm ${mode === "client" ? "bg-white/10 text-white" : ""}`}
        >
          Client
        </button>
        <button
          onClick={() => setMode("pro")}
          className={`transition-colors duration-300 flex-1 cursor-pointer tracking-wide flex items-center justify-center rounded-sm h-full text-center text-sm ${mode === "pro" ? "bg-white/10 text-white" : ""}`}
        >
          Professional
        </button>
      </div>
      <div className={cn("mt-7 flex flex-col gap-6", className)} {...props}>
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-xl font-bold">Welcome to IndieVia</h1>
              <FieldDescription className="text-prety">
                Enter your email and we'll send a magic link to sign in. If you
                don't have an account,{" "}
                <Link to="/sign-up" className="hover:!text-brand/70">
                  click here to sign up.
                </Link>
              </FieldDescription>
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
                className="bg-brand hover:bg-brand/80"
              >
                {loading && (
                  <Loader2 className="animate-spin duration-2000 size-4 mr-2" />
                )}
                {loading ? "Loading ..." : "Sign In"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <FieldDescription className="px-6 text-center text-balance">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  );
}
