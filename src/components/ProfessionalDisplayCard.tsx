import useUser from "@/hooks/use-user"
import { supabase } from "@/integrations/supabase/client"
import { Heart, LucideAward, LucideMedal, MapPin, Star } from "lucide-react"
import { useState } from "react"
import { Noise, NoiseContent } from "react-noise"
import "react-noise/css"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type Props = {
  id: string
  profile_picture_url: string
  full_name: string
  slug: string
  position: string
  avg_rating: string
  is_favorite: boolean
  city: string
  state: string
  badge: string
}

const defaultData: Props = {
  is_favorite: false,
  city: "Los Angeles",
  state: "California",
  profile_picture_url:
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHwwfDB8fHww",
  full_name: "Alex McFarlin",
  position: "Body Piercing, Tattoo Artist",
  avg_rating: "4.5",
  slug: "",
  badge: "",
  id: "1"
}

const ProfessionalDisplayCard = (props: Props) => {
  const {
    id,
    is_favorite,
    profile_picture_url,
    full_name,
    position,
    avg_rating,
    city,
    slug,
    badge,
    state
  } = props?.full_name ? props : defaultData

  const nav = useNavigate()
  const [favorite, setFavorite] = useState(is_favorite)
  const [{ user }] = useUser()
  const userRole = user?.data?.user?.user_metadata?.role

  const handleFavorite = async () => {
    setFavorite(!favorite)

    if (!favorite) {
      const { error, data } = await supabase.functions.invoke(
        "favorite/" + id,
        {
          method: "POST"
        }
      )

      if (error) {
        setFavorite(false)
        toast.error("Oops! We couldn't favorite this professional.")
      }
      return
    }

    try {
      const { error } = await supabase.functions.invoke("favorite/" + id, {
        method: "DELETE"
      })
      if (error) {
        setFavorite(false)
        toast.error("Oops! We couldn't favorite this professional.")
      }
      return
    } catch (e) {
      setFavorite(favorite)
    }
  }

  const year = new Date().getFullYear()
  const rating = Number(avg_rating).toFixed(1)

  return (
    <div
      onClick={() => nav(`/professional/${slug}`)}
      className="flex-shrink-0 max-md:w-full"
    >
      <article className="w-full h-full flex-shrink-0 max-w-[400px] md:max-w-[350px] flex flex-col relative">
        <div className="w-full h-full relative">
          <img
            className="w-full object-cover min-h-[300px] aspect-[0.9]"
            src={profile_picture_url}
            alt={`Profile Picture of ${full_name}`}
          />
          <Noise opacity={1} className="absolute top-0 left-0 w-full h-full" />

          <div className=" absolute top-3 left-3 bg-white/20 rounded-full p-2 flex gap-1 font-medium items-center text-xs">
            <MapPin className="size-4" />
            <span>
              {city}, {state}
            </span>
          </div>
        </div>
        <div>
          <section className="text-base font-profile-header flex items-center w-full justify-beteween">
            <div className="w-full flex gap-2 pt-2 items-center max-w-full overflow-hidden">
              <h2
                className={`text-lg w-fit  ${
                  badge === "10_referrals" ? "bg-anim" : ""
                }`}
              >
                {full_name}
              </h2>
              {badge === "5_referrals" && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="p-1 size-fit border rounded-full bg-yellow-500/50 border-yellow-500/50 cursor-pointer">
                      <LucideAward className="size-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-normal font-profile-para">
                      Highly referred professional.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {badge === "early_supporter" && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className=" cursor-pointer">
                      <img
                        src="/badge-founding-year.png"
                        className="size-8 object-contain translate-y-[5px] -translate-x-[5px]"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-normal font-profile-para">
                      Early supporter - Founding Year.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {badge === "verified_og" && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className=" cursor-pointer">
                      <img
                        src="/badge-verified-og.png"
                        className="size-8 object-contain translate-y-[5px] -translate-x-[5px]"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-normal font-profile-para">
                      Verified OG - Highly recommended professional!
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center font-profile-header text-sm mt-2 w-fit flex-shrink-0">
              <Star className="fill-brand stroke-none size-4 min-w-4 mr-2" />{" "}
              {rating === "0.0" ? (
                <span className="text-xs font-normal min-w-fit text-white/80">
                  No reviews
                </span>
              ) : (
                rating
              )}
            </div>
          </section>
          <section className="text-sm flex items-center">
            <span className="tracking-widest text-brand/80 mr-2">//</span>
            <span className="text-white/50 font-light mt-[2px]">
              {position}
            </span>
          </section>
        </div>

        {(!user || userRole === "client") && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFavorite()
            }}
            className="absolute z-10 cursor-pointer top-3 rounded-full bg-white/20 right-3 p-2 hover:bg-white/40"
          >
            <Heart
              className={`drop-shadow-sm size-4 transition-colors ${
                favorite ? "fill-white" : "fill-transparent"
              }`}
            />
          </button>
        )}
      </article>
    </div>
  )
}

export default ProfessionalDisplayCard
