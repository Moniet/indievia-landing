import { GalleryVerticalEnd } from "lucide-react";

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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormEventHandler } from "react";

export function OTPForm({
  className,
  phone,
  ...props
}: React.ComponentProps<"div"> & { prev: () => void; phone: string }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.verifyOtp({
      type: "sms",
      phone,
      token: otp,
    });

    if (error) setError(error?.message);
    else setError("");
  };
  return (
    <div className={cn("flex flex-col pt-32 gap-6", className)} {...props}>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center">
          <img
            src="/indievia-text-logo.png"
            className="w-[100px] mb-1"
            alt=""
          />
          <h1 className="text-xl font-bold">Enter verification code</h1>
          <FieldDescription>
            We sent a 6-digit code to your phone number
          </FieldDescription>
        </div>
        <InputOTP
          required
          maxLength={6}
          containerClassName="mt-5"
          onChange={setOtp}
        >
          <InputOTPGroup>
            <InputOTPSlot className="h-12 bg-white/5 w-12" index={0} />
            <InputOTPSlot className="h-12 bg-white/5 w-12" index={1} />
            <InputOTPSlot index={2} className="h-12 bg-white/5 w-12" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot className="h-12 bg-white/5 w-12" index={3} />
            <InputOTPSlot className="h-12 bg-white/5 w-12" index={4} />
            <InputOTPSlot className="h-12 bg-white/5 w-12" index={5} />
          </InputOTPGroup>
        </InputOTP>
        {error && <div className="text-red-500 text-xs mt-4">{error}</div>}
        <Button className="mt-5 w-[325px]" type="submit">
          Verify
        </Button>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
