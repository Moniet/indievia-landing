import React from "react";
import Layout from "@/components/Layout";
import Nav from "@/components/Nav";

const Privacy = () => {
  return (
    <div className="w-full h-full max-w-screen overflow-hidden">
      <Layout>
        <Nav />
      </Layout>
      <Layout>
        <main className="text-white sm:pt-20 mb-10">
          <h2 className="text-2xl sm:text-4xl [font-family:Scope_One,mono] text-balance max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%]">
            Privacy Policy
          </h2>
          <div className="font-thin tracking-wider mt-6 sm:mt-8 text-[#d7d7d7] text-xs sm:text-base max-w-full sm:max-w-[75%] lg-max-w-[60%] xl:max-w-[50%] space-y-6">
            <p>
              Your privacy is important to us at IndieVia. This Privacy Policy explains how we collect, use, store, and safeguard your information when you access our services.
            </p>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">1. Information We Collect</h3>
              <ul className="list-disc list-inside ml-4">
                <li>Personal identification information (Name, email address, etc.) when you sign up or use our services.</li>
                <li>Usage data (pages visited, features used, etc.).</li>
                <li>Any other information you voluntarily provide.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">2. How We Use Information</h3>
              <ul className="list-disc list-inside ml-4">
                <li>To provide and improve our services.</li>
                <li>To send communications or updates with your consent.</li>
                <li>To ensure safety and prevent misuse.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">3. Sharing Your Information</h3>
              <p>
                We do not sell your personal information. We may share information with service providers as required to deliver the IndieVia service, or if legally compelled.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">4. Data Security</h3>
              <p>
                We implement best practices to secure your data, but please be aware no method of electronic transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">5. Your Rights</h3>
              <ul className="list-disc list-inside ml-4">
                <li>Access, update, or delete your personal data by contacting us.</li>
                <li>Opt out of marketing communications at any time.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">6. Children’s Privacy</h3>
              <p>
                IndieVia does not knowingly collect or solicit personal information from anyone under the age of 13.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">7. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy. Changes will be posted here and your continued use of the service constitutes agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-white mt-6 mb-1">8. Contact Us</h3>
              <p>
                For questions about your privacy or this policy, email us at contact@indievia.com.
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
              <nav className="text-xs sm:text-sm font-extralight gap-6 sm:gap-8 text-white/20 flex items-center">
                <a href="/about">About</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
              </nav>
            </div>
          </div>
        </footer>
      </Layout>
    </div>
  );
};

export default Privacy;
