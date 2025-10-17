import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleSignIn();
    // eslint-disable-next-line
  }, []);

  const handleSignIn = async () => {
    // Get the user
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    const userId = user?.id;

    const role: string | undefined = user?.user_metadata?.role;

    // Optionally create a profile if needed for new user
    if (userId && role) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (!existingProfile) {
        await supabase.from("profiles").insert([
          {
            user_id: userId,
            role,
          },
        ]);
      }
    }

    // Redirect based on role
    if (role === "client") {
      navigate(`/client/dashboard`, { replace: true });
    } else if (role === "professional") {
      navigate("/professional/dashboard", { replace: true });
    } else {
      // Fallback redirect in case of missing or invalid role
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center">
        <Loader2 className="size-6 animate-spin mr-2 duration-1000" />
        <span className="text-2xl">Confirming ...</span>
      </div>
    </div>
  );
};

export default ConfirmAuth;
