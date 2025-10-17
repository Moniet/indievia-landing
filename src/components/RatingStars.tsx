import { Star } from "lucide-react";
import { useState } from "react";

const starClass = (mode: "read" | "write", size) =>
  `fill-white/20 stroke-none ${size} ${mode === "write" ? "cursor-normal" : ""} ${mode === "write" ? "hover:fill-brand" : ""}`;
const RatingStars = ({
  rating,
  totalRatingValue = 5,
  mode = "read",
  setRating,
  color = "fill-brand",
  size = "size-3",
}: {
  rating: number;
  totalRatingValue?: number;
  mode?: "read" | "write";
  color?: string;
  setRating?: (rating: number) => void;
  size?: string;
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const starsCount = totalRatingValue ?? 5;

  // Which value to display as highlighted: the hovered one during hover, otherwise the actual rating.
  const displayHighlight = hoveredStar !== null ? hoveredStar : rating;

  return (
    <div className="flex gap-1 items-center relative">
      {[...Array(starsCount)].map((_, i) => (
        <Star
          key={i}
          className={starClass(mode, size)}
          onClick={mode === "write" ? () => setRating?.(i + 1) : undefined}
          onMouseEnter={
            mode === "write" ? () => setHoveredStar(i + 1) : undefined
          }
          onMouseLeave={
            mode === "write" ? () => setHoveredStar(null) : undefined
          }
        />
      ))}
      <div className="flex absolute pointer-events-none top-0 left-0 w-full gap-1">
        {[...Array(starsCount)].map((_, i) => (
          <Star
            key={i}
            className={`${color} stroke-none ${size}`}
            style={{ opacity: displayHighlight >= i + 1 ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default RatingStars;
