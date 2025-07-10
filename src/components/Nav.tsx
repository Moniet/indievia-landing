import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const isAbout = location.pathname.toLowerCase() == "/about";

  return (
    <nav className="w-full h-[150px] flex items-center justify-between text-white">
      <Link to="/">
        <h1 className="flex items-center">
          <img
            src="/indievia-text-logo.png"
            className="w-[80px] md:w-[100px] h-auto mb-1"
          />
          <span className="opacity-0 w-0 h-0 absolute top-0 -left-[1000]">
            Indie-Via
          </span>
        </h1>
      </Link>

      <div className="flex items-center gap-7 md:gap-10">
        <Link
          to="/"
          className={`font-light text-xs md:text-sm tracking-wide ${
            isAbout ? "opacity-50" : "opacity-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`font-light text-xs md:text-sm tracking-wide ${
            isAbout ? "opacity-100" : "opacity-50"
          }`}
        >
          About IndieVia
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
