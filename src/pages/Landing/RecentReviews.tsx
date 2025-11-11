import { ReviewItem, ReviewItemSkeleton } from "@/components/Reviews"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

const fetchReviews = () =>
  supabase.functions
    .invoke("landing_reviews", { method: "GET" })
    .then((d) => d.data)

export const RecentReviews = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["recent-reviews"],
    queryFn: fetchReviews,
    staleTime: Infinity
  })

  return (
    <div className="w-full">
      <h2 className="text-xl mb-8 font-profile-header">Recent Reviews</h2>

      <div className="w-full items-start max-w-full overflow-x-auto flex gap-10">
        {isLoading ? (
          <>
            <div className="min-w-[280px] h-fit p-5 max-w-[500px] bg-white/5 rounded-lg">
              <ReviewItemSkeleton />
            </div>
            <div className="min-w-[280px] h-fit p-5 max-w-[500px] bg-white/5 rounded-lg">
              <ReviewItemSkeleton />
            </div>
            <div className="min-w-[280px] h-fit p-5 max-w-[500px] bg-white/5 rounded-lg">
              <ReviewItemSkeleton />
            </div>
          </>
        ) : (
          data?.reviews?.map((r) => (
            <div
              key={r.id}
              className="min-w-[280px] h-fit p-5 max-w-[500px] bg-white/5 rounded-lg"
            >
              <ReviewItem
                review={r}
                profileUrl={r.profile_picture_url}
                mode="professional-dashboard-public"
                fullName={r.full_name}
                clientProfileId={r.client_id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
