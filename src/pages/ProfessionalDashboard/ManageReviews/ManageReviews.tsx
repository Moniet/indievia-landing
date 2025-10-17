import React, { useMemo, useState } from "react";
import { Search, Star, Flag, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Review = {
  id: string;
  name: string;
  avatarText: string;
  date: string; // ISO date
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
};

const MOCK_DISTRIBUTION = {
  5: 128,
  4: 24,
  3: 8,
  2: 2,
  1: 0,
};
const TOTAL_REVIEWS = Object.values(MOCK_DISTRIBUTION).reduce(
  (a, b) => a + b,
  0,
);
const AVERAGE_RATING = 4.7;

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Marcus Johnson",
    avatarText: "MJ",
    date: new Date().toISOString(),
    rating: 5,
    text: "Olivia is amazing! She completely understood the concept I had in mind and turned it into a piece of art that feels so personal. Her lineworkzed is precise, and the shading looks incredible. Can't wait to book my next session with her.",
  },
  {
    id: "r2",
    name: "Olivia Martin",
    avatarText: "OM",
    date: "2025-09-16T10:00:00.000Z",
    rating: 4,
    text: "Olivia has such a unique style. You can tell she's passionate about her craft, and it shows in every detail. The atmosphere in her studio was relaxed and welcoming, and the tattoo healed beautifully. I've already recommended her to a couple of friends.",
  },
  {
    id: "r3",
    name: "Liam Roberts",
    avatarText: "LR",
    date: "2025-09-09T11:30:00.000Z",
    rating: 5,
    text: "This was my second tattoo, but my first with Olivia — and I'm so glad I found her. She made me feel comfortable from start to finish, explained the process clearly, and really listened to what I wanted. The result was even better than I imagined.",
  },
];

type SortKey = "newest" | "oldest" | "highest" | "lowest";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `Today | ${hh}:${mm}`;
  }
  // dd-mm-yyyy
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const Stars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {new Array(5).fill(null).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-yellow-500 stroke-yellow-500"
              : "fill-white/20 stroke-none"
          }`}
        />
      ))}
    </div>
  );
};

const DistributionRow = ({
  stars,
  count,
  total,
  color = "bg-brand",
}: {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
  total: number;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-[42px] justify-end">
        <span className="text-xs text-white/70">★</span>
        <span className="text-xs text-white/70">{stars}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 w-[240px] overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-xs text-white/70">{count}</div>
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [replying, setReplying] = useState(false);
  return (
    <div className="rounded-xl border border-white/5 bg-[#18181A] p-5 max-w-[750px]">
      <div className="text-white/50 text-xs font-light mb-2">
        {new Date().toISOString().slice(0, 10) ===
        new Date(review.date).toISOString().slice(0, 10) ? (
          <div className="flex gap-2">
            <span>Today</span>
            <span>|</span>
            <span>{new Date(review.date).toLocaleTimeString()}</span>
          </div>
        ) : (
          new Date(review.date).toISOString().slice(0, 10)
        )}
      </div>
      <div className="flex items-start gap-4">
        <Avatar className="size-10">
          <AvatarFallback className="bg-white/10 text-white text-sm">
            {review.avatarText}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white text-sm font-medium">
                {review.name}
              </div>
            </div>
            <Stars rating={review.rating} />
          </div>
          <p className="text-sm font-light leading-5 text-white/50 w-2/3">
            {review.text}
          </p>
          <div className="pt-2 flex justify-end items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs text-white/80 hover:bg-white/10 bg-white/5 rounded-full duration-300 font-light"
            >
              <Flag className="size-3.5" strokeWidth={1.5} />
              Report
            </Button>
            <Button
              className="h-8 rounded-full px-4 text-xs bg-[#EE714E]  hover:bg-[#ED613A] transition-colors duration-300 font-light"
              onClick={() => setReplying((r) => !r)}
            >
              Reply
            </Button>
          </div>
          {replying && (
            <div className="mt-3">
              <textarea
                className="w-full rounded-md bg-black/30 border border-white/10 text-sm text-white placeholder:text-white/40 p-3 outline-none focus:ring-2 focus:ring-brand"
                rows={3}
                placeholder="Write a public reply..."
              />
              <div className="mt-2 flex items-center gap-2">
                <Button className="h-8 px-4 text-xs bg-employIn-blue hover:bg-employIn-darkBlue">
                  Post reply
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs text-white/70 hover:bg-white/10"
                  onClick={() => setReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ManageReviews = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = [...MOCK_REVIEWS];
    if (q) {
      arr = arr.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          formatDate(r.date).toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "newest":
        arr.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case "oldest":
        arr.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "highest":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        arr.sort((a, b) => a.rating - b.rating);
        break;
    }
    return arr;
  }, [query, sort]);

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl">Manage reviews</h1>
        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
          <Input
            className="pl-9 bg-[#0f0f0f] border-white/10 placeholder:text-white/50 text-sm"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats + Distribution */}
      <div className="w-full rounded-xl mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 max-w-[750px] divide-x divide-white/10">
          <div className="">
            <div className="text-base font-medium">Total Reviews</div>
            <div className="text-3xl mt-1">{TOTAL_REVIEWS}</div>
            <div className="text-[11px] text-white/40 mt-1">
              Growth in reviews
            </div>
          </div>
          <div className="pl-5">
            <div className="text-base font-medium">Average Rating</div>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-3xl">{AVERAGE_RATING}</div>
            </div>
            <div className="text-[11px] text-white/40 mt-1">
              Growth in reviews
            </div>
          </div>
          <div className="pl-5">
            <div className="space-y-2">
              <DistributionRow
                stars={5}
                count={MOCK_DISTRIBUTION[5]}
                total={TOTAL_REVIEWS}
                color={"bg-green-400"}
              />
              <DistributionRow
                stars={4}
                color={"bg-purple-400"}
                count={MOCK_DISTRIBUTION[4]}
                total={TOTAL_REVIEWS}
              />
              <DistributionRow
                stars={3}
                color={"bg-yellow-400"}
                count={MOCK_DISTRIBUTION[3]}
                total={TOTAL_REVIEWS}
              />
              <DistributionRow
                stars={2}
                color={"bg-blue-400"}
                count={MOCK_DISTRIBUTION[2]}
                total={TOTAL_REVIEWS}
              />
              <DistributionRow
                color={"bg-red-400"}
                stars={1}
                count={20}
                total={TOTAL_REVIEWS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="text-lg text-white">Newest</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 px-3 text-xs bg-[#141414] border border-white/10 hover:bg-white/10"
            >
              Sort by
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setSort("newest")}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("oldest")}>
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("highest")}>
              Highest rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("lowest")}>
              Lowest rating
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-white/60 text-sm py-10">
            No reviews match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
