import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        // Allow responsive width/height if passed using className utilities
        className,
      )}
      {...props}
      // Responsive approach: Allow children or the parent to control sizing via className
      style={{
        width: undefined,
        height: undefined,
        ...(props.style || {}),
      }}
    />
  );
}

export { Skeleton };
