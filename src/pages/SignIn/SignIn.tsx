import Nav from "@/components/Nav"
import { SignInForm } from "./signin-form"
import { useSearchParams } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCheck } from "lucide-react"

const SignIn = () => {
  const [params] = useSearchParams()
  const confirm_email_modal = params.get("confirm_email_modal")

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <Nav />
      <div className="w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
        <div className="w-full max-w-[450px] mt-4 sm:mt-6 md:mt-8">
          <SignInForm />
        </div>
        {confirm_email_modal === "yes" && (
          <AlertDialog defaultOpen>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex gap-2">
                  <CheckCheck className="size-7" />
                  Thanks for confirming your email!
                </AlertDialogTitle>
                <AlertDialogDescription className="texted">
                  You can now sign in to your account!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export default SignIn
