import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import useUser from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Camera, PenBox } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";

const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters"),
  address: z.string().min(1, "Address is required"),
  bio: z.string().max(200, "Bio must be at most 200 characters"),
  position: z.string().max(100, "Position must be at most 100 characters"),
  facebook: z
    .string()
    .url("Not a valid URL")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  instagram: z
    .string()
    .url("Not a valid URL")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  twitter: z
    .string()
    .url("Not a valid URL")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  youtube: z
    .string()
    .url("Not a valid URL")
    .or(z.literal("").transform(() => undefined))
    .optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const EMPTY_IMAGE =
  "data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23EEE' width='80' height='80'/%3E%3C/svg%3E";

const EditProfileModal = ({
  open = true,
  defaultValues,
  onClose,
  mode,
  onSubmit: handleFinalSubmit,
}: {
  mode: "onboarding" | "editing";
  open?: boolean;
  defaultValues?: Partial<ProfileForm>;
  onClose?: () => void;
  onSubmit?: (values: ProfileForm) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedProfilePicUrl, setUploadedProfilePicUrl] = useState<
    string | null
  >(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [{ user }] = useUser();
  const queryClient = useQueryClient();
  const { clientId } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      address: "",
      bio: "",
      position: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      // profilePic: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        fullName: defaultValues.full_name ?? "",
        address: defaultValues.address ?? "",
        bio: defaultValues.bio ?? "",
        position: defaultValues.position ?? "",
        facebook: defaultValues.facebook ?? "",
        instagram: defaultValues.instagram ?? "",
        twitter: defaultValues.twitter ?? "",
        youtube: defaultValues.youtube ?? "",
      });
      setPreview(
        typeof defaultValues.profile_picture_url === "string"
          ? defaultValues.profile_picture_url
          : null,
      );
      setUploadedProfilePicUrl(
        typeof defaultValues.profile_picture_url === "string"
          ? defaultValues.profile_picture_url
          : null,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset]);

  // const profilePicList = watch("profilePic");

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // setValue("profilePic", files);
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= 3 * 1024 * 1024) {
        // update preview locally
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // immediately upload image
        setUploadingPic(true);
        const ext = file.name.split(".").pop() || "png";
        const filename = `${user.data.user.id}/avatar.${ext}`;
        const { error } = await supabase.storage
          .from("profile_pictures")
          .upload(filename, file, {
            upsert: true,
            contentType: file.type,
            cacheControl: "3600",
          });
        if (!error) {
          const { data } = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(filename);
          const publicUrl = data?.publicUrl ?? null;
          setUploadedProfilePicUrl(publicUrl);

          // Update the client-profiles table with the new image URL
          if (publicUrl && user.data.user.id) {
            await supabase
              .from("client-profiles")
              .update({ profile_picture_url: publicUrl })
              .eq("id", user.data.user.id);
          }
        }
        setUploadingPic(false);
      } else {
        setPreview(null);
        setUploadedProfilePicUrl(null);
      }
    } else {
      setPreview(null);
      setUploadedProfilePicUrl(null);
    }
  };

  const displayedPreview =
    preview ||
    (typeof defaultValues?.profilePic === "string"
      ? defaultValues?.profilePic
      : undefined) ||
    EMPTY_IMAGE;

  const onSubmit = async (values: ProfileForm) => {
    // profile picture already uploaded, use uploadedProfilePicUrl if available
    const profilePictureUrl =
      uploadedProfilePicUrl ?? defaultValues?.profilePic ?? null;

    // Call edge function with everything else
    const { data, error } = await supabase.functions.invoke(
      "save_client_profile",
      {
        body: {
          ...values,
          profilePictureUrl,
        },
      },
    );

    if (error) {
      alert("Update failed: " + error.message);
      return;
    }

    handleFinalSubmit?.({ ...values, profilePic: profilePictureUrl } as any);

    await queryClient.invalidateQueries({ queryKey: ["client-profile"] });
    if (onClose) onClose();
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[700px] overflow-y-scroll">
        <DialogHeader className="">
          <DialogTitle className="text-sm flex items-center">
            <PenBox className="size-4 mr-2" />
            {mode === "onboarding" ? "Complete Your Profile" : "Edit Profile"}
          </DialogTitle>
          <DialogDescription className="text-xs text-balance">
            {mode === "onboarding"
              ? "Add some info to your profile and customize how others view you on the site!"
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-4 ${mode === "onboarding" ? "mt-4" : ""}`}
          autoComplete="off"
        >
          {/* Profile picture upload with preview */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex gap-5">
              <div className="w-fit h-fit cursor-pointer relative">
                <img
                  src={displayedPreview ?? EMPTY_IMAGE}
                  className="size-28 object-cover bg-white rounded-lg"
                  alt="Profile preview"
                />
                <div className="size-6 select-none rounded-full bg-neutral-500 flex ml-auto -mr-2 -mt-4 relative z-1">
                  <Camera className="m-auto size-3" />
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload profile picture"
                  className="file:text-sm file:rounded file:bg-brand file:text-white size-full top-0 left-0 opacity-0 absolute"
                  onChange={handleFileInput}
                />
              </div>
              {/*<div className="">
                <div className="[&>div]:!text-[8px]">
                  <EarlySupporterPill />
                </div>
                <div></div>
              </div>*/}
            </div>
            {errors.profilePic && (
              <div className="text-xs text-red-600 mt-0.5">
                {errors.profilePic.message?.toString()}
              </div>
            )}
          </div>

          <div>
            <div>Profile</div>
            <div className="text-sm font-light text-white/50">
              How others will see you on the IndieVia.
            </div>
          </div>
          <Separator />
          <div>
            <Label htmlFor={"fullName"}>Full Name</Label>
            <Input
              className="mt-1 bg-white/5 border-0"
              {...register("fullName")}
              placeholder="Full Name"
              autoComplete="name"
              maxLength={100}
            />
            <div className="flex justify-between mt-0.5 text-xs h-0">
              <div className="text-red-600">{errors.fullName?.message}</div>
              <div className="opacity-60">
                {(watch("fullName") || "").length}/100
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor={"address"}>Address</Label>
            <Input
              className="mt-2 bg-white/5 border-0"
              {...register("address")}
              placeholder="Address"
              autoComplete="address-line1"
            />
            {errors.address && (
              <div className="text-xs text-red-600 mt-0.5">
                {errors.address.message}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              {...register("bio")}
              className="bg-white/5 border-0"
              placeholder="Bio"
              maxLength={200}
              rows={3}
            />
            <div className="flex justify-between mt-0.5 text-xs">
              <div className="text-red-600">
                {errors.bio?.message?.toString()}
              </div>
              <div className="opacity-60">
                {(watch("bio") || "").length}/200
              </div>
            </div>
          </div>

          {/* Position */}
          <div>
            <Label>Position</Label>
            <Input
              {...register("position")}
              placeholder="Designer, Tattoo Enthusiast, Musician etc."
              className="bg-white/5 border-0 mt-2"
              maxLength={50}
              autoComplete="organization-title"
            />
            <div className="flex justify-between mt-0.5 text-xs">
              <div className="text-red-600">
                {errors.position?.message?.toString()}
              </div>
              <div className="opacity-60">
                {(watch("position") || "").length}/50
              </div>
            </div>
          </div>

          {/* Social URLs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                {...register("facebook")}
                placeholder="Facebook URL"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-white/5 border-0"
              />
              {errors.facebook && (
                <div className="text-xs text-red-600 mt-0.5">
                  {errors.facebook.message}
                </div>
              )}
            </div>
            <div>
              <Input
                {...register("instagram")}
                placeholder="Instagram URL"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-white/5 border-0"
              />
              {errors.instagram && (
                <div className="text-xs text-red-600 mt-0.5">
                  {errors.instagram.message}
                </div>
              )}
            </div>
            <div>
              <Input
                {...register("twitter")}
                placeholder="Twitter URL"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-white/5 border-0"
              />
              {errors.twitter && (
                <div className="text-xs text-red-600 mt-0.5">
                  {errors.twitter.message}
                </div>
              )}
            </div>
            <div>
              <Input
                {...register("youtube")}
                placeholder="YouTube URL"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="bg-white/5 border-0"
              />
              {errors.youtube && (
                <div className="text-xs text-red-600 mt-0.5">
                  {errors.youtube.message}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 mt-1">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset();
                  setPreview(null);
                  if (onClose) onClose();
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingPic || !isDirty}
            >
              {uploadingPic ? "Uploading Picture..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
