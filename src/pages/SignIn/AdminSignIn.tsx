import Nav from "@/components/Nav";
import { AdminSignInForm } from "./admin-signin-form";

const AdminSignIn = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <Nav />
      <div className="w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
        <div className="w-full max-w-[450px] mt-4 sm:mt-6 md:mt-8">
          <AdminSignInForm />
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
