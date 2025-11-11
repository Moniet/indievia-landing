import { GalleryVerticalEnd, Loader2 } from "lucide-react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import useUser from "@/hooks/use-user";

export function PhoneNumber({
  className,
  next,
  phone,
  setPhone,
  ...props
}: React.ComponentProps<"div"> & {
  next: () => void;
  phone: string;
  setPhone: (string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [{ user }, isLoadingUser] = useUser();

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isLoadingUser) return;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      next();
    } catch (err) {
      toast("Oops! something went wrong, try again");
      console.error(err);
    }
  };

  return (
    <div
      className={cn(
        "flex w-[480px] flex-col items-center pt-10 gap-6",
        className,
      )}
      {...props}
    >
      <div className="space-y-6 py-20 bg-white/5 rounded-lg border border-white/10">
        <form
          className="flex flex-col items-center w-[350px] mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <img
              src="/indievia-text-logo.png"
              className="w-[100px] mb-1"
              alt=""
            />
            <h1 className="text-xl font-bold">Enter phone number</h1>
            <FieldDescription>
              We will send a 6-digit code for verification.
            </FieldDescription>
          </div>

          <Input
            className="mt-5"
            type="tel"
            required
            placeholder="e.g: 1532345123"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />

          <Button className="mt-5 w-full" type="submit">
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading ? "Sending code.." : "Send"}
          </Button>
        </form>
        <FieldDescription className="px-6 mx-auto text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  );
}
