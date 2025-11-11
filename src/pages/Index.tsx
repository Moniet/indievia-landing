import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import { Link } from "react-router-dom";
import { SearchInput } from "./Search/Search";
import { FeaturedArtists } from "./Landing/FeaturedArtists";
import GlobalFooter from "@/components/Footer";
import { InfoSection } from "./Landing/InfoSection";
import { RecentReviews } from "./Landing/RecentReviews";
import { LandingAbout } from "./Landing/LandingAbout";

const ArrowRight = () => {
  return (
    <svg
      width="13"
      height="7"
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.88021 0.617188L11.5469 3.28385M11.5469 3.28385L8.88021 5.95052M11.5469 3.28385L0.880208 3.28385"
        stroke="#B8633F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Hero = ({
  prefillEmail,
  setPrefillEmailAndScroll,
  subscriberCount,
}: {
  prefillEmail: string;
  setPrefillEmailAndScroll: (email: string) => void;
  subscriberCount: number | null;
}) => {
  const [email, setEmail] = useState("");

  // Update if prop changes (for reset)
  React.useEffect(() => {
    if (!prefillEmail) setEmail("");
  }, [prefillEmail]);

  const handleJoinClick = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefillEmailAndScroll(email.trim());
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <motion.form
        layout="position"
        className="flex max-sm:flex-col items-center justify-start sm:justify-center gap-3 mt-8 max-sm:w-full "
        onSubmit={handleJoinClick}
        autoComplete="off"
      >
        <input
          type="email"
          className="border w-[250px] sm:w-[280px] border-[#323232] font-light rounded-full px-7 h-[50px] placeholder:text-zinc-100/30 bg-transparent outlin-none focus:outline-none focus-visible:outline-none focus:border-zinc-100/70 text-sm"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="max-sm:w-[250px] w-[150px] font-extralight max-sm:mb-5 text-sm gap-2 pl-4 p-[5px] h-[50px] rounded-full bg-[#282828] flex items-center justify-center whitespace-nowrap sm:text-center relative"
        >
          <span className="flex-1 text-left max-sm:pl-3">Join waitlist</span>
          <span className="inline-block size-[40px] ml-auto absolute top-[5px] right-[5px]">
            <svg
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.3828" cy="20.207" r="20" fill="#B8633F" />
              <path
                d="M18.7832 15.9072H24.6494L24.6729 15.917C24.6792 15.9233 24.6826 15.9317 24.6826 15.9404V21.8076C24.6824 21.8258 24.6677 21.8408 24.6494 21.8408C24.6312 21.8407 24.6164 21.8258 24.6162 21.8076V16.0215L23.7627 16.875L16.6729 23.9639C16.6663 23.9704 16.658 23.9737 16.6494 23.9736L16.626 23.9639C16.6195 23.9573 16.6162 23.9489 16.6162 23.9404L16.626 23.917L24.5693 15.9736H18.7832C18.7648 15.9736 18.75 15.9588 18.75 15.9404C18.7501 15.9221 18.7648 15.9072 18.7832 15.9072Z"
                fill="#09090B"
                stroke="#E4E4E7"
              />
            </svg>
          </span>
        </button>
      </motion.form>

      <motion.div layout="position" className="flex items-center">
        <img
          src="/avatar-group-hero-section.png"
          alt=""
          className="h-8 w-auto"
        />
        <div className="border-l border-zinc-100/50 mx-5 h-5 my-auto" />
        <motion.div className="text-sm font-extralight text-[#d7d7d7]" layout>
          {typeof subscriberCount === "number" ? (
            `${subscriberCount.toLocaleString()}`
          ) : (
            <div className="h-4 w-[5ch] bg-neutral-600 animate-pulse rounded inline-block align-middle" />
          )}{" "}
          <motion.span layout="position" transition={{ duration: 0.5 }}>
            artists and clients joined the waitlist
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

const useSubscribe = ({
  mode,
  onAfterSubscribe,
}: {
  mode: "professional" | "client";
  onAfterSubscribe?: () => void;
}) => {
  const [data, setData] = useState<{
    email: string;
    firstName: string;
    industry: string;
  }>({
    industry: "",
    firstName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Listen for a CustomEvent to update email
  React.useEffect(() => {
    function handlePrefillEmail(e: Event) {
      if (
        (e as CustomEvent).detail &&
        typeof (e as CustomEvent).detail.email === "string"
      ) {
        setData((d) => ({
          ...d,
          email: (e as CustomEvent).detail.email,
        }));
      }
    }
    window.addEventListener("prefill-footer-email", handlePrefillEmail);
    return () =>
      window.removeEventListener("prefill-footer-email", handlePrefillEmail);
  }, []);

  const onFormChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    if (["firstName", "industry", "email"].includes(name)) {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    // Check terms checkbox:
    const termsAccepted = (document.querySelector("#terms") as HTMLInputElement)
      .dataset.state;

    if (termsAccepted !== "checked") {
      toast.error("You must accept the terms to join the waitlist.");
      return;
    }

    const body = data;
    if (mode === "client") {
      body.industry = "client";
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://mfebhamkxngghywfgfac.supabase.co/functions/v1/early-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      if (res.ok) {
        toast("Sign Up Success!", {
          description:
            "You will receive updates in a few weeks when we release IndieVia",
        });
        setData({
          industry: "",
          firstName: "",
          email: "",
        });
        if (onAfterSubscribe) {
          onAfterSubscribe();
        }
      } else {
        const resp = await res.json();
        console.error(resp.errors);
        toast.error("Uh oh!", {
          description: "There was an error when signing up!",
        });
      }
    } catch (e) {
      toast.error("Uh oh!", {
        description: "There was an error when signing up!",
      });
      console.error(e);
    }

    setIsLoading(false);
  };

  return {
    formData: data,
    onFormChange,
    onSubmit,
    isLoading,
  };
};

const MasonryLayout = () => {
  return (
    <div className="flex flex-col gap-5 mt-40 flex-wrap">
      <div className="flex gap-5 flex-wrap">
        <div className="bg-[#131313] rounded-lg px-5 py-8 flex flex-[2] items-center justify-center">
          <div className="relative w-[240px] h-[225px]">
            <div
              className="bg-white/70 top-0 left-0 absolute w-full h-full rounded-md -rotate-[5deg] "
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.1)" }}
            />
            <div
              className="bg-white/30 top-0 left-0 absolute w-full rounded-md rotate-[2deg] ml-1"
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.2)" }}
            />
            <div
              className="w-full h-full min-h-fit bg-[#FFFDFA] rounded-md -rotate-[1deg] p-2"
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            >
              <div className="h-fit rounded-lg overflow-hidden w-full">
                <img
                  src="/bento-picture-of-woman.png"
                  className="w-full h-auto lg:scale-[1.06] [transform-origin:center_center]"
                />
              </div>
              <div className="text-black text-sm mt-2">
                Gaby M. | 146 reviews
              </div>
              <div className="text-sm mt-1 text-[#8b8b8b] font-light">
                Tattoo Artist - Tampa, FL
              </div>
              <p className="text-xs font-extralight text-black mt-1">
                Bri really took the time to understand what I wanted and super
                professional.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#131313] rounded-lg p-8 flex items-center flex-1 justify-center">
          <div className="w-[100px] h-[100px]">
            <svg
              viewBox="0 0 98 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="49.3828"
                y1="1.52344"
                x2="49.3828"
                y2="97.7617"
                stroke="white"
              />
              <line
                x1="1.33594"
                y1="48.7891"
                x2="96.5234"
                y2="48.7891"
                stroke="white"
              />
              <rect
                x="0.914062"
                y="1.3125"
                width="95.9453"
                height="95.9453"
                stroke="white"
              />
              <circle cx="73.1992" cy="25.293" r="22.8242" stroke="white" />
              <circle cx="25.5586" cy="72.9648" r="22.8242" stroke="white" />
              <circle cx="73.1992" cy="72.9648" r="22.8242" stroke="white" />
              <circle cx="25.5586" cy="25.293" r="22.8242" stroke="white" />
            </svg>
          </div>
        </div>
        <div className="bg-[#131313] rounded-lg flex items-center  flex-[1.25] justify-center overflow-hidden min-w-[180px]">
          <img
            src="/person-being-tattoed-2.png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex gap-5 flex-wrap">
        <div className="bg-[#131313] rounded-lg flex items-center  flex-[1.25] justify-center overflow-hidden min-w-[150px]">
          <img
            src="/person-being-tattoed-3.png"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-[#131313] rounded-lg p-8 flex items-center  flex-auto md:flex-1 justify-center">
          <div className="w-[100px] h-[100px]">
            <svg
              viewBox="0 0 98 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="49.3828"
                y1="1.00781"
                x2="49.3828"
                y2="97.2461"
                stroke="white"
              />
              <line
                x1="1.33594"
                y1="48.2734"
                x2="96.5234"
                y2="48.2734"
                stroke="white"
              />
              <path
                d="M97.3574 48.7734C84.611 48.7734 72.3866 53.8369 63.3735 62.85C54.3604 71.8631 49.2969 84.0875 49.2969 96.834L97.3574 96.834"
                stroke="white"
                stroke-width="1.13271"
              />
              <path
                d="M1.33789 49.1875C14.0843 49.1875 26.3087 54.251 35.3218 63.2641C44.3349 72.2772 49.3984 84.5016 49.3984 97.248L1.33789 97.248"
                stroke="white"
                stroke-width="1.13271"
              />
              <path
                d="M0.822262 0.710938C13.5687 0.710937 25.7931 5.77444 34.8062 14.7875C43.8193 23.8006 48.8828 36.025 48.8828 48.7715L0.822266 48.7715"
                stroke="white"
                stroke-width="1.13271"
              />
              <path
                d="M97.3574 0.710938C84.611 0.710937 72.3866 5.77444 63.3735 14.7875C54.3604 23.8006 49.2969 36.025 49.2969 48.7715L97.3574 48.7715"
                stroke="white"
                stroke-width="1.13271"
              />
              <rect
                x="0.914062"
                y="0.804688"
                width="95.9453"
                height="95.9453"
                stroke="white"
              />
            </svg>
          </div>
        </div>

        <div className="bg-[#131313] rounded-lg overflow-hidden flex flex-[2] items-center justify-center min-w-[250px]">
          <img
            src="/person-being-tattoed.webp"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const Footer = ({
  prefillEmail,
  mode,
  onAfterSubscribe,
}: {
  prefillEmail?: string;
  mode: "professional" | "client";
  onAfterSubscribe?: () => void;
}) => {
  const { onFormChange, onSubmit, isLoading, formData } = useSubscribe({
    mode,
    onAfterSubscribe,
  });
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Prefill email and focus when prop changes
  React.useEffect(() => {
    if (prefillEmail && emailInputRef.current) {
      emailInputRef.current.value = prefillEmail;
      emailInputRef.current.focus();
      // Ensure React's onChange/onInput fires for controlled state update
      const event = new Event("input", { bubbles: true });
      const change = new Event("change", { bubbles: true });
      emailInputRef.current.dispatchEvent(event);
      emailInputRef.current.dispatchEvent(change);
    }
    // If prefillEmail goes blank, clear email field and update state
    if (prefillEmail === "" && emailInputRef.current) {
      emailInputRef.current.value = "";
      const event = new Event("input", { bubbles: true });
      const change = new Event("change", { bubbles: true });
      emailInputRef.current.dispatchEvent(event);
      emailInputRef.current.dispatchEvent(change);
    }
  }, [prefillEmail]);

  return (
    <footer className="grid grid-cols-2 gap-12 md:gap-16 xl:gap-20 mt-48">
      <div className="flex-1 bg-[#131313] rounded-lg p-8 xl:px-16 py-8 flex items-center flex-col max-sm:col-span-2">
        <div className="w-[100px] h-auto">
          <img src="/logo-with-text.png" className="w-full h-auto" />
        </div>
        <div className="w-full h-full mt-10 lg:mb-5 rounded-lg bg-[#B8633F] flex max-w-full overflow-hidden flex-col justify-between">
          <div
            id="early-access-form"
            className="overflow-hidden relative w-fit flex items-center  h-[50px] md:h-[70px] md:-ml-5"
          >
            <div className="flex w-fit gap-5 items-center h-fit">
              <div className="flex text-sm md:text-base font-medium [font-family:Scope_One] whitespace-nowrap">
                Join early access
              </div>
              <div>
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4575 0.734375L16.4829 9.7007L24.2552 4.79269L19.3472 12.565L28.3135 14.5903L19.3472 16.6157L24.2552 24.388L16.4829 19.48L14.4575 28.4463L12.4322 19.48L4.65988 24.388L9.56788 16.6157L0.601562 14.5903L9.56788 12.565L4.65988 4.79269L12.4322 9.7007L14.4575 0.734375Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="flex gap-5 text-sm md:text-base font-medium [font-family:Scope_One] whitespace-nowrap">
                Join early access
              </div>
              <div>
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4575 0.734375L16.4829 9.7007L24.2552 4.79269L19.3472 12.565L28.3135 14.5903L19.3472 16.6157L24.2552 24.388L16.4829 19.48L14.4575 28.4463L12.4322 19.48L4.65988 24.388L9.56788 16.6157L0.601562 14.5903L9.56788 12.565L4.65988 4.79269L12.4322 9.7007L14.4575 0.734375Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="flex gap-5 text-sm md:text-base[font-family:Scope_One] whitespace-nowrap">
                Join early access
              </div>
              <div>
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4575 0.734375L16.4829 9.7007L24.2552 4.79269L19.3472 12.565L28.3135 14.5903L19.3472 16.6157L24.2552 24.388L16.4829 19.48L14.4575 28.4463L12.4322 19.48L4.65988 24.388L9.56788 16.6157L0.601562 14.5903L9.56788 12.565L4.65988 4.79269L12.4322 9.7007L14.4575 0.734375Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className="p-4 md:p-5 xl:p-8 text-sm lg:text-base font-extralight text-pretty">
            Join a growing community of independent tattoo and body piercing
            specialists, shaping the future of how clients find trusted artists
            like you.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col max-sm:col-span-2 max-md:mt-12">
        <h2 className="text-2xl font-extralight tracking-wider">
          {mode === "professional" &&
            "Let clients find you, without the hassle"}
          {mode === "client" && "Don’t Miss the Launch!"}
        </h2>
        <p className="text-sm sm:text-base text-[#8e8e8e] mt-3 font-light">
          {mode === "professional" &&
            `Sign up today and be one of the first professionals featured when we
            launch in your city!`}
          {mode === "client" && (
            <>
              We’ll keep you in the loop. No spam—ever!
              <br /> Discover the best tattoo arists in your city with
              IndieVia!`
            </>
          )}
        </p>
        <form
          className="w-full mt-10 flex flex-col gap-12"
          onChange={onFormChange}
          onSubmit={onSubmit}
        >
          <div className="flex justify-start w-full flex-col">
            <label
              className="font-extralight text-sm w-fit text-white/50"
              htmlFor="first-name"
            >
              First Name
            </label>
            <input
              value={formData.firstName}
              id="first-name"
              required
              name="firstName"
              className="border-b bg-transparent border-b-zinc-50/10 focus-within:outline-none focus:outline-none focus:border-b-zinc-100/70 py-2 w-full"
            />
          </div>
          <div className="flex justify-start w-full flex-col">
            <label
              className="font-extralight text-sm w-fit text-white/50"
              htmlFor="email"
            >
              Email
            </label>
            <input
              value={formData.email}
              id="email"
              type="email"
              name="email"
              ref={emailInputRef}
              required
              className="border-b bg-transparent border-b-zinc-50/10 focus-within:outline-none focus:outline-none focus:border-b-zinc-100/70 py-2 w-full"
            />
          </div>
          <div className="flex justify-start w-full flex-col">
            <label
              className="font-extralight text-sm w-fit text-white/50"
              style={{ display: mode === "client" ? "none" : "block" }}
            >
              Industry
            </label>
            {mode === "professional" && (
              <Select name="industry" required>
                <div>
                  <SelectTrigger className="border-t-0 border-l-0 border-r-0 !border-b-zinc-50/10 border-b-[1px] [border-radius:0px] bg-none! p-0 ficus:outline-none focus-within:outline-none focus:shadow-none!">
                    <SelectValue
                      placeholder="Select your industry"
                      className="ficus:outline-none focus-within:outline-none focus:border-none focus-within:border-none focus-visible:outline-none placeholder:text-white/50!"
                    />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectItem value="Body Piercer">Body Piercer</SelectItem>
                  <SelectItem value="Tattoo Artist">Tattoo Artist</SelectItem>
                </SelectContent>
              </Select>
            )}
            <div className="mt-8 flex gap-2 items-center">
              <Checkbox id="terms" className="border-zinc-100" name="terms" />
              <Label
                htmlFor="terms"
                className="font-extralight max-md:text-xs [line-height:1.5] text-pretty"
              >
                I agree to receive early access updates from <b>IndieVia.</b>
              </Label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="font-extralight text-sm gap-2 pl-4 p-[5px] h-[50px] rounded-full bg-[#282828] flex items-center justify-center whitespace-nowrap ml-auto mt-10"
            >
              Join waitlist
              <span className="inline-block size-[40px]">
                {isLoading ? (
                  <span className="w-[25px] h-[25px] border-2 mt-[7.5px] border-[#B8633F] border-t-transparent animate-spin rounded-full block mx-auto" />
                ) : (
                  <svg
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20.3828" cy="20.207" r="20" fill="#B8633F" />
                    <path
                      d="M18.7832 15.9072H24.6494L24.6729 15.917C24.6792 15.9233 24.6826 15.9317 24.6826 15.9404V21.8076C24.6824 21.8258 24.6677 21.8408 24.6494 21.8408C24.6312 21.8407 24.6164 21.8258 24.6162 21.8076V16.0215L23.7627 16.875L16.6729 23.9639C16.6663 23.9704 16.658 23.9737 16.6494 23.9736L16.626 23.9639C16.6195 23.9573 16.6162 23.9489 16.6162 23.9404L16.626 23.917L24.5693 15.9736H18.7832C18.7648 15.9736 18.75 15.9588 18.75 15.9404C18.7501 15.9221 18.7648 15.9072 18.7832 15.9072Z"
                      fill="#09090B"
                      stroke="#E4E4E7"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="w-full mt-8 flex justify-between items-center pb-10 col-span-2 flex-wrap gap-10">
        <div className="flex items-center gap-3 text-zinc-100/50 text-sm font-extralight w-fit">
          <img
            src="/indievia-text-logo.png"
            className="w-[80px] h-auto mb-[8px]"
          />
          <span>© {new Date().getFullYear()} — Copyright</span>
        </div>
        <div className="w-fit">
          <nav className="text-sm font-extralight gap-8 text-white/40 flex items-center">
            <nav className="text-xs sm:text-sm font-extralight gap-6 sm:gap-8  flex items-center">
              <Link to="/about" className="text-white/20 hover:text-white/50">
                About
              </Link>
              <Link to="/privacy" className="text-white/20 hover:text-white/50">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/20 hover:text-white/50">
                Terms of Service
              </Link>
            </nav>
          </nav>
        </div>
      </div>
    </footer>
  );
};

const Index: React.FC = () => {
  const [hideElements, setHideElements] = useState(false);

  return (
    <div className="w-full max-w-[1440px] max-auto overflow-hidden text-white">
      <Layout>
        <Nav />
      </Layout>
      <main>
        <Layout>
          {/*<div className="flex items-center border border-zinc-100/20 rounded-full w-fit p-[5px] mx-auto mt-20 "></div>*/}
          <h2 className="font-profile-header lg:text-4xl font-medium text-xl sm:text-2xl text-white text-center mt-10 w-full flex items-center justify-center">
            <AnimatePresence initial={false} mode="popLayout">
              {
                <motion.span
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                  className="text-balance w-full sm:w-2/3 xl:w-1/2"
                >
                  Discover, Review &amp; Book Trusted Tattoo Artists
                </motion.span>
              }
            </AnimatePresence>
          </h2>
          <motion.p
            layout="position"
            transition={{ duration: 1 }}
            className="max-sm:text-sm font-sm max-w-[600px] font-extralight text-balance text-white text-center mt-2 mx-auto"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {
                <motion.span
                  className="max-md:text-white/70"
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                >
                  <b>IndieVia</b> connects clients to local professionals within
                  the body piercing and tattooing industry without any
                  commitments and the endless scrolling.{" "}
                </motion.span>
              }
            </AnimatePresence>
          </motion.p>
          {/*<div className="flex flex-col items-start justify-center gap-5 w-fit mx-auto mt-10">
            <Hero
              prefillEmail={heroPrefillEmail}
              setPrefillEmailAndScroll={setPrefillEmailAndScroll}
              subscriberCount={subscriberCount}
            />
          </div>*/}
          <div className="mt-10" />
          <SearchInput
            onSearch={() => setHideElements(true)}
            onClear={() => setHideElements(false)}
          />
          <AnimatePresence>
            {!hideElements && (
              <motion.div exit={{ opacity: 0, y: 20 }}>
                <FeaturedArtists />
                <div className="mt-40" />
                <RecentReviews />
                <div className="mt-40" />
                <LandingAbout />
                <InfoSection />
                <MasonryLayout />
              </motion.div>
            )}
          </AnimatePresence>
        </Layout>

        {/*<Layout>
          <section className="w-full mt-40">
            <div className="flex justify-between flex-wrap gap-16">
              <div className="flex flex-col">
                <article>
                  <h1 className="text-2xl text-white font-light">
                    Why join now
                  </h1>
                  <p className=" max-sm:text-sm font-extralight text-[#8e8e8e] max-w-[500px] mt-5">
                    {`Becoming an early member of our platform means more than
                    just getting listed — it’s a chance to grow with a community
                    that’s built around your needs as an independent
                    professional.`}
                  </p>
                  <p className="max-sm:text-sm  font-extralight text-[#8e8e8e] max-w-[500px] mt-3">
                    {`We’re building IndieVia with input from tattoo enthusiasts and professionals. Your feedback will directly influence the tools and features we prioritize next.`}
                  </p>
                  <p className="max-sm:text-sm font-extralight text-[#8e8e8e] max-w-[500px] mt-3">
                    {`Be part of a fresh, growing space focused on reviews, trust, quality — not outdated directories or algorithm-driven platforms.`}
                  </p>
                </article>
              </div>
              <div className="flex flex-col gap-8 items-start w-fit">
                <div className="flex items-center gap-4 justify-start w-fit">
                  <ArrowRight />
                  <p className="text-white text-lg font-light">
                    {mode === "professional" && `Help shape the platform`}
                    {mode === "client" && `Find and review local artists`}
                  </p>
                </div>
                <div className="flex items-center gap-4 justify-start w-fit">
                  <ArrowRight />
                  <p className="text-white text-lg font-light">
                    {mode === "professional" &&
                      `Get early visibility and exposure`}
                    {mode === "client" && `Read honest reviews`}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-4 w-fit">
                  <ArrowRight />
                  <p className="text-white text-lg font-light">
                    {mode === "professional" && `Stay ahead of the curve`}
                    {mode === "client" && `Join a like-minded community`}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <MasonryLayout />
        </Layout>*/}
      </main>
      <Layout>
        <GlobalFooter />
      </Layout>
      <Toaster />
    </div>
  );
};

export default Index;
