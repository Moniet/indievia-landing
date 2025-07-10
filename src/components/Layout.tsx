import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full px-4 sm:px-[4%] lg:px-[8%]">{children}</div>
  );
};

export default Layout;
