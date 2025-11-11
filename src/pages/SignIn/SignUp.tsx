import Nav from "@/components/Nav";
import { SignupForm } from "./signup-form";

const SignUp = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <Nav />
      <div className="w-full min-h-full pb-16 sm:pb-20 max-w-[1600px] mx-auto flex items-center justify-center">
        <div className="w-full max-w-[450px] mt-4 sm:mt-6 md:mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
