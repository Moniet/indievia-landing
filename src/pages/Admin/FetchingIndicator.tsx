import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const FetchingIndicator = ({ isRefetching = false }) => {
  return (
    <AnimatePresence>
      {isRefetching && (
        <motion.div
          exit={{ y: 20, opacity: 0 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-10 right-10 flex items-center"
        >
          <Loader2 className="size-5 animate-spin mr-2" />
          Fetching latest reviews
        </motion.div>
      )}
    </AnimatePresence>
  );
};
