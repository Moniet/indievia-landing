import { toast } from "sonner"
import { supabase } from "./client"
import { Check } from "lucide-react"
import { professionalTags } from "@/pages/ProfessionalDashboard/Profile/tags"

export type ProfileForm = {
  email: string
  fullName: string
  tags: string[]
  position: string
  bio: string
  slug: string
  website?: string
  instagram?: string
  streetAddress?: string
  city?: string
  state?: string
  facebook?: string
  tiktok?: string
  twitter?: string
  youtube?: string
}

const allTags = [...professionalTags[0].options, ...professionalTags[1].options]

export async function saveProfile(profile: ProfileForm, userId: string) {
  // Upsert the user's profile by primary key (id = userId)
  const tags = profile.tags.map((item) =>
    allTags.find((tag) => tag.value === item)!.label.toLowerCase()
  )
  const { error } = await supabase
    .from("professional_profiles" as never)
    .upsert(
      [
        {
          user_id: userId,
          email: profile.email,
          full_name: profile.fullName,
          position: profile.position,
          tags,
          street_address: profile.streetAddress,
          city: profile.city,
          state: profile.state,
          slug: profile.slug,
          bio: profile.bio,
          website: profile.website || null,
          instagram: profile.instagram || null,
          facebook: profile.facebook || null,
          tiktok: profile.tiktok || null,
          twitter: profile.twitter || null,
          youtube: profile.youtube || null
        }
      ],
      { onConflict: "user_id " }
    )

  return { error }
}
