import {
  CheckCircle2,
  CircleAlert,
  Facebook,
  Instagram,
  Loader2,
  Twitter,
  Youtube,
} from "lucide-react";
import Layout from "./Layout";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const postData = async (data: z.infer<typeof schema>) => {
  const { error } = await supabase.functions.invoke("contact_form", {
    body: data,
  });

  if (error) {
    throw error;
  }
};

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(5).max(2000),
  subject: z.string().min(5).max(200),
});

const GlobalFooter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      message: "",
      subject: "",
    },
  });
  const {
    isPending,
    isError,
    isSuccess,
    mutate: postContactForm,
  } = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      reset({
        email: "",
        message: "",
        subject: "",
      });
      toast.success("Successfully send message!");
    },
  });

  const onSubmit = handleSubmit((d) => {
    postContactForm(d);
  });

  return (
    <footer className=" text-white w-full max-w-[1600px] bg-[#0F0F0F] pt-20">
      <div className="container mx-auto flex flex-col lg:flex-row justify-start  items-start gap-20 max-md:px-0 py-16">
        <div className="bg-[#17181C] rounded-2xl md:min-w-[400px] p-5 md:p-10 flex-1 max-w-md flex flex-col h-fit justify-between">
          <div>
            <p className="uppercase text-[13px] tracking-widest text-brand/60 mb-3">
              got questions?
            </p>
            <h2 className="text-xl font-profile-header text-[#A1A1AA] font-normal text-balance">
              Need help or have feedback?
              <span className="text-white font-normal"> Drop us a message</span>
            </h2>
          </div>
          <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="email">
              Your Email
            </label>
            <input
              {...register("email", {
                required: true,
              })}
              id="email"
              type="email"
              required
              placeholder="Your Email"
              className="py-3 px-4 rounded-lg border border-[#27272A] bg-transparent text-white placeholder-[#A1A1AA] focus:outline-none focus:border-brand transition-all"
            />
            <label className="sr-only" htmlFor="subject">
              Subject
            </label>
            <input
              {...register("subject")}
              id="subject"
              required
              placeholder="Subject"
              className="py-3 px-4 rounded-lg border border-[#27272A] bg-transparent text-white placeholder-[#A1A1AA] focus:outline-none focus:border-brand transition-all"
            />
            <label className="sr-only" htmlFor="question">
              Message
            </label>
            <textarea
              {...register("message")}
              required
              placeholder="Question"
              rows={5}
              className="min-h-[150px] py-3 px-4 rounded-lg border border-[#27272A] bg-transparent text-white placeholder-[#A1A1AA] focus:outline-none focus:border-brand transition-all"
            />
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className={`${isSuccess ? "bg-green-500 hover:!bg-green-600 cursor-not-allowed" : "bg-brand"} hover:bg-[#db711a] text-sm text-white py-2 rounded-full mt-2 w-[100px] transition-all flex items-center justify-center gap-2 transition-color`}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isSuccess && <CheckCircle2 className="size-4" />}
              {isPending ? "Sending..." : isSuccess ? "Sent!" : "Send"}
            </button>
            {isError && (
              <div className="text-xs mt-2 text-red-500">
                Oops! Something went wrong, try again.
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-col justify-between h-full gap-20">
          <div className="flex flex-col md:flex-row flex-1 gap-10 justify-evenly w-full">
            <div className="flex justify-start gap-10 md:gap-16 w-full flex-wrap">
              <div className="min-w-[100px] md:min-w-[180px]">
                <h3 className="uppercase text-xs tracking-widest text-brand/60 mb-3">
                  Explore
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Find Professionals
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Write a Review
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Top Rated Pros
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Featured Profiles
                    </a>
                  </li>
                </ul>
              </div>
              <div className="min-w-[100px] md:min-w-[180px]">
                <h3 className="uppercase text-xs tracking-widest text-brand/60 mb-3">
                  For professionals
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Claim Your Profile
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      How It Works
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Resources
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div className="min-w-[100px] md:min-w-[180px]">
                <h3 className="uppercase text-xs tracking-widest text-brand/60 mb-3">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    <a className="hover:underline" href="#">
                      Terms of service
                    </a>
                  </li>
                </ul>
              </div>
              <div className="min-w-[100px] md:min-w-[180px]">
                <h3 className="uppercase text-xs tracking-widest text-brand/60 mb-3">
                  Contact us
                </h3>
                <div className="text-white/80 text-sm">
                  <div>+1 (999) 999-99-99</div>
                  <div>hello@logoipsum.com</div>
                  <div>Miami</div>
                </div>
              </div>
            </div>
            {/* Contact Info + Logo */}

            <img
              src={"/logo-with-text.png"}
              alt=""
              className="w-[80px] h-fit object-scale-down"
            />
          </div>
          <div className="flex space-x-8 mt-2 mb-4 md:mb-0">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:opacity-75 transition size-[40px] border border-white/50 rounded-full flex items-center justify-center"
            >
              <Facebook strokeWidth={1} className="text-white/80 size-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:opacity-75 transition size-[40px] border border-white/50 rounded-full flex items-center justify-center"
            >
              <Instagram strokeWidth={1} className="text-white/80 size-5" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:opacity-75 transition size-[40px] border border-white/50 rounded-full flex items-center justify-center"
            >
              <Youtube strokeWidth={1} className="text-white/80 size-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:opacity-75 transition size-[40px] border border-white/50 rounded-full flex items-center justify-center"
            >
              <Twitter strokeWidth={1} className="text-white/80 size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-end items-center pb-4">
        <div className="text-white/50 text-sm">&copy; 2025 — IndieVia LLC</div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
