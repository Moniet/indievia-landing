import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { LucideSearchX } from "lucide-react";

export const EmptyState = () => {
  return (
    <Empty className="relative border bg-white/5 max-w-[750px]">
      <EmptyHeader>
        <div className="border rounded-lg bg-white/5 p-2">
          <LucideSearchX className="size-4" />
        </div>
        <EmptyTitle>No results for this filter</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
};
