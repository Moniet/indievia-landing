import Layout from "@/components/Layout";
import Nav from "@/components/Nav";

const About = () => {
  return (
    <div className="w-full h-full max-w-screen overflow-hidden">
      <Layout>
        <Nav />
      </Layout>
      <Layout>
        <main className="text-white  sm:pt-20">
          <h2 className="text-2xl sm:text-4xl [font-family:Scope_One,mono] text-balance max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%]">
            About IndieVia - Redefining How People Discover Tattoo Artists
          </h2>
          <p className="font-thin tracking-wider mt-6 sm:mt-8 text-[#d7d7d7] text-xs sm:text-base max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%]">
            We’re building a better way for people to find and connect with
            independent tattoo artists and beauty professionals.
          </p>
          <p className="font-thin tracking-wider mt-4 text-[#d7d7d7] text-xs sm:text-base max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%]">
            Unlike traditional directories or booking platforms, our focus is on
            real reviews, local discovery, and giving power back to the
            professionals. Whether you’re a tattoo artist, makeup artist,
            aesthetician, or hairstylist — we believe your reputation should
            speak louder than an algorithm.
          </p>
        </main>
      </Layout>
      <div className="flex overflow-hidden w-[200vw] mt-20 sm:mt-40 gap-3 sm:gap-5 px-4 sm:px-0">
        <img
          src="/about-page.webp"
          className="w-full sm:w-[100vw] h-auto animate-auto-scroll"
        />
        <img
          src="/about-page.webp"
          className="w-full sm:w-[100vw] h-auto animate-auto-scroll"
        />
      </div>
      <Layout>
        <footer className="mt-20 sm:mt-40 px-4 sm:px-0">
          <div className="w-full mt-8 flex flex-col sm:flex-row justify-between items-center pb-10 col-span-2 flex-wrap gap-4 sm:gap-10">
            <div className="flex items-center gap-3 text-zinc-100/50 text-xs sm:text-sm font-extralight w-fit">
              <img
                src="/indievia-text-logo.png"
                className="w-[70px] sm:w-[80px] h-auto mb-[8px]"
              />
              <span>© {new Date().getFullYear()} — Copyright</span>
            </div>
            <div className="w-fit">
              <nav className="text-xs sm:text-sm font-extralight gap-6 sm:gap-8 text-white/20 flex items-center">
                <a>About</a>
                <a>Privacy Policy</a>
                <a>Terms of Service</a>
              </nav>
            </div>
          </div>
        </footer>
      </Layout>
    </div>
  );
};

export default About;
