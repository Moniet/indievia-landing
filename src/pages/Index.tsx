import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "sonner"
import Layout from "@/components/Layout"
import Nav from "@/components/Nav"
import { Link } from "react-router-dom"

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
  )
}

const Hero = ({
  prefillEmail,
  setPrefillEmailAndScroll,
  subscriberCount
}: {
  prefillEmail: string
  setPrefillEmailAndScroll: (email: string) => void
  subscriberCount: number | null
}) => {
  const [email, setEmail] = useState("")

  // Update if prop changes (for reset)
  React.useEffect(() => {
    if (!prefillEmail) setEmail("")
  }, [prefillEmail])

  const handleJoinClick = (e: React.FormEvent) => {
    e.preventDefault()
    setPrefillEmailAndScroll(email.trim())
  }

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
  )
}

const useSubscribe = ({
  mode,
  onAfterSubscribe
}: {
  mode: "professional" | "client"
  onAfterSubscribe?: () => void
}) => {
  const [data, setData] = useState<{
    email: string
    firstName: string
    industry: string
  }>({
    industry: "",
    firstName: "",
    email: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  // Listen for a CustomEvent to update email
  React.useEffect(() => {
    function handlePrefillEmail(e: Event) {
      if (
        (e as CustomEvent).detail &&
        typeof (e as CustomEvent).detail.email === "string"
      ) {
        setData((d) => ({
          ...d,
          email: (e as CustomEvent).detail.email
        }))
      }
    }
    window.addEventListener("prefill-footer-email", handlePrefillEmail)
    return () =>
      window.removeEventListener("prefill-footer-email", handlePrefillEmail)
  }, [])

  const onFormChange = (e: any) => {
    const value = e.target.value
    const name = e.target.name
    if (["firstName", "industry", "email"].includes(name)) {
      setData({
        ...data,
        [name]: value
      })
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    // Check terms checkbox:
    const termsAccepted = (document.querySelector("#terms") as HTMLInputElement)
      .dataset.state

    if (termsAccepted !== "checked") {
      toast.error("You must accept the terms to join the waitlist.")
      return
    }

    const body = data
    if (mode === "client") {
      body.industry = "client"
    }
    setIsLoading(true)
    try {
      const res = await fetch(
        "https://mfebhamkxngghywfgfac.supabase.co/functions/v1/early-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(body)
        }
      )
      if (res.ok) {
        toast("Sign Up Success!", {
          description:
            "You will receive updates in a few weeks when we release IndieVia"
        })
        setData({
          industry: "",
          firstName: "",
          email: ""
        })
        if (onAfterSubscribe) {
          onAfterSubscribe()
        }
      } else {
        const resp = await res.json()
        console.error(resp.errors)
        toast.error("Uh oh!", {
          description: "There was an error when signing up!"
        })
      }
    } catch (e) {
      toast.error("Uh oh!", {
        description: "There was an error when signing up!"
      })
      console.error(e)
    }

    setIsLoading(false)
  }

  return {
    formData: data,
    onFormChange,
    onSubmit,
    isLoading
  }
}

const ImageAutoScrollSection = () => {
  return (
    <section>
      <div className="w-screen overflow-hidden">
        <div className="flex items-center overflow-hidden w-[300vw] mt-40">
          <div className="animate-auto-scroll w-fit flex gap-5 min-w-fit">
            <img
              src="/hero-circle-1.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-2.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-3.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-4.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-5.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-6.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
          </div>
          <div className="animate-auto-scroll w-fit flex gap-5 min-w-fit">
            <img
              src="/hero-circle-1.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-2.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-3.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-4.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-5.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
            <img
              src="/hero-circle-6.png"
              className="h-[200px] sm:h-[250px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

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
              className="bg-white/30 top-0 left-0 absolute w-full h-full rounded-md rotate-[2deg] ml-1"
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.2)" }}
            />
            <div
              className="w-full h-full bg-[#FFFDFA] rounded-md -rotate-[1deg] p-2"
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            >
              <div className="h-fit rounded-lg overflow-hidden w-full">
                <img
                  src="/picture-of-woman.jpg"
                  className="w-full h-auto lg:scale-[1.06] [transform-origin:center_center]"
                />
              </div>
              <div className="text-black text-sm mt-2">
                Brianna Johnson | 146 reviews
              </div>
              <div className="text-sm mt-1 text-[#8b8b8b] font-light">
                Tattoo Artist
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
  )
}

const Footer = ({
  prefillEmail,
  mode,
  onAfterSubscribe
}: {
  prefillEmail?: string
  mode: "professional" | "client"
  onAfterSubscribe?: () => void
}) => {
  const { onFormChange, onSubmit, isLoading, formData } = useSubscribe({
    mode,
    onAfterSubscribe
  })
  const emailInputRef = React.useRef<HTMLInputElement>(null)

  // Prefill email and focus when prop changes
  React.useEffect(() => {
    if (prefillEmail && emailInputRef.current) {
      emailInputRef.current.value = prefillEmail
      emailInputRef.current.focus()
      // Ensure React's onChange/onInput fires for controlled state update
      const event = new Event("input", { bubbles: true })
      const change = new Event("change", { bubbles: true })
      emailInputRef.current.dispatchEvent(event)
      emailInputRef.current.dispatchEvent(change)
    }
    // If prefillEmail goes blank, clear email field and update state
    if (prefillEmail === "" && emailInputRef.current) {
      emailInputRef.current.value = ""
      const event = new Event("input", { bubbles: true })
      const change = new Event("change", { bubbles: true })
      emailInputRef.current.dispatchEvent(event)
      emailInputRef.current.dispatchEvent(change)
    }
  }, [prefillEmail])

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
  )
}

