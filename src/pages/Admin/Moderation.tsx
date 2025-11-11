import { useMemo, useState } from "react";
import { useModeration, Report, Filter } from "./useModeration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRightFromSquare, Search, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModerationDismiss } from "./ModerationDismiss";
import { CardSkeleton } from "./CardSkeleton";
import { EmptyState } from "./EmptyState";
import { Separator } from "@/components/ui/separator";
import { ModerationBlock } from "./ModerationBlock";
import { ModerationBlockAndBan } from "./ModerationBlockAndBan";

const ReportCard = ({ report, filter }: { report: Report; filter: Filter }) => {
  const { refetch } = useModeration({ filter });
  const onSuccess = () => refetch();

  return (
    <div className="max-w-[750px]">
      <div className="mb-3 flex items-end gap-2">
        {report.report_type.map((type) => (
          <div
            className="text-xs font-light p-[5px] px-[10px]  border-blue-500 text-blue-500 border rounded-full"
            key={type}
          >
            {type}
          </div>
        ))}
      </div>
      <div className="max-w-[750px] space-y-5 w-full border border-white/10 p-5 rounded-lg ">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="pt-1 flex gap-2">
                <Link
                  to={`/professional/${report.p_slug}`}
                  className="hover:scale-105 transition-transform"
                >
                  <div className="flex items-start gap-2">
                    <div>
                      <Avatar className="size-10 border">
                        <AvatarImage src={report.p_picture} />
                        <AvatarFallback>
                          <User2 className="size-3" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-white/80">
                        {report.p_full_name}
                      </div>
                      <div className="text-white/50">reported this review</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <time
              dateTime={report.created_at}
              className="text-sm text-muted-foreground flex-shrink-0"
            >
              {new Date(report.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>

        <div className="border-l-4 px-4 py-3 rounded-lg bg-white/5 shadow-xl">
          <div>
            <blockquote className="text-sm text-white/70 italic">
              "{report.review}"{" "}
            </blockquote>
          </div>

          <div>
            <Link to={`/client/${report?.client_id}`} className="inline-block">
              <div className="flex mt-4 gap-2 items-center p-2 w-fit bg-black/20 border border-white/5 rounded-lg">
                <Avatar className="size-6 border">
                  <AvatarImage src={report.c_profile_picture} />
                  <AvatarFallback>
                    <User2 className="size-4" />
                  </AvatarFallback>
                </Avatar>{" "}
                <span className="w-fit text-sm text-white/80 hover:text-white/100">
                  {report.client_full_name}
                </span>
                <ArrowUpRightFromSquare className="size-3" />
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {report.status === "open" && (
            <ModerationDismiss report_id={report.id} onSuccess={onSuccess} />
          )}
          {!["blocked", "blocked_and_banned"].includes(report.status) && (
            <ModerationBlock
              report_id={report.id}
              review_id={report.review_id}
              onSuccess={onSuccess}
            />
          )}
          {report.status !== "blocked_and_banned" && (
            <ModerationBlockAndBan
              status={report.status}
              onSuccess={onSuccess}
              report_id={report.id}
              review_id={report.review_id}
              ban_user={{
                client_id: report.client_id,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const Moderation = () => {
  const [filter, setFilter] = useState<Filter>("open");
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useModeration({
    filter,
  });
  const reports = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.reports);
  }, [data]);
  const onSuccess = () => refetch();

  const title = (() => {
    if (filter === "banned") return "Banned + Blocked User & Review";
    if (filter === "blocked") return "Blocked Reviews";
    if (filter === "read") return "Reports (Read)";
    if (filter === "ignored") return "Dismissed Reports";
    return "Lastest Reported Reviews";
  })();
  return (
    <div className="flex-1 flex-col p-5 pl-0">
      <div className="flex w-full max-md:flex-col max-md:gap-5 justify-between md:items-center pt-5">
        <div className="text-base max-md:hidden md:text-lg capitalize flex gap-2">
          {title}
        </div>
        <div className="flex gap-5">
          <Select
            value={filter}
            defaultValue="open"
            onValueChange={(value) => setFilter(value as Filter)}
          >
            <SelectTrigger className="border-none bg-white/10 w-fit rounded-full text-sm px-5">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="mr-1">
              <SelectItem value="open" className="pr-2">
                Un-Resolved Reports
              </SelectItem>
              {/*<SelectItem value="read">Reports Marked as Read</SelectItem>*/}
              <SelectItem value="blocked">Blocked Reviews</SelectItem>
              <SelectItem value="banned">
                Banned &amp; blocked User + Review
              </SelectItem>
              <SelectItem value="ignored">Dismissed Reports</SelectItem>
            </SelectContent>
          </Select>

          {/*<div className="flex items-center">
            <Search className="size-5 -mr-8 z-10 relative" />
            <Input placeholder="Search" className="ml-auto w-60 pl-10" />
          </div>*/}
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        {isLoading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
        {!isLoading && !reports?.length && <EmptyState />}
        {reports?.map((report) => (
          <ReportCard report={report} key={report.id} filter={filter} />
        ))}
        {hasNextPage && (
          <Button
            variant="normal"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-fit px-10"
          >
            {isFetchingNextPage ? "Loading ..." : "Load more"}
          </Button>
        )}
      </div>
      {!hasNextPage && (
        <div className="pt-10 max-w-[750px] text-sm font-light text-white/50 text center">
          <Separator />{" "}
          <div className="bg-[#191919] px-3 -translate-y-1/2 w-fit mx-auto">
            End Of Page
          </div>
        </div>
      )}
    </div>
  );
};
