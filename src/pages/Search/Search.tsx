import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select/async";
import { toast } from "sonner";
import { professionalTags } from "../ProfessionalDashboard/Profile/tags";
import { SearchResults } from "./SearchResults";

// Flatten the professionalTags to a simple array of strings (labels)
const TAGS = professionalTags.flatMap((group) =>
  group.options.map((option) => option.label),
);

export const SearchInput = ({ onSearch = () => {}, onClear = () => {} }) => {
  const [error, setError] = useState<{ location?: string; search?: string }>({
    location: "",
  });
  const [location, setLocation] = useState("");
  const timeout = useRef<NodeJS.Timeout>();
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocussed, setIsFocussed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // State for tag suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchCityState = async (query: string) => {
    clearTimeout(timeout.current);

    return await new Promise((resolve) => {
      timeout.current = setTimeout(async () => {
        const { data } = await supabase.functions.invoke(
          "city_state" + `?q=${encodeURIComponent(query)}`,
          { method: "GET" },
        );

        resolve(
          data.map((d: any) => ({
            label: `${d.name}, ${d.state}`,
            value: `${d.name}-${d.state}`,
          })),
        );
      }, 300);
    });
  };

  const makeSearch = async (query: string) => {
    clearTimeout(searchTimeout.current);
    onSearch?.();

    setIsLoading(true);

    try {
      const { data, error: error } = await supabase.functions.invoke(
        "search" +
          `?q=${encodeURIComponent(query)} ${encodeURIComponent(location)}`,
        { method: "GET" },
      );

      if (error) {
        toast.error("Oops! Something went wrong when making your search.");
        return;
      }

      setResults(data?.results);
    } catch (e) {
      toast.error("Oops! Something went wrong when making your search.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cacheLocation = localStorage.getItem("location-pref");
    if (cacheLocation) setLocation(cacheLocation);
  }, []);

  const locationValue = useMemo(
    () => (location ? { label: location, value: location } : undefined),
    [location],
  );

  const handleSearch = async () => {
    setShowSuggestions(false);
    setSearchAttempted(true);
    makeSearch(search || "");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      onClear();
      setShowSuggestions(false);
      return;
    }

    const words = value.split(" ");
    const currentWord = words[words.length - 1].toLowerCase();

    if (currentWord) {
      const filteredSuggestions = TAGS.filter((tag) =>
        tag.toLowerCase().startsWith(currentWord),
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = search.split(" ");
    words[words.length - 1] = suggestion;
    setSearch(words.join(" ") + " ");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <div
        onFocus={() => {
          setIsFocussed(true);
          // When focusing the container (e.g., by clicking the input),
          // re-evaluate if suggestions should be shown.
          if (search) {
            handleSearchChange({ target: { value: search } } as any);
          }
        }}
        onBlur={() => {
          // We use a short timeout to allow click events on suggestions to register
          // before we hide the dropdown.
          setTimeout(() => {
            setShowSuggestions(false);
            setIsFocussed(false);
          }, 150);
        }}
        onKeyDownCapture={(e) => {
          if (isFocussed && e.key == "Enter") {
            handleSearch();
          }
        }}
        className="md:bg-neutral-800 max-md:flex-col-reverse md:h-16 rounded-full max-w-[750px] mx-auto md:focus-within:border-neutral-500 md:border border-neutral-700 md:pl-7 flex justify-between items-stretch"
      >
        <div className="h-full flex py-3 max-md:w-full">
          <div className="flex flex-col max-md:items-start md:items-center">
            <div className="flex cursor-pointer items-center  gap-3 md:gap-4 pr-3 md:pr-5 md:border-r-2 max-md:border max-md:rounded-full max-md:pl-4">
              <MapPin className="size-3.5 md:size-4" />
              <div className="focus:outline-none min-w-20">
                <Select
                  cacheOptions
                  defaultOptions={[
                    {
                      label: "Seattle, Washington",
                      value: "Seattle, Washington",
                    },
                    {
                      label: "New York, New York",
                      value: "New York, New York",
                    },
                    { label: "Chicago, Illinois", value: "Chicago, Illinois" },
                    { label: "Miami, Florida", value: "Miami, Florida" },
                    { label: "Portland, Oregon", value: "Portland, Oregon" },
                    // Added major cities
                    {
                      label: "Los Angeles, California",
                      value: "Los Angeles, California",
                    },
                    {
                      label: "San Francisco, California",
                      value: "San Francisco, California",
                    },
                    { label: "Houston, Texas", value: "Houston, Texas" },
                    {
                      label: "Boston, Massachusetts",
                      value: "Boston, Massachusetts",
                    },
                    { label: "Atlanta, Georgia", value: "Atlanta, Georgia" },
                  ]}
                  value={locationValue}
                  onChange={(v: any) => {
                    localStorage.setItem("location-pref", v.label);
                    setLocation(v.label);
                    setError({ ...error, location: "" });
                  }}
                  placeholder="City, State"
                  className="w-full"
                  loadOptions={fetchCityState}
                  unstyled
                  classNames={{
                    control: () => "text-xs md:text-sm",
                    menu: () =>
                      "bg-neutral-900 border min-w-[200px] rounded-lg",
                    menuList: () => "divide-y",
                    option: () =>
                      "text-sm text-white/70 px-4 py-2 hover:text-white transition-color",
                  }}
                />
              </div>
            </div>
            <div className="text-xs mt-4 text-red-500 empty:hidden">
              {error.location}
            </div>
          </div>
        </div>
        <div className="flex flex-1 max-md:rounded-full max-md:bg-neutral-800 max-md:focus-within:border-neutral-500 max-md:border border-neutral-700 ">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={search}
              onChange={handleSearchChange}
              autoComplete="off"
              placeholder="tattoo, ear piercing, tongue piercing, in Tampa"
              className="size-full font-light text-sm bg-transparent px-5 border-none focus:outline-none placeholder:text-white/50 placeholder:font-light"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full top-full mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl">
                <ul className="divide-y divide-neutral-700 max-h-60 overflow-y-auto">
                  {suggestions.slice(0, 7).map((tag) => (
                    <li
                      key={tag}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(tag);
                      }}
                      className="px-4 py-2 text-sm text-white/70 cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-xs mt-2 text-red-500 ml-5 empty:hidden">
              {error.search}
            </div>
          </div>
          <div className="p-2 flex h-full items-center">
            <button
              onClick={handleSearch}
              aria-label="Submit"
              className="size-[40px] md:size-[50px] shadow-lg rounded-full transition-color hover:bg-brand/90  bg-brand flex "
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-5 m-auto" />
              ) : (
                <Search className="size-5 text-white m-auto" />
              )}
            </button>
          </div>
        </div>
      </div>

      <SearchResults
        results={results}
        isLoading={isLoading}
        searchAttempted={searchAttempted}
      />
    </>
  );
};
