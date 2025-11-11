import Layout from "@/components/Layout";
import { ProfileNav } from "@/components/ProfileNav";
import BasicInfo from "./BasicInfo";
import BadgeProgress from "./BadgeProgress";
import Reviews from "@/components/Reviews";
import GlobalFooter from "@/components/Footer";
import ProfessionalDisplayCard from "@/components/ProfessionalDisplayCard";
import EditProfileModal from "./EditProfileModal";
import { Loading } from "./Loading";
import useUser from "@/hooks/use-user";
import { useClientProfile } from "@/hooks/use-client-profile";
import { useClientReviews } from "@/hooks/use-client-reviews";
import {
  useClientFavorites,
  type Favorite,
} from "@/hooks/use-client-favorites";
import { Button } from "@/components/ui/button";
import { Loader2, LucideInfo } from "lucide-react";
import ReferralSection from "../ProfessionalProfile/ReferralSection";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ClientProfile = () => {
  const [{ user }, isLoading] = useUser();
  const [
    {
      profileData,
      isFetching,
      isPending: isLoadingProfile,
      isError: isProfileError,
      error: profileError,
    },
  ] = useClientProfile();
  const {
    reviews,
    hasNextPage: hasMoreReviews,
    fetchNextPage: fetchMoreReviews,
    isLoading: loadingReviews,
    isFetchingNextPage: isLoadingMoreReviews,
    isError: isReviewsError,
    error: reviewsError,
  } = useClientReviews();
  const flatReviews = reviews;
  const {
    favorites,
    isLoading: loadingFavorites,
    isError: isFavoritesError,
    error: favoritesError,
    hasNextPage: hasMoreFavorites,
    fetchNextPage: fetchMoreFavorites,
    isFetchingNextPage: isLoadingMoreFavorites,
  } = useClientFavorites();

  const { pathname } = useLocation();
  const isDashboard = pathname.includes("/client/dashboard");
  useEffect(() => {
    document.querySelector("#profile-nav")?.scrollIntoView();
  }, [profileData]);

  // Responsive Loading State
  if (isLoading || isLoadingProfile || loadingReviews || loadingFavorites) {
    return (
      <Layout className="min-h-screen flex flex-col pb-10">
        <ProfileNav />
        <div className="flex flex-1 items-center justify-center px-4">
          <Loading />
        </div>
      </Layout>
    );
  }

  // Responsive Error State
  if (isProfileError || isReviewsError || isFavoritesError) {
    return (
      <Layout className="min-h-screen flex flex-col pb-10">
        <ProfileNav />
        <div className="w-full max-w-xl mx-auto flex items-center justify-center h-[50vh] px-4">
          <p className="text-red-500 text-center text-base sm:text-lg">
            There was an error loading the profile. Please try again later.
          </p>
        </div>
      </Layout>
    );
  }

  if (!profileData && user?.data?.user?.user_metadata?.role === "client") {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <div className="flex flex-1 items-center justify-center px-4 flex-col">
          <Loading />
        </div>
        <EditProfileModal
          mode="onboarding"
          open={true}
          defaultValues={profileData}
        />
      </div>
    );
  }
  return (
    <>
      <Layout className="pb-8 sm:pb-16 min-h-screen">
        <ProfileNav />
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="w-full h-full space-y-8 sm:space-y-16 md:space-y-24">
            <BasicInfo badge={profileData?.badge} />
            <BadgeProgress
              fullName={profileData?.full_name}
              currentBadge={
                profileData?.badge === "early_supporter"
                  ? "Early Supporter - Founding Year"
                  : ""
              }
              totalReferrals={profileData?.referral_count}
            />
            {profileData?.referral_code && (
              <ReferralSection
                isLoading={!profileData}
                referralCode={profileData?.referral_code}
              />
            )}

            <Reviews
              mode="client-dashboard"
              isLoading={loadingReviews}
              reviews={flatReviews}
              onClickViewMore={fetchMoreReviews}
              isLoadingViewMore={isLoadingMoreReviews}
              hasMoreReviews={hasMoreReviews}
            />

            <div className="w-full max-sm:pt-12">
              <h2 className="text-xl sm:text-2xl font-profile-header mb-6 sm:mb-10">
                Favorite Artists
              </h2>
              {!favorites || favorites.length === 0 ? (
                <div className="relative min-h-[240px] sm:min-h-[320px] flex flex-col items-center justify-center">
                  <div className="grid  sm:grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-10 sm:gap-y-10 w-full opacity-25 blur-sm select-none pointer-events-none">
                    <ProfessionalDisplayCard
                      id="1"
                      badge=""
                      profile_picture_url="https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                      full_name=""
                      slug="dummy-1"
                      position="Artist"
                      avg_rating="4.5"
                      is_favorite={false}
                      city="City"
                      state="State"
                    />
                    <div className="max-sm:hidden">
                      <ProfessionalDisplayCard
                        id="2"
                        badge=""
                        profile_picture_url="https://plus.unsplash.com/premium_photo-1690587673708-d6ba8a1579a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                        full_name=""
                        slug="dummy-2"
                        position="Artist"
                        avg_rating="4.8"
                        is_favorite={false}
                        city="City"
                        state="State"
                      />
                    </div>
                  </div>
                  <div className="border border-neutral-800 absolute top-1/2 left-1/2 rounded-lg shadow-2xl -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-5 bg-black/80 text-white flex flex-col items-center">
                    <div className="text-base font-medium flex items-center gap-2">
                      <LucideInfo className="size-4" /> No Favorites Found
                    </div>
                    <div className="text-white/50 text-sm mt-2 text-center">
                      {isDashboard
                        ? "Search for artists and tap the heart icon to add them to your favorites. Favorited artists will show up here."
                        : "Once artists are favorited, they will show up here."}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 auto-flow-row gap-x-4 gap-y-6 sm:gap-x-10 sm:gap-y-10">
                    {favorites?.map((fav: Favorite, idx) => {
                      const professional = fav.professional_profiles as any;
                      if (!professional) return null;
                      return (
                        <ProfessionalDisplayCard
                          key={professional.id || idx}
                          badge={professional.badge}
                          id={professional.id}
                          slug={professional.slug}
                          is_favorite={true}
                          full_name={
                            professional.full_name || "Favorite Artist"
                          }
                          profile_picture_url={
                            professional.profile_picture_url || ""
                          }
                          position={professional.position || "Artist"}
                          city={professional?.city || "N/A"}
                          state={professional?.state || ""}
                          avg_rating={String(professional.avg_rating || 4)}
                        />
                      );
                    })}
                  </div>
                  {hasMoreFavorites && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => fetchMoreFavorites()}
                        disabled={isLoadingMoreFavorites}
                        size="sm"
                        className="bg-white text-black rounded-full hover:bg-white hover:text-black hover:opacity-50 transition-all"
                      >
                        {isLoadingMoreFavorites && (
                          <Loader2 className="size-4 animate-spin mr-2" />
                        )}
                        View More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <GlobalFooter />
      </Layout>
    </>
  );
};

export default ClientProfile;
