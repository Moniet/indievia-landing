export const LandingAbout = () => {
  return (
    <div className="bg-no-repeat p-10 [background-image:url('/landing-about.jpg')] bg-cover max-md:[background-position-x:50%] md:bg-contain w-full md:h-[700px] py-20 flex flex-col justify-between relative">
      <div className="h-[100px] absolute top-0 left-0 w-full from-transparent  to-[#0F0F0F] bg-gradient-to-t -translate-y-1/4" />
      <div className="h-[100px] absolute max-md:hidden bottom-0 left-0 w-full from-transparent  to-[#0F0F0F] -translate-y-1/4 bg-gradient-to-b" />
      <div className="h-full w-16 absolute bottom-0 left-0 from-transparent  to-[#0F0F0F] bg-gradient-to-l" />
      <div className="h-full w-16 absolute bottom-0 right-0 from-transparent  to-[#0F0F0F] bg-gradient-to-r" />
      <div className="md:flex justify-center max-md:grid max-md:grid-cols-2 max-md:gap-y-4 ">
        <div className="w-[150px] md:w-[180px] xl:w-[200px] aspect-square md:-mr-5 bg-white/10  rounded-full flex-col flex text-white items-center justify-center ">
          <div className="text-xl md:text-3xl xl:text-4xl font-profile-header">
            600+
          </div>
          <div className="text-sm md:text-base font-light">
            Professional artists
          </div>
        </div>
        <div className="w-[150px] md:w-[180px] xl:w-[200px] aspect-square md:-mr-5 bg-white/10  rounded-full flex-col flex text-white items-center justify-center ">
          <div className="text-xl md:text-3xl xl:text-4xl font-profile-header">
            1000+
          </div>
          <div className="text-sm md:text-base font-light">
            Successful Links
          </div>
        </div>
        <div className="w-[150px] md:w-[180px] xl:w-[200px] aspect-square md:-mr-5 bg-white/10  rounded-full flex-col flex text-white items-center justify-center ">
          <div className="text-xl md:text-3xl xl:text-4xl font-profile-header">
            650+
          </div>
          <div className="text-sm md:text-base font-light">Happy Clients</div>
        </div>
        <div className="w-[150px] md:w-[180px] xl:w-[200px] aspect-square bg-white/10  rounded-full flex-col flex text-white items-center justify-center ">
          <div className="text-xl md:text-3xl xl:text-4xl font-profile-header">
            1123+
          </div>
          <div className="text-sm md:text-base font-light">
            Verified Reviews
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-7 md:gap-10 text-center items-center flex-wrap max-md:mt-16">
        <div className="min-w-[200px] max-w-[300px] text-pretty space-y-2">
          <div className="text-base font-profile-header">
            Verified Reviews You Can Trust
          </div>
          <p className="text-sm text-white/50">
            Browse real experiences so you can choose your artist with complete
            confidence.
          </p>
        </div>
        <div className="min-w-[200px] max-w-[300px] text-pretty space-y-2">
          <div className="text-base font-profile-header">Artist Portfolios</div>
          <p className="text-sm text-white/50">
            Artists showcase their best work while clients explore styles that
            inspire them.
          </p>
        </div>
        <div className="min-w-[200px] max-w-[300px] text-pretty space-y-2">
          <div className="text-base font-profile-header">Built on Trust</div>
          <p className="text-sm text-white/50">
            Every review is tied to real clients and real experiences, creating
            a reliable community
          </p>
        </div>
      </div>
    </div>
  );
};
