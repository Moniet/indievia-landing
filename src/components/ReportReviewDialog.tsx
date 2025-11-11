import { AnimatePresence, motion } from "framer-motion";
import { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import useUser from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { CheckCheckIcon, Loader2 } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { useReviews } from "@/pages/ProfessionalDashboard/ManageReviews/useReviews";

const complaints = [
  "hate speech / discrimination",
  "harassment / bullying",
  "graphic or explicit content",
  "spam / irrelevant content",
  "misleading or deceptive",
  "threats or violence",
  "illegal or harmful content",
  "privacy violation",
];

const SuccessScreen = () => {
  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Empty className="border bg-white/5">
        <div className="p-1 border rounded">
          <CheckCheckIcon />
        </div>
        <EmptyHeader>
          <EmptyTitle>Your report has been submitted.</EmptyTitle>
          <EmptyDescription>
            You'll be notified when action is taken against the offending post.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </motion.div>
  );
};

export const ReportingReviewDialog = ({
  children,
  review_id,
}: PropsWithChildren<{ review_id: string }>) => {
  const [reportType, setReportType] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { refetch } = useReviews();

  const handleSetReport = (val: string) => {
    const temp = reportType.includes("something else")
      ? reportType.filter((r) => r != "something else")
      : reportType;
    if (reportType.includes(val)) {
      setError("");
      setReportType(reportType.filter((item) => item !== val));
    } else {
      if (reportType.length >= 3) {
        return setError("Only 3 options allowed.");
      } else {
        setError("");
      }
      setReportType([...temp, val]);
    }
  };

  const handleSubmit = async () => {
    if (!reportType.length) {
      setError("Please choose an option.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("report_review", {
        body: {
          message,
          report_type: reportType,
          review_id,
        },
      });

      if (data) {
        setSuccess(true);
        await refetch();
      } else if (error) {
        setError(error?.message || "Oops! Something went wrong, try again.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this review</DialogTitle>
          <DialogDescription className="text-balance">
            Pick up to 3 options that fit best, or describe your issue in the
            message box
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <AnimatePresence mode="popLayout">
          {!success && (
            <motion.div
              exit={{ y: -20, opacity: 0, transition: { duration: 0.5 } }}
              initial={{ y: 0, opacity: 1 }}
              className="mt-5"
            >
              <div>
                <div className="gap-2 mb-2 flex flex-wrap">
                  {complaints.map((val) => (
                    <button
                      key={val}
                      className={`${reportType.includes(val) ? "!border-white/20 bg-white/10 text-white" : ""}  active:scale-95 duration-500 hover:border-white/20 hover:bg-white/10 transition-all capitalize py-2 px-2 text-white/50 border border-white/10 rounded-lg text-sm`}
                      onClick={() => handleSetReport(val)}
                    >
                      {val}
                    </button>
                  ))}
                  <button
                    className={`${reportType.includes("something else") ? "!border-blue-500/20 bg-blue-500/50 !text-white" : ""}  active:scale-95 duration-500 hover:border-blue-500/20 hover:bg-blue-400/50 hover:text-white/50 transition-all capitalize py-2 px-2 text-blue-500/50 border border-blue-500/10 bg-blue-900/5 rounded-lg text-sm`}
                    onClick={() =>
                      setReportType(
                        reportType.includes("something else")
                          ? reportType.filter((r) => r !== "something else")
                          : ["something else"],
                      )
                    }
                  >
                    Something else
                  </button>

                  {/*<button
                key={val}
                className={`${reportType.includes(val) ? "!border-white/20 bg-white/10 text-white" : ""}  active:scale-95 duration-500 hover:border-white/20 hover:bg-white/10 transition-all capitalize py-1 px-2 text-white/50 border border-white/5 rounded-lg text-sm`}
                onClick={() => handleSetReport(val)}
              >
                {val}
              </button>*/}
                </div>
              </div>
              <div className="mt-5">
                <Label>Message (optional)</Label>
                <Textarea
                  placeholder=""
                  className="mt-2 bg-white/10"
                  cols={5}
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>
              <div className="text-xs font-light text-red-500 empty:hidden my-2">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {success && <SuccessScreen />}
        </AnimatePresence>
        <DialogFooter className="mt-5 gap-1">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!success && (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Loading
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
