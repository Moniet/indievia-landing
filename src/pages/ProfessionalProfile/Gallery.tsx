import { useRef, useState, useEffect, useDeferredValue } from "react";
import {
  AnimatePresence,
  motion,
  MotionStyle,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Image = ({
  isHiding = false,
  id = 0,
  src = "",
  setId = (num: number) => {},
  show = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageZIndex, setImageZIndex] = useState(0);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isHiding) {
      setImageZIndex(1000000);
      setTimeout(() => {
        setImageZIndex(0);
      }, 500);
    }
  }, [isHiding]);

  return (
    <div
      className="size-full flex-shrink-0 relative cursor-pointer "
      onClick={() => setId(id)}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 animate-pulse bg-white/10 w-full h-full rounded-lg" />
      )}
      <AnimatePresence initial={false}>
        {show && (
          <motion.img
            transition={{
              duration: 0.5,
              type: "spring",
              damping: 20,
            }}
            src={src}
            style={{
              zIndex: imageZIndex,
            }}
            onLoad={() => setIsLoading(false)}
            alt={""}
            className={`pointer-events-none ${isLoading ? "opacity-0" : "opacity-1"} w-full h-full object-cover rounded-lg relative`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

type GalleryProps = {
  profileData?: unknown;
  isLoading?: boolean;
};

const Gallery = ({ profileData, isLoading }: GalleryProps) => {
  const [pagesCount, setPagesCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [showFade, setShowFade] = useState(true);
  const [imageModalId, setImageModalId] = useState<null | number>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [hidingImage, setHidingImage] = useState<number | null>(null);

  useEffect(() => {
    let to: NodeJS.Timeout;
    const makeHandleSizeChange =
      (withTimeout = true) =>
      () => {
        if (withTimeout) {
          clearTimeout(to);
          to = setTimeout(() => {
            const width = ref.current.getBoundingClientRect().width;
            setPageWidth(width);
            setPagesCount(
              Math.max(0, Math.ceil(ref.current.scrollWidth / width) - 1),
            );
          }, 100);
        } else {
          const width = ref.current.getBoundingClientRect().width;
          setPageWidth(width);
          setPagesCount(
            Math.max(0, Math.ceil(ref.current.scrollWidth / width) - 1),
          );
        }

        setPage(0);
      };

    const handleSizeChange = makeHandleSizeChange(true);
    makeHandleSizeChange(false)();

    window.addEventListener("resize", handleSizeChange, false);
    return () => {
      window.removeEventListener("resize", handleSizeChange, false);
    };
  }, []);

  return (
    <div>
      <div className="w-full relative">
        <div className="max-w-full relative overflow-hidden flex justify-center">
          <motion.div
            ref={ref}
            animate={{
              x: -page * pageWidth,
            }}
            drag={"x"}
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            onDragEnd={(_, info) => {
              // Only handle horizontal drags
              if (Math.abs(info.offset.x) > 50) {
                if (info.offset.x < 0 && page < pagesCount - 1) {
                  setPage(page + 1);
                } else if (info.offset.x > 0 && page > 0) {
                  setPage(page - 1);
                }
              }
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              damping: 20,
              // bounce: 0.05,
            }}
            className="grid gap-4 select-none grid-rows-[repeat(2,350px)] w-full auto-cols-[350px] grid-flow-col"
          >
            {profileData?.gallery?.map((image, i) => (
              <Image
                show={i !== imageModalId}
                key={i}
                src={image}
                id={i}
                isHiding={hidingImage === i}
                setId={setImageModalId}
              />
            ))}
          </motion.div>
        </div>
        {pagesCount > 1 && (
          <button
            className="absolute select-none z-2 top-1/2 right-0 -translate-y-1/2 translate-x-1/2 size-[40px] flex rounded-full bg-gray-500"
            onClick={() => setPage(Math.min(pagesCount - 1, page + 1))}
          >
            <span className="m-auto">
              <ChevronRight className="size-5" />
            </span>
          </button>
        )}
        {page > 0 && (
          <button
            className="absolute select-none z-2 top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 size-[40px] flex rounded-full bg-gray-500"
            onClick={() => setPage(Math.max(0, page - 1))}
          >
            <span className="m-auto">
              <ChevronLeft className="size-5" />
            </span>
          </button>
        )}
      </div>
      <div className="flex mt-5 select-none items-center gap-1 justify-center text-4xl">
        {Array(Math.max(0, pagesCount - 1))
          .fill("")
          .map((_, i) => (
            <span
              key={i}
              className={`transition-all duration-250 ${page === i ? "text-white" : "text-neutral-700"}`}
            >
              •
            </span>
          ))}
      </div>
      <AnimatePresence>
        {imageModalId !== null && (
          <motion.div
            className="bg-black/50 backdrop-blur-sm z-10 fixed top-0 left-0 w-screen h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setHidingImage(imageModalId);
              setImageModalId(null);
            }}
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {imageModalId !== null && (
          <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, filter: "blur(5px)", scale: 0.8 }}
              exit={{ opacity: 0, filter: "blur(5px)", scale: 0.6 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <motion.img
                className="pointer-events-none w-full h-full aspect-square rounded-xl object-cover"
                src={profileData?.gallery?.[imageModalId]}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
