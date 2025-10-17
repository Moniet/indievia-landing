import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/use-store";
import { EarlySupporterPill } from "@/pages/ClientProfile/BasicInfo";
import {
  BadgeCheck,
  Camera,
  CheckCircle,
  CheckCircle2,
  Eye,
  Loader2,
  LucideSave,
  Plus,
  PlusCircle,
  PlusSquare,
} from "lucide-react";
import { ChangeEventHandler, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { saveProfile, ProfileForm } from "@/integrations/supabase/profile";
import Donut from "../Referrals/Donut";
import ProfileSkeletonLoader from "./ProfileSkeletonLoader";
import { useEffect } from "react";
import { useProfessionalProfile } from "@/hooks/use-professional-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/use-user";

// ------ BadgeDonut Component ------
const BadgeDonut = ({
  src,
  progress,
  children,
}: {
  src: string;
  progress: number;
  children?: React.ReactNode;
}) => (
  <div className="rounded-full select-none bg-neutral-700 size-[60px] p-2 flex items-center justify-center relative">
    <img
      src={src}
      className="translate-y-[9px] w-full h-auto"
      alt=""
      style={{
        filter: `saturate(${progress})`,
        transition: "filter 0.35s cubic-bezier(.42,0,.58,1)",
      }}
    />
    <div className="absolute top-0 left-0">
      <Donut
        radius={30}
        strokeColor="stroke-[#EE714E]"
        progress={progress}
        stroke={2}
      />
    </div>
    {progress === 1 && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-fit h-fit rounded-full">
        <CheckCircle2 className="size-5 text-white fill-green-500" />
      </div>
    )}
    {children}
  </div>
);
// ------ End BadgeDonut ------

const profileSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  fullName: z.string().min(2, { message: "Full name is required." }),
  position: z.string().min(2, { message: "Position is required." }),
  address: z.string().min(2, { message: "Address is required." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  website: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  tiktok: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  youtube: z
    .string()
    .url({ message: "Enter a valid URL." })
    .optional()
    .or(z.literal("")),
  slug: z
    .string()
    .min(1, { message: "URL path is required." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase, no spaces, and only letters, numbers, and hyphens.",
    }),
});

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Gallery = () => {
  const [{ user }] = useUser();
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.data?.user?.id;
    if (!userId) return;
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("professional_profiles")
        .select("gallery")
        .eq("user_id", userId)
        .single();
      if (!error && data && Array.isArray(data.gallery)) {
        setMediaUrls(data.gallery);
      }
    };
    fetchGallery();
  }, [user?.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = user?.data?.user?.id;
    if (!e.target.files?.length || !userId) return;
    setUploading(true);
    setUploadProgress(0);

    const file = e.target.files[0];
    const filePath = `${userId}/${Date.now()}_${file.name}`;

    const upload = supabase.storage.from("media").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      // @ts-ignore
      onUploadProgress: (ev: ProgressEvent) => {
        setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
      },
    });

    const { error } = await upload;

    setUploading(false);
    setUploadProgress(0);

    if (error) {
      alert("Oops! Upload failed: " + error.message);
      return;
    }

    const publicUrl = `https://jhnoomtsnovadyxgiurt.supabase.co/storage/v1/object/public/media/${filePath}`;
    setMediaUrls((prev) => [publicUrl, ...prev]);

    // Update gallery array in professional_profiles
    const { error: updateError } = await supabase
      .from("professional_profiles" as never)
      .update({
        gallery: [publicUrl, ...mediaUrls],
      })
      .eq("user_id", userId);

    if (updateError) {
      alert("Failed to update gallery: " + updateError.message);
    }
  };

  const confirmDelete = (url: string) => {
    setPendingDeleteUrl(url);
    setShowAlert(true);
  };

  const handleDelete = async () => {
    const userId = user?.data?.user?.id;
    if (!pendingDeleteUrl || !user?.id) return;
    setDeleting(pendingDeleteUrl);

    // Only delete within this user's folder
    const nameInFolder = pendingDeleteUrl.split(`/${user.id}/`).pop() || "";
    await supabase.storage.from("media").remove([`${user.id}/${nameInFolder}`]);
    setMediaUrls((prev) => prev.filter((u) => u !== pendingDeleteUrl));

    // Remove from gallery array in professional_profiles
    const filtered = mediaUrls.filter((u) => u !== pendingDeleteUrl);
    const { error: updateError } = await supabase
      .from("professional_profiles")
      .update({
        gallery: filtered,
      })
      .eq("user_id", userId);

    if (updateError) {
      alert("Failed to update gallery: " + updateError.message);
    }

    setDeleting(null);
    setShowAlert(false);
    setPendingDeleteUrl(null);
  };

  return (
    <div className="flex gap-4 max-w-full overflow-x-auto">
      {/* Upload card design */}
      <div className="size-48 rounded-lg bg-white/10 flex cursor-pointer border border-zinc-400 shrink-0 z-2 sticky left-0">
        <div className="relative size-full flex">
          <div className="m-auto">
            <div className="flex items-center text-sm m-auto">
              <Plus className="mr-2 size-5" />
              Click to add images
            </div>
          </div>
          <input
            id="media-upload"
            type="file"
            accept="image/*"
            className="opacity-0 absolute top-0 size-full"
            disabled={uploading}
            onChange={handleUpload}
          />
          {uploading && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              <span className="text-xs">Uploading... {uploadProgress}%</span>
            </div>
          )}
        </div>
      </div>
      {/* Images */}
      {mediaUrls.map((url) => (
        <div
          className="size-48 min-w-48 rounded-lg bg-white/5 relative group flex items-center justify-center overflow-hidden z-1"
          key={url}
        >
          <img
            src={url}
            className="object-cover w-full h-full rounded-lg"
            alt="gallery item"
          />
          <button
            onClick={() => confirmDelete(url)}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-70 group-hover:opacity-100 transition"
            disabled={deleting === url}
            title="Delete image"
          >
            <Plus className="rotate-45 text-white w-5 h-5" />
          </button>
        </div>
      ))}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const Profile = () => {
  const profilePictureUrl = useStore((s) => s.userProfileUrl);
  const setProfilePicture = useStore((s) => s.setUserProfileUrl);
  const name = useStore((s) => s.fullName);
  const [{ profileData, refetch }, isLoadingProfile] = useProfessionalProfile();
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

  const [slugAvailable, setSlugAvailable] = useState<null | boolean>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const slugCheckRef = useRef<number>();

  const [{ user }] = useUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<import("@/integrations/supabase/profile").ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      fullName: "",
      position: "",
      address: "",
      bio: "",
      website: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      twitter: "",
      youtube: "",
    },
  });

  const fullName = watch("fullName");

  // Hydrate form when data arrives
  useEffect(() => {
    if (profileData) {
      reset({
        email: profileData.email || "",
        fullName:
          profileData.full_name ||
          user.data.user?.user_metadata?.fullName ||
          "Add Name",
        position: profileData.position || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
        slug: profileData.slug || "",
        website: profileData.website || "",
        instagram: profileData.instagram || "",
        facebook: profileData.facebook || "",
        tiktok: profileData.tiktok || "",
        twitter: profileData.twitter || "",
        youtube: profileData.youtube || "",
      });
    }
  }, [profileData, reset]);

  const onSubmit = async (data: ProfileForm) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) {
      // You can display an error notification here
      console.error("User not authenticated");
      return;
    }
    const userId = userData.user.id;
    setIsPublishing(true);
    const { error } = await saveProfile(data, userId);
    setIsPublishing(false);
    if (error) {
      // Handle the error (show UI notification if desired)
      console.error("Failed to save profile:", error.message);
      alert("Failed to save profile: " + error.message);
    } else {
      // Optionally show success notification!
      refetch();

      toast("Profile published!");

      console.log("Profile saved successfully!");
    }
  };

  // SKELETON LOADER
  if (isLoadingProfile) {
    return <ProfileSkeletonLoader />;
  }

  const getNameFallback = (str?: string) =>
    str ? str.split(" ")[0][0] + str.split(" ")?.[1]?.[0] : "Default";

  const handleProfileUpload: ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    setUploadingProfilePic(true);
    const file = e.target.files[0];
    const userId = user?.data?.user?.id;
    const ext = file.name.split(".").pop();
    const filename = `${userId}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("profile_pictures")
      .upload(filename, file, { upsert: true, cacheControl: "3600" });

    const { data } = await supabase.storage
      .from("profile_pictures")
      .getPublicUrl(filename);

    const publicUrl = data?.publicUrl;

    if (publicUrl) {
      const { error } = await supabase
        .from("professional_profiles" as never)
        .upsert(
          {
            profile_picture_url: publicUrl,
            user_id: userId,
          },
          { onConflict: "user_id" },
        );

      setProfilePicture(publicUrl);

      toast("Updated profile picture!");
      if (error) {
        alert("Error when uploading: " + error.message);
      } else {
        toast("Profile picture updated!");
      }
    }

    setUploadingProfilePic(false);
    refetch();
  };

  return (
    <div className="w-full h-full">
      <div className="w-full realtive justify-between flex pt-20 px-12 bg-gradient-to-b rounded-tl-lg rounded-tr-lg p-5 from-brand/40 via-brand/10 to-transparent">
        <div className="">
          <div className="relative flex items-center">
            <div
              className={`relative ${uploadingProfilePic ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Avatar className="size-[100px] relative">
                <AvatarImage src={profilePictureUrl} className="size-[100px]" />
                <AvatarFallback>{getNameFallback(fullName)}</AvatarFallback>
              </Avatar>
              <div className="bg-zinc-700 size-6 rounded-full flex items-center justify-center ml-auto -translate-y-full">
                {uploadingProfilePic ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Camera className="size-3" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="opacity-0 absolute top-0 size-full"
                onChange={handleProfileUpload}
              />
            </div>
            <div className="pl-5">
              <EarlySupporterPill isSmall />
              <div className="text-2xl mt-2 flex items-center">
                {fullName || "*Add your name below*"}{" "}
                <BadgeCheck className="size-6 text-blue-400 ml-2" />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-lg">Profile</div>
            <div className="text-sm 22-neutral-500 font-light text-white/50">
              This is how others will view you on the site.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-base">My Badges</div>
          <div className="text-xs text-neutral-500 font-light">
            Give 2 more referrals to unlock the Golden profile name
          </div>
          <div className="flex gap-5 mt-2">
            <BadgeDonut src="/badge-founding-year.png" progress={1} />
            <BadgeDonut src="/badge-5-refs.png" progress={0} />
            <BadgeDonut src="/badge-10-refs.png" progress={0} />
            <BadgeDonut src="/badge-verified-og.png" progress={0} />
          </div>
        </div>
      </div>
      <div className="px-12 flex-1 overflow-y-auto pb-20">
        <Separator className="mb-5" />
        <form
          className="space-y-10 w-2/3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <Label>Contact Email</Label>
            <Input
              className="border-0 bg-white/10 mt-2"
              placeholder={"e.g: me@tatstudio.com"}
              {...register("email")}
              autoComplete="email"
            />
            {errors.email && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.email.message}
              </div>
            )}
            <div className="text-xs text-white/50 font-light mt-2">
              Email where customers can contact you.
            </div>
          </div>
          <div>
            <Label>Full Name</Label>
            <Input
              className="border-0 bg-white/10 mt-2"
              placeholder={"Enter you full name here"}
              {...register("fullName")}
              autoComplete="name"
            />
            {errors.fullName && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.fullName.message}
              </div>
            )}
            <div className="text-xs text-white/50 font-light mt-2">
              Your name / title as seen by customers.
            </div>
          </div>
          <div>
            <Label>Position</Label>
            <Input
              className="border-0 bg-white/10 mt-2"
              placeholder={
                "e.g: Senior Tattoo Designer, Certified Body Piercing Expert "
              }
              {...register("position")}
            />
            {errors.position && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.position.message}
              </div>
            )}
            <div className="text-xs text-white/50 font-light mt-2">
              Let customers know about your expertise.
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input
              className="border-0 bg-white/10 mt-2"
              placeholder={"Location of your practice or parlour"}
              {...register("address")}
              autoComplete="street-address"
            />
            {errors.address && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.address.message}
              </div>
            )}
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea
              className="border-0 bg-white/10 mt-2 "
              placeholder={
                "I'm a highly experienced tattooist, with a degree in fine-arts amd take pride in creating hyper-realistic tattoos as well as..."
              }
              {...register("bio")}
              rows={5}
            />
            {errors.bio && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.bio.message}
              </div>
            )}
            <div className="text-xs text-white/50 font-light mt-2">
              Tell customers about what makes you the best!
            </div>
          </div>
          <div>
            <Label>URL path</Label>
            <Input
              className="border-0 bg-white/10 mt-2"
              placeholder="your-url-path"
              {...register("slug")}
              onChange={(e) => {
                let val = e.target.value
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-");
                e.target.value = val;
                if (
                  typeof getValues === "function" &&
                  typeof setValue === "function"
                ) {
                  setValue("slug", val, { shouldValidate: true });
                }
                setSlugAvailable(null);
                setCheckingSlug(true);
                if (slugCheckRef.current) {
                  clearTimeout(slugCheckRef.current);
                }
                slugCheckRef.current = window.setTimeout(async () => {
                  if (!val) {
                    setSlugAvailable(null);
                    setCheckingSlug(false);
                    return;
                  }
                  // check Supabase for slug
                  const { data } = await supabase
                    .from("professional_profiles")
                    .select("id")
                    .eq("slug", val)
                    .limit(1)
                    .single();
                  setSlugAvailable(!data);
                  setCheckingSlug(false);
                }, 600);
              }}
            />
            {checkingSlug ? (
              <div className="text-xs text-yellow-300 font-light mt-2">
                Checking availability...
              </div>
            ) : slugAvailable === false ? (
              <div className="text-xs text-red-400 font-light mt-2">
                That URL path is taken.
              </div>
            ) : slugAvailable === true ? (
              <div className="text-xs text-green-400 font-light mt-2">
                URL path is available!
              </div>
            ) : null}
            {errors.slug && (
              <div className="text-xs text-red-400 font-light mt-2">
                {errors.slug.message}
              </div>
            )}
            <div className="text-xs text-white/50 font-light mt-2">
              This will be the URL of your profile (eg:{" "}
              <code>
                yourdomain.com/profile/<b>{watch("slug") || "your-url-path"}</b>
              </code>
              )
            </div>
          </div>
          <div>
            <Label>Social media URLs</Label>
            <div className="text-xs font-light text-white/50 mb-5 mt-2">
              Add links to your website or social media.
            </div>
            <div className="gap-2 grid grid-cols-2">
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="Website"
                  {...register("website")}
                  autoComplete="url"
                />
                {errors.website && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.website.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="Instagram"
                  {...register("instagram")}
                  autoComplete="url"
                />
                {errors.instagram && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.instagram.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="Facebook"
                  {...register("facebook")}
                  autoComplete="url"
                />
                {errors.facebook && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.facebook.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="TikTok"
                  {...register("tiktok")}
                  autoComplete="url"
                />
                {errors.tiktok && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.tiktok.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="Twitter"
                  {...register("twitter")}
                  autoComplete="url"
                />
                {errors.twitter && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.twitter.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  className="bg-white/10 border-0"
                  placeholder="Youtube"
                  {...register("youtube")}
                  autoComplete="url"
                />
                {errors.youtube && (
                  <span className="text-xs text-red-400 font-light mt-1 block">
                    {errors.youtube.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label asChild>
              <div>Gallery</div>
            </Label>
            <div className="flex mt-5 gap-4 max-w-full overflow-x-auto">
              {/* Gallery Section */}
              <Gallery />
            </div>
          </div>
          <div className="space-x-3 flex sticky bottom-0 left-0">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-white/20 flex items-center text-sm hover:bg-white/20 transition-colors bg-white/10"
              onClick={() => {}}
            >
              <Eye className="size-4 mr-2" />
              Preview
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 hover:bg-white/80 transition-colors rounded-md  bg-white text-black font-medium text-sm border border-white/10 flex items-center justify-center"
            >
              {!isPublishing && (
                <>
                  <LucideSave className="size-4 mr-2" /> Publish Profile
                </>
              )}
              {isPublishing && (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Publishing...
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
