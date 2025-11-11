import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

const Layout = ({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        `w-full h-full px-4 sm:px-[4%] lg:px-[8%]  bg-[#0F0F0F] max-w-[1600px] mx-auto`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
