import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfessionalDisplayCard from "@/components/ProfessionalDisplayCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedArtists = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Checks if the content is wider than the container
  const checkOverflow = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  // Run check on mount and on window resize
  useEffect(() => {
    // Initial check
    checkOverflow();

    // Add resize listener
    window.addEventListener("resize", checkOverflow);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Scroll by 50% of the visible width for a smoother experience
      const scrollAmount = current.clientWidth * 0.5;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-24 max-w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-profile-header">Featured Artists</h2>
        {isOverflowing && (
          <div className="ml-auto flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="size-[40px] bg-white/5 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/20"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="size-[40px] bg-white/5 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/20"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
      {/* This outer div hides the scrollbar which is pushed down by the padding/margin on the inner div */}
      <div className="overflow-hidden mt-8">
        <motion.div
          ref={scrollContainerRef}
          // The padding-bottom and negative margin-bottom trick hides the horizontal scrollbar
          className="flex w-full gap-8 pb-4 -mb-4 overflow-x-auto"
          // Add styles to hide scrollbar for firefox and enable momentum scrolling on touch devices
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {/* We can add a global style for ::-webkit-scrollbar { display: none; } for a cleaner approach */}
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
          <ProfessionalDisplayCard />
        </motion.div>
      </div>
    </div>
  );
};
