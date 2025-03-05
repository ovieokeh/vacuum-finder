import { Helmet } from "react-helmet";
import { Footer } from "../components/footer";
import { PageHeader } from "../components/page-header";

export const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Robot Vacuum Buyer Tool</title>
        <meta name="description" content="Read the privacy policy for the Vacuum Finder website." />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <PageHeader title="Privacy Policy" subtitle="Last Updated: March 5, 2025" />

        {/* Main Content */}
        <main className="flex-grow mx-auto max-w-7xl px-6 py-8 md:py-12 text-sm md:text-base leading-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              At Vacuum Finder, we respect your privacy. This policy explains how we collect, use, and share your
              personal information when you use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Personal Data:</strong> Information you provide directly, such as your name, email address, or
                preferences.
              </li>
              <li>
                <strong>Usage Data:</strong> Automatically collected information such as IP address, browser type, and
                pages visited.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>
              We use your data to provide and improve our services, personalize your experience, and communicate with
              you about updates or offers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Cookies and Tracking</h2>
            <p>
              We may use cookies, beacons, and similar tracking technologies to collect information about your browsing
              activities. You can disable cookies in your browser settings, but this may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Data Sharing & Transfers</h2>
            <p>
              We do not sell your personal information. We may share data with trusted third parties who assist us in
              providing services, subject to strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights regarding access, correction, or deletion of your
              personal data. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Security</h2>
            <p>
              We employ industry-standard measures to protect your data. However, no security system is impenetrable,
              and we cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please email us at
              <a href="mailto:privacy@vacuumfinder.com" className="ml-1 text-blue-600 hover:underline">
                privacy@vacuumfinder.com
              </a>
              .
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
