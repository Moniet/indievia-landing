import Nav from "@/components/Nav";
import { SignupForm } from "./signup-form";

const SignUp = () => {
  return (
    <div className="px-20">
      <Nav />
      <div className="w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
        <div className="max-w-[450px] mt-5">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