const Index: React.FC = () => {
  const [mode, setMode] = useState<"professional" | "client">("professional")
  const [heroPrefillEmail, setHeroPrefillEmail] = useState("")
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  // Fetch the current subscriber count from the API
  const fetchSubscriberCount = useCallback(async () => {
    try {
      const res = await fetch(
        "https://mfebhamkxngghywfgfac.supabase.co/functions/v1/smart-api"
      )
      if (res.ok) {
        const json = await res.json()
        if (typeof json.count === "number") {
          setSubscriberCount(json.count)
        }
      }
    } catch (e) {
      // optionally handle error
    }
  }, [])

  useEffect(() => {
    fetchSubscriberCount()
  }, [fetchSubscriberCount])

  // Handles scroll and fires a CustomEvent for Footer form email prefill
  const setPrefillEmailAndScroll = (email: string) => {
    setHeroPrefillEmail(email)
    setTimeout(() => {
      const target = document.getElementById("early-access-form")
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" })
        // Dispatch event for any listener (Footer/useSubscribe)
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("prefill-footer-email", { detail: { email } })
          )
        }, 200)
      }
    }, 50)
  }

  return (
    <div className="w-full max-w-[1440px] max-auto overflow-hidden text-white">
      <Layout>
        <Nav />
      </Layout>
      <main>
        <Layout>
          <div className="flex items-center border border-zinc-100/20 rounded-full w-fit p-[5px] mx-auto mt-20 ">
            <div className="relative w-fit h-fit">
              {mode === "professional" && (
                <motion.div
                  layoutId="switch-swatch"
                  className="absolute top-0 left-0 w-full h-full bg-[#B8633F] rounded-full z-1"
                />
              )}
              <button
                className={`text-white p-2 px-4 text-sm tracking-wide font-light  transition-colors rounded-full relative z-10`}
                onClick={() => setMode("professional")}
              >
                {"I'm a Professional"}
              </button>
            </div>
            <div className="relative w-fit h-fit">
              {mode === "client" && (
                <motion.div
                  layoutId="switch-swatch"
                  className="absolute top-0 left-0 w-full h-full bg-[#B8633F] rounded-full z-1"
                />
              )}
              <button
                onClick={() => setMode("client")}
                className={`text-white p-2 px-4 text-sm tracking-wide font-light transition-colors  rounded-full relative z-10`}
              >
                {"I'm a Client"}
              </button>
            </div>
          </div>
          <h2
            className="text-4xl sm:text-5xl text-white text-center font-extralight mt-10 w-full flex items-center justify-center"
            style={{ fontFamily: "Scope One, mono" }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {mode === "professional" && (
                <motion.span
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                >
                  Less research.
                  <br /> More results
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false} mode="popLayout">
              {mode === "client" && (
                <motion.span
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                >
                  Discover Trusted Tattoo {"&"}
                  <br /> Body Piercing Professionals Near You
                </motion.span>
              )}
            </AnimatePresence>
          </h2>
          <motion.p
            layout="position"
            transition={{ duration: 1 }}
            className="max-sm:text-sm font-sm max-w-[600px] font-extralight text-balance text-white text-center mt-10 mx-auto"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {mode === "professional" && (
                <motion.span
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                >
                  <b>IndieVia</b> connects clients to local professionals within
                  the body piercing and tattooing industry without any
                  commitments and the endless scrolling.{" "}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false} mode="popLayout">
              {mode === "client" && (
                <motion.span
                  exit={{ opacity: 0, filter: "blur(5px)" }}
                  initial={{ opacity: 0, filter: "blur(5px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1 }}
                >
                  Real reviews. Independent artists. No booking hassles—just the
                  best in your city!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.p>
          <div className="flex flex-col items-start justify-center gap-5 w-fit mx-auto mt-10">
            <Hero
              prefillEmail={heroPrefillEmail}
              setPrefillEmailAndScroll={setPrefillEmailAndScroll}
              subscriberCount={subscriberCount}
            />
          </div>
        </Layout>

        <ImageAutoScrollSection />
        <Layout>
          <section className="w-full mt-40">
            <div className="flex justify-between flex-wrap gap-16">
              <div className="flex flex-col">
                <article>
                  <h1 className="text-2xl text-white font-light">
                    Why join now
                  </h1>
                  <p className=" max-sm:text-sm font-extralight text-[#8e8e8e] max-w-[500px] mt-5">
                    {mode === "professional" &&
                      `Becoming an early member of our platform means more than
                    just getting listed — it’s a chance to grow with a community
                    that’s built around your needs as an independent
                    professional.`}
                    {mode === "client" &&
                      `Be among the first to shape this community. Early members get exclusive access and updates.`}
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
          <section>
            <AnimatePresence initial={false}>
              {mode === "professional" && (
                <motion.article
                  className="mt-32 md:mt-20"
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h1 className="text-2xl text-white font-light">
                    Your talent deserves more eyes
                  </h1>
                  <p className=" max-sm:text-sm font-extralight text-[#8e8e8e] max-w-[500px] mt-5">
                    Join <b className="text-white font-light">IndieVia</b>, the
                    only review-based platform for professionals within the body
                    piercing and tattooing industry with no booking sign-up
                    required. Think Yelp, but for individual professionals.
                    Create your profile and get discovered faster!
                  </p>
                </motion.article>
              )}
            </AnimatePresence>

            <div className="flex gap-5 lg:gap-7 mt-12 flex-wrap">
              <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313]">
                <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
                  <svg
                    className="max-sm:max-h-[100px]"
                    viewBox="0 0 185 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="46.1934"
                      cy="46.1973"
                      r="46.1934"
                      fill="#282828"
                    />
                    <path
                      d="M92.3887 0C98.4549 0 104.462 1.19483 110.066 3.51626C115.671 5.83769 120.763 9.24027 125.052 13.5297C129.342 17.8192 132.744 22.9115 135.066 28.5159C137.387 34.1204 138.582 40.1272 138.582 46.1934C138.582 52.2596 137.387 58.2664 135.066 63.8708C132.744 69.4752 129.342 74.5675 125.052 78.857C120.763 83.1464 115.671 86.549 110.066 88.8705C104.462 91.1919 98.4549 92.3867 92.3887 92.3867L92.3887 46.1934V0Z"
                      fill="#282828"
                    />
                    <path
                      d="M138.584 0C144.65 0 150.657 1.19483 156.261 3.51626C161.866 5.83769 166.958 9.24027 171.248 13.5297C175.537 17.8192 178.94 22.9115 181.261 28.5159C183.583 34.1204 184.777 40.1272 184.777 46.1934C184.777 52.2596 183.583 58.2664 181.261 63.8708C178.94 69.4752 175.537 74.5675 171.248 78.857C166.958 83.1464 161.866 86.549 156.261 88.8705C150.657 91.1919 144.65 92.3867 138.584 92.3867L138.584 46.1934V0Z"
                      fill="#282828"
                    />
                  </svg>
                </div>
                <h1 className="text-sm sm:text-base font-light text-white ">
                  Free profile creation
                </h1>
                <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
                  {mode === "professional" &&
                    `Set up a professional profile that reflects your services, and
                    personality.`}
                  {mode === "client" &&
                    `Set up a reviewer profile with a bio & profile-picture that reflects
                    personality.`}
                </p>
              </article>
              <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313] lg:scale-[1.06]">
                <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
                  <svg
                    className="max-sm:max-h-[100px]"
                    viewBox="0 0 200 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 53.5938C4.15737e-05 46.5559 1.38686 39.5871 4.08008 33.085C6.7734 26.5827 10.7207 20.6739 15.6973 15.6973C20.6739 10.7206 26.5827 6.77343 33.085 4.08008C39.5873 1.38672 46.5567 -3.07644e-07 53.5947 0C60.6326 4.15743e-05 67.6013 1.38682 74.1035 4.08008C80.6058 6.77343 86.5145 10.7206 91.4912 15.6973C96.4679 20.6739 100.415 26.5826 103.108 33.085C105.802 39.5871 107.188 46.5559 107.188 53.5938L0 53.5938ZM0 92.3896V53.6055L107.188 53.6055V92.3896H0Z"
                      fill="#282828"
                    />
                    <path
                      d="M153.384 92.39C147.318 92.39 141.311 91.1951 135.706 88.8736C130.101 86.5521 125.009 83.1494 120.719 78.8598C116.43 74.5702 113.027 69.4777 110.705 63.8731C108.384 58.2684 107.189 52.2614 107.189 46.195C107.189 40.1286 108.384 34.1216 110.705 28.5169C113.027 22.9123 116.43 17.8198 120.719 13.5302C125.009 9.2406 130.101 5.8379 135.706 3.51638C141.311 1.19487 147.318 -5.30343e-07 153.384 0L153.384 46.195V92.39Z"
                      fill="#282828"
                    />
                  </svg>
                </div>
                <h1 className="text-sm sm:text-base font-light text-white ">
                  {mode === "professional" && "Discovered by style/ speciality"}
                  {mode === "client" && "Discovered artists in your locale"}
                </h1>
                <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
                  {mode === "professional" &&
                    `Be seen by people in your city actively looking for tattoo and
                  body piercing professionals. No need to chase algorithms or pay for
                  ads.`}
                  {mode === "client" &&
                    "Discover top tattoo artists in your city or show your support by dropping a review."}
                </p>
              </article>
              <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313]">
                <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
                  <svg
                    className="max-sm:max-h-[100px]"
                    viewBox="0 0 175 94"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="92.7844"
                      cy="47.0856"
                      r="46.195"
                      fill="#282828"
                    />
                    <path
                      d="M46.5897 93.2806C40.5233 93.2806 34.5162 92.0858 28.9116 89.7642C23.307 87.4427 18.2145 84.04 13.9249 79.7504C9.63527 75.4608 6.23257 70.3683 3.91106 64.7637C1.58954 59.159 0.394669 53.152 0.394669 47.0856C0.394669 41.0192 1.58954 35.0122 3.91106 29.4076C6.23257 23.8029 9.63527 18.7104 13.9249 14.4208C18.2145 10.1312 23.307 6.72852 28.9116 4.40701C34.5162 2.08549 40.5233 0.890624 46.5897 0.890625L46.5897 47.0856V93.2806Z"
                      fill="#282828"
                    />
                    <rect
                      x="138.98"
                      y="0.890625"
                      width="35.3906"
                      height="92.39"
                      fill="#282828"
                    />
                  </svg>
                </div>
                <h1 className="text-sm sm:text-base font-light text-white ">
                  Connect your socials
                </h1>
                <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
                  {mode === "professional" &&
                    `Invite your past clients to leave honest, verified reviews.
                    Real feedback that helps you stand out.`}
                  {mode === "client" &&
                    `We enable you to share reviews straight to social media or use images from instagram in your reviews!`}
                </p>
              </article>

              <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313] lg:scale-[1.06]">
                <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
                  <svg
                    className="max-sm:max-h-[100px]"
                    viewBox="0 0 175 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="128.293"
                      cy="46.5856"
                      r="46.195"
                      fill="#282828"
                    />
                    <path
                      d="M46.7073 92.7806C40.6409 92.7806 34.6339 91.5858 29.0293 89.2642C23.4246 86.9427 18.3321 83.54 14.0425 79.2504C9.75294 74.9608 6.35024 69.8683 4.02873 64.2637C1.70721 58.659 0.512344 52.652 0.512344 46.5856C0.512344 40.5192 1.70721 34.5122 4.02873 28.9076C6.35025 23.3029 9.75294 18.2104 14.0425 13.9208C18.3322 9.63122 23.4247 6.22852 29.0293 3.90701C34.6339 1.58549 40.6409 0.390624 46.7073 0.390625L46.7073 46.5856V92.7806Z"
                      fill="#282828"
                    />
                    <rect
                      x="46.707"
                      y="0.390625"
                      width="35.3906"
                      height="92.39"
                      fill="#282828"
                    />
                  </svg>
                </div>
                <h1 className="text-sm sm:text-base font-light text-white ">
                  {mode === "professional" && "No bookings required"}
                  {mode === "client" && "Make bookings directly"}
                </h1>
                <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
                  {mode === "professional" &&
                    `We’re not a scheduling platform, which means you stay in
                  control. Clients find you, explore your work, and reach out
                  directly.`}
                  {mode === "client" &&
                    `Explore and book appointments directly with tattoo artists / body piercing specialists.`}
                </p>
              </article>
            </div>
          </section>
          <MasonryLayout />
        </Layout>
      </main>
      <Layout>
        <Footer
          prefillEmail={heroPrefillEmail}
          mode={mode}
          onAfterSubscribe={fetchSubscriberCount}
        />
      </Layout>
      <Toaster />
    </div>
  )
}

export default Index
