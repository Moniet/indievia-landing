import ProfessionalDisplayCard from "@/components/ProfessionalDisplayCard";
import { SearchSlashIcon } from "lucide-react";
import { motion } from "framer-motion";

const SkeletonItem = () => {
  return (
    <article className="w-full h-full flex-shrink-0 max-w-[350px] flex flex-col animate-pulse">
      <div className="relative">
        <div className="w-full bg-zinc-700 min-h-[300px] aspect-[0.9]" />
        <div className="absolute top-3 left-3 h-9 w-40 rounded-full bg-zinc-600/50" />
      </div>
      <div>
        <section className="mt-2 flex w-full items-center justify-between">
          <div className="h-6 w-3/4 rounded bg-zinc-700" />
          <div className="h-5 w-12 rounded bg-zinc-700" />
        </section>
        <section className="mt-1 flex items-center">
          <div className="h-4 w-1/2 rounded bg-zinc-700" />
        </section>
      </div>
    </article>
  );
};

const fallbackData = [
  {
    is_favorite: false,
    city: "Los Angeles",
    state: "California",
    profile_picture_url:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHwwfDB8fHww",
    full_name: "Alex McFarlin",
    position: "Body Piercing, Tattoo Artist",
    avg_rating: "4.5",
    slug: "",
    id: "1",
  },
  {
    is_favorite: false,
    city: "Los Angeles",
    state: "California",
    profile_picture_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
    full_name: "Alex McFarlin",
    position: "Body Piercing, Tattoo Artist",
    avg_rating: "4.5",
    slug: "",
    id: "1",
  },
  {
    is_favorite: false,
    city: "Los Angeles",
    state: "California",
    profile_picture_url:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
    full_name: "Alex McFarlin",
    position: "Body Piercing, Tattoo Artist",
    avg_rating: "4.5",
    slug: "",
    id: "1",
  },
  // {
  //   is_favorite: false,
  //   city: "Los Angeles",
  //   state: "California",
  //   profile_picture_url:
  //     "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  //   full_name: "Alex McFarlin",
  //   position: "Body Piercing, Tattoo Artist",
  //   avg_rating: "4.5",
  //   slug: "",
  //   id: "1",
  // },
  // {
  //   is_favorite: false,
  //   city: "Los Angeles",
  //   state: "California",
  //   profile_picture_url:
  //     "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  //   full_name: "Alex McFarlin",
  //   position: "Body Piercing, Tattoo Artist",
  //   avg_rating: "4.5",
  //   slug: "",
  //   id: "1",
  // },
  // {
  //   is_favorite: false,
  //   city: "Los Angeles",
  //   state: "California",
  //   profile_picture_url:
  //     "https://images.unsplash.com/photo-1526510747491-58f928ec870f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  //   full_name: "Alex McFarlin",
  //   position: "Body Piercing, Tattoo Artist",
  //   avg_rating: "4.5",
  //   slug: "",
  //   id: "1",
  // },
  // {
  //   is_favorite: false,
  //   city: "Los Angeles",
  //   state: "California",
  //   profile_picture_url:
  //     "https://images.unsplash.com/photo-1596075780750-81249df16d19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  //   full_name: "Alex McFarlin",
  //   position: "Body Piercing, Tattoo Artist",
  //   avg_rating: "4.5",
  //   slug: "",
  //   id: "1",
  // },
];

export const SearchResults = ({
  results,
  isLoading,
  searchAttempted = false,
}) => {
  if (!isLoading && !results?.length && searchAttempted)
    return (
      <motion.div className="flex relative">
        <div className="flex gap-10 flex-wrap mt-20 max-md:max-h-[500px] max-md:overflow-hidden blur-md pointer-events-none select-none">
          {fallbackData.map((fb, i) => (
            <ProfessionalDisplayCard key={i} {...fb} />
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 max-md:text-balance max-md:w-2/3 -translate-x-1/2 -translate-y-1/2 flex items-center max-md:flex-col max-md:gap-5">
          <div className="p-2 bg-white/10 size-fit rounded-lg border border-white/5 mr-3">
            <SearchSlashIcon className="size-5" />
          </div>
          <span className="text-sm text-center md:text-lg font-medium">
            We couldn't find any professionals for this query.
          </span>
        </div>
      </motion.div>
    );

  return (
    <div className="flex gap-10 flex-wrap mt-20">
      {isLoading && (
        <>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </>
      )}

      {results?.map((r) => (
        <ProfessionalDisplayCard key={r.id} {...r} />
      ))}
    </div>
  );
};
