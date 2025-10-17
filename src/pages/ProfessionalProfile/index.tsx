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

const ProfessionalProfile = () => {
  const [{ profileData, error, ...profileQueryRest }, isProfileLoading] =
    useProfessionalProfilePublic();
  const { profileSlug } = useParams();
  const { data, isLoading: isLoadingReviews } = useReviews(profileSlug);
  const reviewPages = data?.pages;
  const reviews = useMemo(() => {
    return reviewPages?.flatMap((p) => p.data.reviews);
  }, [reviewPages]);

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
              profileData={profileData}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <Gallery
              profileData={profileData}
              isLoading={isProfileLoading}
              {...profileQueryRest}
            />
            <Reviews
              isLoading={isLoadingReviews}
              reviews={reviews || []}
              mode={"professional-dashboard-public"}
            />
          </div>
        </div>
      </Layout>
      <GlobalFooter />
    </>
  );
};

export default ProfessionalProfile;
