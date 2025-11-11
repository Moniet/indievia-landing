import { useMemo } from "react";
import { CardSkeleton } from "./CardSkeleton";
import { useBugReports } from "./useBugReports";
import { InboxMessage } from "./types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloseInboxMessageAlert } from "./CloseInboxMessageAlert";
import { EmptyState } from "./EmptyState";
import { FetchingIndicator } from "./FetchingIndicator";
import { useHelpAndSupport } from "./useHelpAndSupport";
import { useContactMessages } from "./useContactMessages";

const Card = ({
  report,
  refetch,
}: {
  report: InboxMessage;
  refetch: () => void;
}) => {
  const message =
    report.message.length > 250
      ? report.message.slice(0, 200) + "..."
      : report.message;

  const date = Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })
    .format(new Date(report.created_at))
    .replace(",", " | ");

  return (
    <div className="border rounded-lg border-white/10 p-5 max-w-[750px]">
      <div className="text-xs text-white/50">
        <time dateTime={report.created_at}>{date}</time>
      </div>
      <div className="text-sm font-medium mt-3">{report.subject}</div>
      <p className="text-sm mt-1  text-white/70 font-light max-w-[500px] text-pretty">
        {message}
      </p>
      <div className="flex gap-2 mt-4 justify-end">
        {report.status === "open" && (
          <CloseInboxMessageAlert
            title="Close Contact Message Ticket"
            ctaLabel="Close Ticket"
            report_id={report.id}
            refetch={refetch}
          />
        )}
        <a
          className="p-2 rounded-full text-xs px-5 border-amber-600 border text-amber-600 transition-color hover:bg-amber-600/20"
          href={`mailto:${report.from_email}?subject=${report.subject}`}
        >
          Reply
        </a>
      </div>
    </div>
  );
};

export const ContactMessages = () => {
  const {
    isLoading,
    data,
    status,
    setStatus,
    hasNextPage,
    isFetching,
    isRefetching,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
  } = useContactMessages();

  const reports = useMemo(() => {
    return data?.pages?.flatMap((item) => item.reports);
  }, [data]);

  return (
    <div className="flex-1 py-12 pr-5 pl-0">
      <div className="flex justify-between max-md:flex-col">
        <div>
          <div className="">Contact Messages</div>
          <div className="text-sm text-white/50 mb-5 md:mb-10">
            Messages and queries received from the public facing site.
          </div>
        </div>
        <Select onValueChange={(s) => setStatus(s)} defaultValue="open">
          <SelectTrigger
            className="w-fit border-none bg-white/10 px-5 rounded-full"
            value={status}
            defaultValue={"open"}
          >
            <SelectValue placeholder="Select a Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"open"}>Open tickets</SelectItem>
            <SelectItem value={"closed"}>Closed tickets</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col max-w-[750px] gap-5 max-md:mt-10">
        {isLoading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
        {!isLoading && !reports?.length && <EmptyState />}
        {reports?.map((item) => (
          <Card report={item} key={item.id} refetch={refetch} />
        ))}
        {hasNextPage && (
          <Button
            variant="normal"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
            className="w-fit px-10"
          >
            {isFetchingNextPage ? "Loading ..." : "Load more"}
          </Button>
        )}
        {(isFetching || isRefetching) && <FetchingIndicator />}
      </div>
    </div>
  );
};
