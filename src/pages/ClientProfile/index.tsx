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
import { useClientFavorites } from "@/hooks/use-client-favorites";
import { LucideInfo } from "lucide-react";
import ReferralSection from "../ProfessionalProfile/ReferralSection";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

const ClientProfile = () => {
  const [{ user }, isLoading] = useUser();
  const [{ profileData, isFetching }, isLoadingProfile] = useClientProfile();
  const {
    reviews,
    hasNextPage: hasMoreReviews,
    fetchNextPage: fetchMoreReviews,
    isLoading: loadingReviews,
    isFetchingNextPage: isLoadingMoreReviews,
  } = useClientReviews();
  const flatReviews = reviews;
  const { favorites, isLoading: loadingFavorites } = useClientFavorites();

  useEffect(() => {
    document.querySelector("#profile-nav")?.scrollIntoView();
  }, [profileData]);

  if (
    isLoading ||
    isLoadingProfile ||
    isFetching ||
    loadingReviews ||
    loadingFavorites
  ) {
    return <Loading />;
  }

  if (!profileData && user?.data?.user?.user_metadata?.role === "client") {
    return (
      <div className="w-full h-full">
        <Loading />
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
      <Layout className="pb-20">
        <ProfileNav />
        <div className="w-[800px] mx-auto">
          <div className="w-full h-full space-y-32">
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
            />

            <div className="w-full">
              <h2 className="text-2xl font-profile-header mb-10">
                Favorite Artists
              </h2>
              {!favorites || favorites.length === 0 ? (
                <div className="relative min-h-[320px] flex flex-col items-center justify-center">
                  <div className="grid grid-cols-2 auto-flow-row opacity-25 gap-x-10 gap-y-10 w-full blur-sm select-none pointer-events-none">
                    <ProfessionalDisplayCard
                      profilePicture={
                        "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                      }
                    />
                    <ProfessionalDisplayCard
                      profilePicture={
                        "https://plus.unsplash.com/premium_photo-1690587673708-d6ba8a1579a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                      }
                    />
                  </div>
                  <div className="border border-neutral-800 absolute top-1/2 left-1/2 rounded-lg shadow-2xl -translate-x-1/2 -translate-y-1/2 w-2/3 md:w-1/2 p-5 bg-black/80 text-white flex flex-col items-center">
                    <div className="text-base font-medium flex items-center gap-2">
                      <LucideInfo className="size-4" /> No Favorites Found
                    </div>
                    <div className="text-white/50 text-sm mt-2 text-center">
                      Search for artists and tap the heart icon to add them to
                      your favorites. Favorited artists will show up here.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 auto-flow-row gap-x-10 gap-y-10 ">
                  {favorites.map(
                    (
                      // eslint-disable-next-line
                      fav: any,
                      idx,
                    ) => (
                      <ProfessionalDisplayCard
                        key={fav.id || idx}
                        isFavorite={true}
                        fullName={fav.full_name || "Favorite Artist"}
                        profilePicture={fav.profile_picture || ""}
                        position={fav.position || "Artist"}
                        address={fav.address || { city: "N/A", state: "" }}
                        numYearsExperience={fav.num_years_experience || 0}
                        rating={fav.rating || 4}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
            {/*<EditProfileModal open={true} />*/}
          </div>
        </div>
      </Layout>
      <GlobalFooter />
    </>
  );
};

export default ClientProfile;
