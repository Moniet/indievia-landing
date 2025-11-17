import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Sparkle, Sparkles } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useUser from "@/hooks/use-user"
import { fetchUserProfile } from "@/services/fetchUserProfile"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [mode, setMode] = useState<"client" | "pro">("client")
  const [{ user }, isLoadingUser] = useUser()
  const nav = useNavigate()

  const handleSignup: React.FormEventHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const { data, error } = await supabase.functions.invoke("sign-up", {
        body: {
          email,
          fullName,
          referralCode,
          mode: mode === "pro" ? "professional" : "client",
          redirectTo:
            window.location.origin + "/sign-in?confirm_email_modal=yes"
        }
      })

      if (error || data?.error) {
        const context = await error.context.json()
        setError(
          context?.error ||
            error?.message ||
            data?.error ||
            "Sign up failed. Please try again."
        )
      } else {
        setError("")
        setSuccess(true)
        localStorage.setItem(
          "sign-up-intent",
          mode === "pro" ? "pro" : "client"
        )
      }
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : "Failed to connect to authentication server."
      )
    }

    setLoading(false)
  }

  const verify = useCallback(async () => {
    if (user && user.data.user.aud === "authenticated") {
      const profile = await fetchUserProfile(user.data.user.id)
      if (profile.data.role === "client") {
        nav("/client/dashboard", {
          replace: true
        })
      } else if (profile.data.role === "professional") {
        nav("/professional/dashboard", {
          replace: true
        })
      }
    }
  }, [user])

  useEffect(() => {
    ;(() => {
      const search = new URLSearchParams(window.location.search)
      if (search.get("referralCode")) {
        setReferralCode(search.get("referralCode"))
      }
    })()

    verify()
  }, [user, verify])

  return (
    <div className="border border-neutral-800 rounded-lg p-4 sm:p-6 md:p-7">
      <div className="w-full h-10 sm:h-12 bg-white/5 mb-4 sm:mb-5 rounded-lg flex items-center justify-center p-1">
        <button
          onClick={() => setMode("client")}
          className={`transition-colors duration-300 flex-1 cursor-pointer tracking-wide flex items-center justify-center rounded-sm h-full text-center text-xs sm:text-sm px-2 sm:px-3 ${
            mode === "client" ? "bg-white/10 text-white" : ""
          }`}
        >
          Client
        </button>
        <button
          onClick={() => setMode("pro")}
          className={`transition-colors duration-300 flex-1 cursor-pointer tracking-wide flex items-center justify-center rounded-sm h-full text-center text-xs sm:text-sm px-2 sm:px-3 ${
            mode === "pro" ? "bg-white/10 text-white" : ""
          }`}
        >
          Professional
        </button>
      </div>
      <div className={cn("flex flex-col gap-5 sm:gap-6", className)} {...props}>
        <form onSubmit={handleSignup}>
          <FieldGroup>
            <div className="flex flex-col items-center text-center">
              {/*<a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <img src="/logo-with-text.png" className="w-24 mb-3" />
              </a>*/}
              <h1 className="text-lg sm:text-xl font-bold">
                Welcome to IndieVia
              </h1>
              <FieldDescription>
                Already signed up?{" "}
                <Link to="/sign-in" className="hover:!text-orange-400">
                  <span className="underline">Click here to sign in</span>
                </Link>
              </FieldDescription>
            </div>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Field>
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
              <FieldLabel htmlFor="email">Referral Code (optional)</FieldLabel>
              <Input
                id="referralCode"
                type="referral"
                placeholder="F3AB25AS"
                className="uppercase"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value?.trim())}
              />
            </Field>
            <Field className="mt-5">
              <Button
                disabled={loading || success || isLoadingUser}
                type="submit"
                className="w-full sm:w-auto bg-brand hover:bg-brand/80"
              >
                {loading && (
                  <Loader2 className="animate-spin duration-2000 size-4 mr-2" />
                )}
                {loading ? "Loading ..." : "Sign Up"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
        {success && (
          <Alert className="bg-white/5">
            <Sparkles className="size-4" />
            <AlertTitle>Magic link sent to your email</AlertTitle>
            <AlertDescription>
              Click on the link to sign in! Easy as pie 🥧
            </AlertDescription>
          </Alert>
        )}
        <FieldDescription className="px-4 sm:px-6 text-center text-balance">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </div>
  )
}
