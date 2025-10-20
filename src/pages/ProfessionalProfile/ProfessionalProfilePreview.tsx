import BasicInfo from "./BasicInfo";
import HighlightedReviews from "./HighlightedReviews";
import ReferralSection from "./ReferralSection";
import Gallery from "./Gallery";
import Reviews from "@/components/Reviews";
import { useMemo } from "react";
import { X } from "lucide-react";

// NOTE: The data for the preview is now passed in as props.
interface ProfessionalProfilePreviewProps {
  onClose: () => void;
  profileData: any; // This should be the type of the form data
  reviews: any[];
  isLoading?: boolean;
}

const ProfessionalProfilePreview = ({
  onClose,
  profileData,
  reviews,
  isLoading,
}: ProfessionalProfilePreviewProps) => {
  const profileDataForPreview = useMemo(() => {
    if (!profileData) {
      return undefined;
    }
    return {
      ...profileData,
      reviews: reviews || [],
    };
  }, [profileData, reviews]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-start pt-10 pb-10">
      <div className="bg-[#0F0F0F] text-white rounded-lg shadow-xl w-full max-w-4xl h-full flex flex-col">
        <div className="p-4 rounded-tl-lg rounded-tr-lg border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#18181A] z-10">
          <h2 className="text-xl font-bold">Profile Preview</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          <div className="w-full h-full space-y-32 p-8">
            <BasicInfo profileData={profileData} isLoading={isLoading} />
            <HighlightedReviews
              profileData={profileDataForPreview as any}
              isLoading={isLoading}
            />
            <ReferralSection
              referralCode={profileData?.referral_code}
              isLoading={isLoading}
            />
            <Gallery profileData={profileData} isLoading={isLoading} />
            <Reviews
              isLoading={isLoading}
              reviews={reviews || []}
              mode={"professional-dashboard-public"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePreview;
