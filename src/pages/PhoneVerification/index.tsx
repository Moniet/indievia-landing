import Nav from "@/components/Nav";
import { PhoneNumber } from "./PhoneNumber";
import { useState } from "react";
import { OTPForm } from "./OTPForm";

const PhoneVerification = () => {
  const [page, setPage] = useState(0);
  const [phone, setPhone] = useState("");

  return (
    <div className="container flex flex-col h-screen">
      <Nav />
      <div className="flex-1 flex justify-center align-center">
        {page === 1 && <OTPForm phone={phone} prev={() => setPage(0)} />}
        {page === 0 && (
          <PhoneNumber
            phone={phone}
            setPhone={setPhone}
            next={() => setPage(1)}
          />
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
