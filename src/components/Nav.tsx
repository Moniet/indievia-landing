import { useProfile } from "@/hooks/use-profile"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"
import {
  Bell,
  ChevronDown,
  Loader2,
  LucideUser,
  LucideArrowUpRightFromSquare,
  LucideBug,
  LucideMail,
  LucideSearch,
  LucideNotepadText,
  LucideNotebook,
  User2,
  UserCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useUser from "@/hooks/use-user"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { UserNavItem } from "./UserNavItem"

const Nav = () => {
  const location = useLocation()
  const isAbout = location.pathname.toLowerCase() == "/about"
  const { data: profile } = useProfile()
  const [{ user }] = useUser()
  const userRole = user?.data?.user?.user_metadata?.role
  const [signingOut, setSigningOut] = useState(false)
  const nav = useNavigate()
  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await supabase.auth.signOut()
    } finally {
      nav("/sign-in")
    }
  }

  return (
    <nav className="w-full max-sm:flex-col max-md:py-8 gap-5 md:h-[150px] flex items-center justify-between text-white">
      <Link to="/">
        <h1 className="flex items-center">
          <img
            src="/indievia-text-logo.png"
            className="w-[100px] h-auto mb-1"
          />
          <span className="opacity-0 w-0 h-0 absolute top-0 -left-[1000]">
            Indie-Via
          </span>
        </h1>
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <Link
          to="/"
          className={`font-light text-xs md:text-sm tracking-wide ${
            isAbout ? "opacity-50" : "opacity-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`font-light text-xs whitespace-nowrap md:text-sm hover:text-white tracking-wide ${
            isAbout ? "!text-white" : "text-white/50"
          }`}
        >
          About IndieVia
        </Link>
        <div className="flex gap-5 items-center max-md:flex-row-reverse">
          {(!profile || profile.error) && (
            <Link
              to="/sign-in"
              className={`py-2 min-w-fit px-2  md:px-4 max-md:text-xs max-md:flex rounded-full border border-white/50 !text-white font-light text-xs md:text-sm tracking-wide`}
            >
              <span className="max-sm:hidden">Sign In</span>
              <UserCircle
                className="size-5 sm:hidden text-white m-auto"
                strokeWidth={1.5}
              />
            </Link>
          )}
          {(!profile || profile.error) && (
            <Link
              to="/sign-up"
              className={`md:py-2 max-md:px-3 items-center max-md:py-2 whitespace-nowrap md:px-4 flex rounded-full bg-brand !text-white font-light text-xs md:text-sm tracking-wide`}
            >
              <UserCircle className="size-5 mr-2 max-sm:hidden text-white m-auto" />

              <span className="">Sign Up</span>
            </Link>
          )}

          <UserNavItem profile={profile} />
        </div>
      </div>
    </nav>
  )
}

export default Nav
