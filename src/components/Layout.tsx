import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

const Layout = ({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        `w-full h-full px-4 sm:px-[4%] lg:px-[8%]  bg-[#0F0F0F]`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
