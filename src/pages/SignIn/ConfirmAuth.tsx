import { fetchProfile } from "@/hooks/use-profile"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ConfirmAuth = () => {
  const navigate = useNavigate()

  useEffect(() => {
    handleSignIn()
    // eslint-disable-next-line
  }, [])

  const handleSignIn = async () => {
    // Get the user
    const user = await supabase.auth.getUser()

    // Optionally create a profile if needed for new user
    //
    const { data: res } = await supabase.functions.invoke(
      `auth_check?email=${user?.data?.user?.email}`
    )

    const role = res?.role

    // Redirect based on role
    if (role === "client") {
      navigate(`/client/dashboard`, { replace: true })
      return
    } else if (role === "professional") {
      navigate("/professional/dashboard", { replace: true })
      return
    } else if (role === "admin") {
      navigate("/admin/dashboard", { replace: true })
      return
    } else {
      // Fallback redirect in case of missing or invalid role
      navigate("/", { replace: true })
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center">
        <Loader2 className="size-6 animate-spin mr-2 duration-1000" />
        <span className="text-2xl">Confirming ...</span>
      </div>
    </div>
  )
}

export default ConfirmAuth
