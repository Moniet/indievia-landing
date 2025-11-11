import { AnimatePresence, motion } from "framer-motion";
import { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import useUser from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { Bug, CheckCheckIcon, Flag, Loader2 } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SuccessScreen = () => {
  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Empty className="border bg-white/5">
        <div className="p-1 border rounded">
          <CheckCheckIcon />
        </div>
        <EmptyHeader>
          <EmptyTitle>Your message has been sent!</EmptyTitle>
          <EmptyDescription>
            We'll get back to you as soon as possible!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </motion.div>
  );
};

const zodSchema = z.object({
  message: z
    .string({ message: "Please include a message" })
    .min(50, { message: "Message must have at least 50 characters" })
    .max(2000, { message: "Only 2000 characters allowed" }),
  subject: z
    .string({ message: "Please add a subject line" })
    .min(10, { message: "Subject is too short" })
    .max(250, {
      message: "Subejct is too long (only 250 characters allowed).",
    }),
});

export const ContactMessage = ({
  children,
  mode,
}: PropsWithChildren<{
  mode: "bug_report" | "help_and_support";
}>) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid, errors },
  } = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
  });
  const [{ user }] = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    if (!isValid) {
      return;
    }

    const formData = watch();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "in_app_contact",
        {
          body: {
            ...formData,
            email: user?.data?.user?.email,
            message_type: mode,
          },
        },
      );

      console.log();
      if (data) {
        setSuccess(true);
      } else if (error) {
        setError("Oops! Something went wrong, try again.");
      }
    } catch (e) {
      setError("Oops! Something went wrong, try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            {mode === "bug_report" ? (
              <Bug className="size-5" />
            ) : (
              <Flag className="size-5" />
            )}
            {mode === "bug_report" ? "Report a bug" : "Help and support"}
          </DialogTitle>
          <DialogDescription>
            {mode === "bug_report" &&
              "Let us know what's broken, we'll work on a fix asap!"}
            {mode === "help_and_support" &&
              "Let us know what's wrong, and we'll get back to you asap"}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <AnimatePresence mode="popLayout">
          {!success && (
            <motion.div
              exit={{ y: -20, opacity: 0, transition: { duration: 0.5 } }}
              initial={{ y: 0, opacity: 1 }}
              className="mt-2"
            >
              <div>
                <form className="space-y-5">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      {...register("subject", { required: true })}
                      placeholder="e.g: Feature request, Slow loading, SEO issues etc."
                    />
                    <span className="text-xs font-light text-red-500 mt-2">
                      {errors?.subject?.message}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      {...register("message", { required: true })}
                      placeholder="e.g: Feature request, Slow loading, SEO issues etc."
                    />
                    <span className="text-xs font-light text-red-500 mt-2">
                      {errors?.message?.message}
                    </span>
                  </div>
                </form>
              </div>
              <span className="text-xs font-light text-red-500 mt-2">
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {success && <SuccessScreen />}
        </AnimatePresence>
        <DialogFooter className="mt-5 gap-1">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!success && (
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Loading
                </>
              ) : (
                "Send"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
