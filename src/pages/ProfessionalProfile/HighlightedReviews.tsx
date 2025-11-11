import RatingStars from "@/components/RatingStars";
import { ProfessionalProfilePublicData } from "@/hooks/use-professional-profile-public";
import { Quote, Star } from "lucide-react";

const ReviewItem = ({
  rating,
  review,
  client_profiles,
}: ProfessionalProfilePublicData["reviews"][0]) => {
  return (
    <div className="min-w-[280px] sm:min-w-[400px] lg:max-w-[500px] backdrop-blur bg-[#0b0b0b]/50 text-white lg:min-w-[500px] min-h-[200px] h-full rounded-xl border border-white/20 border-t-0 p-4 pb-7 flex flex-col">
      <div className="flex-1">
        <div className="flex gap-1 ">
          <RatingStars rating={rating} totalRatingValue={5} />
        </div>
        <div className=" opacity-20 stroke-none size-[50px] -mb-5 -ml-3">
          <svg
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.1088 15.0215C12.3238 11.5365 17.1888 9.76953 23.5688 9.76953H25.8608V16.2295L24.0158 16.5985C20.8758 17.2265 18.6918 18.4615 17.5238 20.2745C16.9138 21.2505 16.5678 22.3685 16.5198 23.5195H23.5668C24.8318 23.5195 25.8578 24.5455 25.8578 25.8105V41.8525C25.8578 44.3805 23.8028 46.4355 21.2748 46.4355H7.5248C6.2588 46.4355 5.2328 45.4095 5.2328 44.1445V32.6855L5.2398 25.9965C5.2198 25.7425 4.7838 19.7145 9.1088 15.0215ZM46.4858 46.4355H32.7358C31.4698 46.4355 30.4438 45.4095 30.4438 44.1445V32.6855L30.4488 25.9965C30.4278 25.7425 29.9928 19.7145 34.3168 15.0215C37.5318 11.5365 42.3968 9.76953 48.7768 9.76953H51.0688V16.2295L49.2238 16.5985C46.0848 17.2265 43.9008 18.4615 42.7318 20.2745C42.1218 21.2505 41.7758 22.3685 41.7278 23.5195H48.7748C50.0408 23.5195 51.0668 24.5455 51.0668 25.8105V41.8525C51.0668 44.3805 49.0108 46.4355 46.4828 46.4355H46.4858Z"
              fill="#F58327"
            />
          </svg>
        </div>
        <p className="profile-para text-sm font-extralight relative z-1 leading-6 text-white/80">
          {review}
        </p>
      </div>
      <div className="pt-3 mt-5 border-t border-t-white/10 flex items-start gap-3">
        <img
          className="w-[40px] h-[40px] rounded-xl object-cover"
          alt=""
          src={client_profiles?.profile_picture_url}
        />
        <div className="text-sm font-profile-header">
          {client_profiles?.full_name}
        </div>
      </div>
    </div>
  );
};

// Skeleton component for a single review item
const ReviewItemSkeleton = () => {
  return (
    <div className="w-full max-w-[500px] min-w-[220px] sm:min-w-[340px] md:min-w-[400px] lg:min-w-[500px] min-h-[160px] sm:min-h-[180px] md:min-h-[200px] h-full backdrop-blur bg-[#0b0b0b]/50 text-white rounded-xl border border-white/20 border-t-0 p-4 pb-7 flex flex-col animate-pulse">
      <div className="flex-1">
        <div className="flex gap-1 mb-2">
          <div className="w-16 sm:w-24 h-4 bg-gray-700 rounded" />{" "}
          {/* Rating stars */}
        </div>
        <div className="h-[40px] sm:h-[50px] -mb-5 -ml-3" />{" "}
        {/* Placeholder for quote icon */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-10/12 sm:w-11/12" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-8/12 sm:w-10/12" />
        </div>
      </div>
      <div className="pt-3 mt-5 border-t border-t-white/10 flex items-start gap-3">
        <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-xl bg-gray-700" />
        {/* Profile picture */}
        <div className="text-sm font-profile-header flex-1">
          <div className="h-4 bg-gray-700 rounded w-20 sm:w-32" />{" "}
          {/* Client name */}
        </div>
      </div>
    </div>
  );
};

type HighlightedReviewsProps = {
  profileData?: ProfessionalProfilePublicData;
  isLoading?: boolean;
};

const HighlightedReviews = ({
  profileData,
  isLoading,
}: HighlightedReviewsProps) => {
  const reviews = profileData?.reviews;

  const renderContent = () => {
    if (isLoading) {
      // Render 3 skeleton items when loading
      return (
        <>
          {[...Array(3)].map((_, i) => (
            <ReviewItemSkeleton key={i} />
          ))}
        </>
      );
    }

    if (!reviews || reviews.length === 0) {
      // Render empty state if no reviews and not loading
      return (
        <div className="flex flex-col items-center justify-center p-10 text-white/50 min-h-[200px] min-w-[500px]">
          <Quote className="size-10 mb-4" />
          <p className="text-lg">No reviews yet.</p>
          <p className="text-sm mt-1">Be the first to leave a review!</p>
        </div>
      );
    }

    // Render actual reviews
    return reviews
      .slice(0, 10)
      .map((review, i) => <ReviewItem {...review} key={review.id} />);
  };

  return (
    <div className="overflow-hidden w-full h-fit relative py-10">
      <div className="h-[200px] overflow-hidden  blur-xl absolute top-0 left-1/2 -translate-x-1/2">
        <div className=" bg-brand/25 rounded-full  w-[650px] h-[400px] -translate-y-1/2" />
      </div>
      <div className="flex items-center max-w-full   h-fit overflow-y-hidden overflow-x-scroll hide-scrollbar gap-10 relative scrollbar-none">
        {renderContent()}
      </div>
      <div className="absolute top-0 right-0 w-[50px] h-full bg-gradient-to-r from-transparent to-[#0b0b0b] " />
    </div>
  );
};

export default HighlightedReviews;
