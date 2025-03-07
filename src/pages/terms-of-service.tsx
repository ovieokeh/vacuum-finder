import { Helmet } from "react-helmet";
import { Footer } from "../components/footer";
import { PageHeader } from "../components/page-header";

export const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Robot Vacuum Buyer Tool</title>
        <meta name="description" content="Read the terms of service for the Vacuum Finder website." />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header / Hero */}
        <PageHeader title="Terms of Service" subtitle="Last Updated: March 5, 2025" showBreadcrumbs />

        {/* Main Content */}
        <main className="flex-grow mx-auto max-w-[1200px] px-6 py-8 md:py-12 text-sm md:text-base leading-6 text-text/90 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Vacuum Finder website ("Service"), you agree to be bound by these Terms of
              Service and all applicable laws. If you do not agree, please discontinue use of this Service immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will provide notice of significant
              changes by posting updates within the Service or via email. Continued use of the Service indicates your
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
            <ul className="list-disc pl-4 space-y-2">
              <li>You agree not to use the Service for any unlawful or prohibited activities.</li>
              <li>
                You are responsible for the accuracy and legality of any information you provide through the Service.
              </li>
              <li>You agree to maintain the security of your account and password.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
            <p>
              All content, software, and other materials included on the Service are the property of Vacuum Finder or
              its licensors and are protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Disclaimers</h2>
            <p>
              The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or
              implied, and hereby disclaim any implied warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p>
              In no event shall Vacuum Finder be liable for any direct, indirect, incidental, special, or consequential
              damages arising from your use of the Service or inability to access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of [Your Jurisdiction].
              Any disputes relating to these terms shall be brought in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              <a href="mailto:info@vacuumfinder.com" className="ml-1 text-blue-600 hover:underline">
                info@vacuumfinder.com
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
