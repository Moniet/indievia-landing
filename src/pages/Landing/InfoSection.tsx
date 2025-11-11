import { AnimatePresence, motion } from "framer-motion";

export const InfoSection = ({ mode = "professional" }) => {
  return (
    <section className="pt-20">
      <AnimatePresence initial={false}>
        {mode === "professional" && (
          <motion.article
            className="mt-32 md:mt-20"
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-2xl text-white font-light">
              Discover the best talent on IndieVia!
            </h1>
            <p className=" max-sm:text-sm font-extralight text-[#8e8e8e] max-w-[500px] mt-5">
              Join <b className="text-white font-light">IndieVia</b>, the only
              review-based platform catered to professionals within the body
              piercing and tattooing industry with no booking sign-up required.
              Think Yelp, but for individual professionals. Create your profile
              and discover the best in the industry!
            </p>
          </motion.article>
        )}
      </AnimatePresence>

      <div className="flex gap-5 lg:gap-7 mt-12 flex-wrap">
        <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313]">
          <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
            <svg
              className="max-sm:max-h-[100px]"
              viewBox="0 0 185 93"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="46.1934" cy="46.1973" r="46.1934" fill="#282828" />
              <path
                d="M92.3887 0C98.4549 0 104.462 1.19483 110.066 3.51626C115.671 5.83769 120.763 9.24027 125.052 13.5297C129.342 17.8192 132.744 22.9115 135.066 28.5159C137.387 34.1204 138.582 40.1272 138.582 46.1934C138.582 52.2596 137.387 58.2664 135.066 63.8708C132.744 69.4752 129.342 74.5675 125.052 78.857C120.763 83.1464 115.671 86.549 110.066 88.8705C104.462 91.1919 98.4549 92.3867 92.3887 92.3867L92.3887 46.1934V0Z"
                fill="#282828"
              />
              <path
                d="M138.584 0C144.65 0 150.657 1.19483 156.261 3.51626C161.866 5.83769 166.958 9.24027 171.248 13.5297C175.537 17.8192 178.94 22.9115 181.261 28.5159C183.583 34.1204 184.777 40.1272 184.777 46.1934C184.777 52.2596 183.583 58.2664 181.261 63.8708C178.94 69.4752 175.537 74.5675 171.248 78.857C166.958 83.1464 161.866 86.549 156.261 88.8705C150.657 91.1919 144.65 92.3867 138.584 92.3867L138.584 46.1934V0Z"
                fill="#282828"
              />
            </svg>
          </div>
          <h1 className="text-sm sm:text-base font-light text-white ">
            Free profile creation
          </h1>
          <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
            {mode === "professional" &&
              `Set up a professional profile that reflects your services, and
           personality.`}
            {mode === "client" &&
              `Set up a reviewer profile with a bio & profile-picture that reflects
           personality.`}
          </p>
        </article>
        <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313] lg:scale-[1.06]">
          <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
            <svg
              className="max-sm:max-h-[100px]"
              viewBox="0 0 200 93"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 53.5938C4.15737e-05 46.5559 1.38686 39.5871 4.08008 33.085C6.7734 26.5827 10.7207 20.6739 15.6973 15.6973C20.6739 10.7206 26.5827 6.77343 33.085 4.08008C39.5873 1.38672 46.5567 -3.07644e-07 53.5947 0C60.6326 4.15743e-05 67.6013 1.38682 74.1035 4.08008C80.6058 6.77343 86.5145 10.7206 91.4912 15.6973C96.4679 20.6739 100.415 26.5826 103.108 33.085C105.802 39.5871 107.188 46.5559 107.188 53.5938L0 53.5938ZM0 92.3896V53.6055L107.188 53.6055V92.3896H0Z"
                fill="#282828"
              />
              <path
                d="M153.384 92.39C147.318 92.39 141.311 91.1951 135.706 88.8736C130.101 86.5521 125.009 83.1494 120.719 78.8598C116.43 74.5702 113.027 69.4777 110.705 63.8731C108.384 58.2684 107.189 52.2614 107.189 46.195C107.189 40.1286 108.384 34.1216 110.705 28.5169C113.027 22.9123 116.43 17.8198 120.719 13.5302C125.009 9.2406 130.101 5.8379 135.706 3.51638C141.311 1.19487 147.318 -5.30343e-07 153.384 0L153.384 46.195V92.39Z"
                fill="#282828"
              />
            </svg>
          </div>
          <h1 className="text-sm sm:text-base font-light text-white ">
            Discover artists in your locale
          </h1>
          <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
            Discover top tattoo artists in your city or show your support by
            dropping a review.
          </p>
        </article>
        <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313]">
          <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
            <svg
              className="max-sm:max-h-[100px]"
              viewBox="0 0 175 94"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="92.7844" cy="47.0856" r="46.195" fill="#282828" />
              <path
                d="M46.5897 93.2806C40.5233 93.2806 34.5162 92.0858 28.9116 89.7642C23.307 87.4427 18.2145 84.04 13.9249 79.7504C9.63527 75.4608 6.23257 70.3683 3.91106 64.7637C1.58954 59.159 0.394669 53.152 0.394669 47.0856C0.394669 41.0192 1.58954 35.0122 3.91106 29.4076C6.23257 23.8029 9.63527 18.7104 13.9249 14.4208C18.2145 10.1312 23.307 6.72852 28.9116 4.40701C34.5162 2.08549 40.5233 0.890624 46.5897 0.890625L46.5897 47.0856V93.2806Z"
                fill="#282828"
              />
              <rect
                x="138.98"
                y="0.890625"
                width="35.3906"
                height="92.39"
                fill="#282828"
              />
            </svg>
          </div>
          <h1 className="text-sm sm:text-base font-light text-white">
            Spam filters
          </h1>
          <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
            We've implemented top-notch spam filters, so you'll only see high
            quality and legitimate reviews!
          </p>
        </article>

        <article className="flex flex-1 p-4 min-[500px]:max-w-[300px] min-w-[200px] flex-col rounded-lg bg-[#131313] lg:scale-[1.06]">
          <div className="w-full h-[180px]  px-4 md:px-0 xl:px-6 2xl:px-8 flex items-center justify-center">
            <svg
              className="max-sm:max-h-[100px]"
              viewBox="0 0 175 93"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="128.293" cy="46.5856" r="46.195" fill="#282828" />
              <path
                d="M46.7073 92.7806C40.6409 92.7806 34.6339 91.5858 29.0293 89.2642C23.4246 86.9427 18.3321 83.54 14.0425 79.2504C9.75294 74.9608 6.35024 69.8683 4.02873 64.2637C1.70721 58.659 0.512344 52.652 0.512344 46.5856C0.512344 40.5192 1.70721 34.5122 4.02873 28.9076C6.35025 23.3029 9.75294 18.2104 14.0425 13.9208C18.3322 9.63122 23.4247 6.22852 29.0293 3.90701C34.6339 1.58549 40.6409 0.390624 46.7073 0.390625L46.7073 46.5856V92.7806Z"
                fill="#282828"
              />
              <rect
                x="46.707"
                y="0.390625"
                width="35.3906"
                height="92.39"
                fill="#282828"
              />
            </svg>
          </div>
          <h1 className="text-sm sm:text-base font-light text-white ">
            {/*{mode === "professional" && "No bookings required"}*/}
            Contact Professionals Directly
          </h1>
          <p className="font-extralight text-[#8e8e8e] text-xs sm:text-sm mt-2">
            {/*{mode === "professional" &&
              `We’re not a scheduling platform, which means you stay in
         control. Clients find you, explore your work, and reach out
         directly.`}*/}
            All professionals have a contact section on their profile, you can
            book directly with them!
          </p>
        </article>
      </div>
    </section>
  );
};
