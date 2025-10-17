import { MapPin, Star } from "lucide-react";
import { Noise, NoiseContent } from "react-noise";
import "react-noise/css";

type Props = {
  isFavorite: boolean;
  address: {
    city: string;
    state: string;
  };
  fullName: string;
  profilePicture: string;
  position: string;
  rating: number;
  numYearsExperience: number;
};

const defaultData: Props = {
  isFavorite: false,
  address: {
    city: "Los Angeles",
    state: "California",
  },
  profilePicture:
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHwwfDB8fHww",
  fullName: "Alex McFarlin",
  position: "Body Piercing, Tattoo Artist",
  numYearsExperience: 8,
  rating: 4.5,
};

const ProfessionalDisplayCard = (props) => {
  const {
    isFavorite,
    address,
    profilePicture,
    fullName,
    position,
    numYearsExperience,
    rating,
  } = defaultData;

  return (
    <article className="w-full h-full flex flex-col">
      <div className="w-full h-full relative">
        <img
          className="w-full object-cover min-h-[300px] aspect-[0.9]"
          src={props.profilePicture || profilePicture}
          alt={`Profile Picture of ${fullName}`}
        />
        <Noise opacity={1} className="absolute top-0 left-0 w-full h-full" />

        <div className=" absolute top-3 left-3 bg-white/20 rounded-full p-2 flex gap-2 items-center text-sm">
          <MapPin className="size-5" />
          <span>
            {address.city} {address.state}
          </span>
        </div>
      </div>
      <div>
        <section className="text-base font-profile-header flex items-center w-full justify-beteween">
          <h2 className="text-lg mt-2 w-full">{fullName}</h2>
          <div className="flex items-center font-profile-header text-sm mt-2">
            <Star className="fill-brand stroke-none size-4 mr-2" /> {rating}
          </div>
        </section>
        <section className="text-sm flex items-center">
          <span className="tracking-widest text-brand/80 mr-2">//</span>
          <span className="text-white/50 font-light mt-[2px]">{position}</span>
        </section>
      </div>
    </article>
  );
};

export default ProfessionalDisplayCard;
