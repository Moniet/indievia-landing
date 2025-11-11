import Layout from "@/components/Layout";
import { ProfileNav } from "@/components/ProfileNav";
import BasicInfo from "./BasicInfo";
import HighlightedReviews from "./HighlightedReviews";
import ReferralSection from "./ReferralSection";
import Gallery from "./Gallery";
import Reviews from "@/components/Reviews";
import GlobalFooter from "@/components/Footer";
import { useProfessionalProfilePublic } from "@/hooks/use-professional-profile-public";
import { useReviews } from "@/hooks/user-reviews";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import useUser from "@/hooks/use-user";

const ProfessionalProfile = () => {
  const [{ profileData, error, ...profileQueryRest }, isProfileLoading] =
    useProfessionalProfilePublic();
  const [{ user }] = useUser();
  const { profileSlug } = useParams();
  const { data, isLoading: isLoadingReviews } = useReviews(profileSlug);
  const reviewPages = data?.pages;
  const reviews = useMemo(() => {
    return reviewPages?.flatMap((p) => p.data.reviews);
  }, [reviewPages]);

  const isProfessionalsPage = user?.data?.user?.id === profileData?.user_id;

  return (
    <>
      <Layout>
        <div className="w-full h-full ">
          <ProfileNav />
          <div className="w-full h-full space-y-32">
            <BasicInfo
              profileData={profileData}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <HighlightedReviews
              profileData={profileData}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <ReferralSection
              referralCode={profileData?.referral_code}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <Gallery
              profileData={profileData}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <Reviews
              onClickViewMore={() => {}}
              isLoadingViewMore={false}
              isLoading={isLoadingReviews}
              reviews={reviews || []}
              professionalProfilePicture={profileData?.profile_picture_url}
              mode={
                isProfessionalsPage
                  ? "professional-dashboard-private"
                  : "professional-dashboard-public"
              }
            />
          </div>
        </div>
      </Layout>
      <GlobalFooter />
    </>
  );
};

export default ProfessionalProfile;
