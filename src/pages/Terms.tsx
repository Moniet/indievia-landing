import React from "react";
import Layout from "@/components/Layout";
import Nav from "@/components/Nav";

const Terms = () => {
  return (
    <div className="w-full h-full max-w-screen overflow-hidden">
      <Layout>
        <Nav />
      </Layout>
      <Layout>
        <main className="text-white sm:pt-20 mb-10">
          <h2 className="text-2xl sm:text-4xl [font-family:Scope_One,mono] text-balance max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%]">
            Terms of Service
          </h2>
          <div className="font-thin tracking-wider mt-6 sm:mt-8 text-[#d7d7d7] text-xs sm:text-base max-w-full sm:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%] space-y-6">
            <p>
              Welcome to IndieVia! Please read these Terms of Service carefully
              before using our website, products, and services (“Services”).
            </p>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using IndieVia, you agree to be bound by these
                Terms. If you do not accept these Terms, do not use our
                Services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                2. Eligibility
              </h3>
              <p>
                You must be at least 18 years old, or of legal age in your
                jurisdiction, to use our Services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                3. User Accounts
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password, and for all activities that occur under
                your account.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                4. Prohibited Conduct
              </h3>
              <ul className="list-disc list-inside ml-4">
                <li>Do not use IndieVia for unlawful purposes.</li>
                <li>Do not infringe on the rights of others.</li>
                <li>
                  Do not upload harmful, misleading, or inappropriate content.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                5. Intellectual Property
              </h3>
              <p>
                All content on IndieVia, including branding, logos, and platform
                code, is the property of IndieVia or its licensors and is
                protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                6. Disclaimer & Liability
              </h3>
              <p>
                Our Services are provided “as is” without warranties of any
                kind. IndieVia is not liable for any damages resulting from your
                use of the Services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">
                7. Changes to Terms
              </h3>
              <p>
                We may amend these Terms at any time by posting the updated
                version on this page. Your continued use of the Services
                signifies acceptance.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">8. Contact</h3>
              <p>
                If you have any questions about these Terms, please contact us
                via contact@indievia.com.
              </p>
            </section>

            <p className="italic text-[#999] pt-4">
              Last updated: {new Date().getFullYear()}
            </p>
          </div>
        </main>
      </Layout>
      <div className="flex overflow-hidden w-[200vw] mt-20 sm:mt-40 gap-3 sm:gap-5 px-4 sm:px-0">
        <img
          src="/about-page.webp"
          className="w-full sm:w-[100vw] h-auto animate-auto-scroll"
          alt="Decorative IndieVia imagery"
        />
        <img
          src="/about-page.webp"
          className="w-full sm:w-[100vw] h-auto animate-auto-scroll"
          alt="Decorative IndieVia imagery"
        />
      </div>
      <Layout>
        <footer className="mt-20 sm:mt-40 px-4 sm:px-0">
          <div className="w-full mt-8 flex flex-col sm:flex-row justify-between items-center pb-10 col-span-2 flex-wrap gap-4 sm:gap-10">
            <div className="flex items-center gap-3 text-zinc-100/50 text-xs sm:text-sm font-extralight w-fit">
              <img
                src="/indievia-text-logo.png"
                className="w-[70px] sm:w-[80px] h-auto mb-[8px]"
                alt="IndieVia logo"
              />
              <span>© {new Date().getFullYear()} — Copyright</span>
            </div>
            <div className="w-fit">
              <nav className="text-xs sm:text-sm font-extralight gap-6 sm:gap-8  flex items-center">
                <a href="/about" className="text-white/20 hover:text-white/50">
                  About
                </a>
                <a
                  href="/privacy"
                  className="text-white/20 hover:text-white/50"
                >
                  Privacy Policy
                </a>
                <a href="/terms" className="text-white/20 hover:text-white/50">
                  Terms of Service
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </Layout>
    </div>
  );
};

export default Terms;
